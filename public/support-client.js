(() => {
 'use strict';
 if(!/^https?:$/.test(location.protocol)||!window.kbAdminSupport)return;
 const bridge=window.kbAdminSupport;let session=null,stopped=false,active=true,busy=false,queued=false,last='',serverOffset=0;
 const processed=new Map();
 let helpState=null,helpSending=false,helpConnected=false;
 const helpPanel=document.createElement('section');helpPanel.id='kb-support-help';helpPanel.setAttribute('aria-label','Pendampingan admin');
 const helpCopy=document.createElement('div'),helpTitle=document.createElement('strong'),helpNote=document.createElement('p'),helpButton=document.createElement('button');
 helpTitle.textContent='Perlu pendampingan?';helpNote.id='kb-help-status';helpNote.setAttribute('role','status');helpNote.textContent='Menghubungkan layanan bantuan…';
 helpButton.type='button';helpButton.id='kb-help-request';helpButton.textContent='Minta Bantuan';helpButton.disabled=true;helpButton.setAttribute('aria-describedby','kb-help-status');
 helpCopy.append(helpTitle,helpNote);helpPanel.append(helpCopy,helpButton);(document.getElementById('kb-indonesia-shell')||document.body).append(helpPanel);
 const helpStyle=document.createElement('style');helpStyle.textContent='#kb-support-help{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:16px;width:calc(100% - 32px);max-width:1168px;margin:16px auto 24px;padding:16px 20px;background:#fff;border:1px solid #e6dcee;border-radius:16px;color:#45225e;font:14px/1.5 system-ui}#kb-support-help strong{font-size:14px}#kb-help-status{font-size:12px;color:#786486;margin:4px 0 0}#kb-help-request{flex:none;min-height:44px;border:0;border-radius:12px;padding:10px 18px;background:#6827a2;color:white;font:600 13px/1.5 system-ui;cursor:pointer}#kb-help-request:disabled{opacity:.6;cursor:default}#kb-help-request:focus-visible{outline:3px solid #e7bf30;outline-offset:3px}@media(max-width:430px){#kb-support-help{align-items:stretch;flex-direction:column;gap:12px;padding:16px}#kb-help-request{width:100%}}';document.head.append(helpStyle);

 const helpWait=document.createElement('p');helpWait.id='kb-help-wait';helpWait.hidden=true;helpWait.style.cssText='margin:6px 0 0;font-size:12px;font-weight:600;color:#6827a2;font-variant-numeric:tabular-nums';helpCopy.append(helpWait);
 let waitTimer=null,waitServerTime=0,waitMonotonic=0;
 function waitingText(h,now){const seconds=Math.max(0,Math.floor(((h.status==='resolved'?h.resolvedAt:now)-h.createdAt)/1000));const hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60),rest=seconds%60;return (h.status==='resolved'?'Waktu tunggu: ':'Menunggu ')+(hours?hours+' jam ':'')+(minutes||hours?minutes+' menit ':'')+rest+' detik';}
 function renderWait(){helpWait.hidden=!helpState;if(helpState)helpWait.textContent=waitingText(helpState,waitServerTime+performance.now()-waitMonotonic)+(!helpConnected?' · Status terakhir':'');}
 function syncWait(){clearInterval(waitTimer);waitTimer=null;renderWait();if(!stopped&&!document.hidden&&helpState?.status==='pending')waitTimer=setInterval(renderWait,1000);}
 document.addEventListener('visibilitychange',syncWait);
 addEventListener('pagehide',()=>{clearInterval(waitTimer);waitTimer=null;});
 addEventListener('pageshow',()=>syncWait());
 function acceptHelp(next){if(!next){helpState=null;return;}if(helpState?.id===next.id&&helpState.status==='resolved'&&next.status==='pending')return;if(helpState&&next.createdAt<helpState.createdAt)return;helpState=next;}
 function renderHelp(){
 syncWait();
 helpButton.disabled=helpSending||!helpConnected||helpState?.status==='pending';
 helpButton.textContent=helpSending?'Mengirim…':helpState?.status==='pending'?'Permintaan terkirim':helpState?.status==='resolved'?'Minta Bantuan Lagi':'Minta Bantuan';
 if(helpState?.status==='pending')helpNote.textContent=helpConnected?'Permintaan Anda menunggu admin. Tidak perlu mengirim ulang.':'Permintaan sudah tersimpan di server. Menyambungkan kembali…';
 else if(helpState?.status==='resolved')helpNote.textContent=helpConnected?'Admin menandai permintaan Anda ditangani. Jika masih perlu, Anda dapat meminta bantuan lagi.':'Menyambungkan kembali untuk memperbarui status bantuan…';
 else helpNote.textContent=helpConnected?'Kirim halaman aktif Anda agar admin mengetahui letak kendalanya.':'Layanan bantuan belum terhubung. Belum ada permintaan yang dikirim.';
 }
 helpButton.addEventListener('click',async()=>{
 if(helpButton.disabled)return;helpSending=true;renderHelp();
 try{await report(true);acceptHelp(await api('/help',{page:bridge.snapshot().page}));}
 catch(e){helpNote.textContent=e.message==='429'?'Tunggu 30 detik sejak permintaan sebelumnya untuk mengirim lagi.':'Belum dapat memastikan permintaan terkirim. Coba lagi saat tersambung.';helpSending=false;helpButton.disabled=!helpConnected;helpButton.textContent='Coba Kirim Lagi';return;}
 helpSending=false;renderHelp();
 });

 const banner=document.createElement('div');banner.setAttribute('role','status');banner.setAttribute('aria-live','polite');banner.hidden=true;banner.style.cssText='position:fixed;left:16px;right:16px;bottom:18px;max-width:440px;margin:auto;z-index:100001;background:#fff;color:#4d2370;border:1px solid #dac8ec;border-left:4px solid #7528a9;border-radius:14px;padding:15px 18px;box-shadow:0 8px 30px #32144526;font:14px/1.5 system-ui';document.body.appendChild(banner);let bannerTimer;
 function notify(text){banner.textContent=text;banner.hidden=false;clearTimeout(bannerTimer);bannerTimer=setTimeout(()=>banner.hidden=true,5000);}
 async function api(path,data){const r=await fetch('/api/session'+path,{method:'POST',headers:{'Content-Type':'application/json',...(session?{Authorization:'Bearer '+session.token}:{})},body:JSON.stringify(data)});if(!r.ok)throw Error(String(r.status));return r.json();}
 async function report(force=false){if(!session||stopped)return;const state=bridge.snapshot(),key=JSON.stringify(state);if(!force&&!active&&key===last)return;if(busy){queued=true;return;}busy=true;try{await api('/state',{...state,active});last=key;active=false;}catch{}finally{busy=false;if(queued){queued=false;setTimeout(()=>report(),100);}}}
 async function command(c){if(!c||typeof c.id!=='string')return;if(c.expires<=Date.now()+serverOffset)return;
 let ack=processed.get(c.id);if(!ack){const snap=bridge.snapshot();let result={ok:false,page:snap.page};if(snap.allowed.includes(c.target))result=bridge.navigate(c.target);ack={commandId:c.id,status:result.ok?'applied':'rejected',page:result.page};processed.set(c.id,ack);if(result.ok)notify('Admin mengarahkan Anda ke halaman yang dipilih. Isian Anda tetap tersimpan.');else notify('Arahan admin tidak diterapkan karena kondisi atau syarat halaman berubah.');}
 try{await api('/ack',ack);await report(true);}catch{}
 }
 async function connect(){while(!stopped){try{const r=await fetch('/api/session/events',{headers:{Authorization:'Bearer '+session.token}});if(r.status===401){session=await api('',{});helpState=null;last='';await report(true);continue;}if(!r.ok)throw Error('connect');const reader=r.body.getReader(),decoder=new TextDecoder();let buffer='';while(!stopped){const {done,value}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});let end;while((end=buffer.indexOf('\n\n'))>=0){const frame=buffer.slice(0,end);buffer=buffer.slice(end+2);const event=frame.match(/^event: (.+)$/m)?.[1],raw=frame.match(/^data: (.+)$/m)?.[1];if(!raw)continue;const data=JSON.parse(raw);if(event==='ready'){serverOffset=data.serverTime-Date.now();waitServerTime=data.serverTime;waitMonotonic=performance.now();helpConnected=true;acceptHelp(data.help||null);renderHelp();await report(true);}if(event==='help'){acceptHelp(data);renderHelp();}if(event==='command')await command(data);}}}catch{}helpConnected=false;renderHelp();if(!stopped)await new Promise(r=>setTimeout(r,2000));}}
 for(const name of ['pointerdown','keydown'])document.addEventListener(name,()=>{active=true;},{passive:true});
 for(const event of ['input','change'])document.addEventListener(event,e=>{if(e.target.id==='ks-demo-fullname'){active=true;report();}});
 let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>report(),100);}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden']});
 document.addEventListener('visibilitychange',()=>report(true));
 addEventListener('pagehide',()=>{stopped=true;if(session)fetch('/api/session/leave',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.token},body:'{}',keepalive:true}).catch(()=>{});});
 addEventListener('pageshow',e=>{if(e.persisted){stopped=false;connect();report(true);}});
 setInterval(()=>report(true),5000);
 (async()=>{try{session=await api('',{});await report(true);notify('Prototype independen: sesi, nama yang Anda isi, dan halaman aktif dapat dipantau admin pendamping.');connect();}catch{helpConnected=false;renderHelp();notify('Pendampingan admin belum tersambung. Anda tetap dapat menggunakan prototipe.');}})();
})();
