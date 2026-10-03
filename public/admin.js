(()=>{'use strict';const $=id=>document.getElementById(id);let csrf='',stream=null,state={sessions:[],audit:[],pages:{}},selected=null,pending=null,connected=false;const statuses={online:'Online',offline:'Offline',disconnected:'Koneksi terputus',sent:'Dikirim',applied:'Diterapkan',rejected:'Ditolak',expired:'Kedaluwarsa',help_requested:'Bantuan diminta',help_resolved:'Bantuan ditangani'};const date=t=>new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Jakarta',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(new Date(t))+' WIB';

// Store only the selected filter value on this browser, never session data.
const filterPreferenceKey='kbstar.admin.session-filter.v1';
function restoreFilterPreference(){
 try{const saved=localStorage.getItem(filterPreferenceKey);if([...$('filter').options].some(option=>option.value===saved))$('filter').value=saved;}catch{}
}
let filterFeedbackTimer=null;
function showFilterFeedback(saved){
 clearTimeout(filterFeedbackTimer);filterFeedbackTimer=null;
 const feedback=$('filter-feedback');feedback.classList.toggle('is-error',!saved);
 feedback.textContent=saved?'Filter tersimpan':'Filter gagal disimpan. Setelah refresh, pilihan ini mungkin berubah.';
 if(saved)filterFeedbackTimer=setTimeout(()=>{feedback.textContent='';filterFeedbackTimer=null;},2500);
}
function changeFilter(){
 let saved=false;try{localStorage.setItem(filterPreferenceKey,$('filter').value);saved=true;}catch{}
 showFilterFeedback(saved);render();
}
restoreFilterPreference();

// Keep highlight age by session ID so normal table refreshes do not restart it.
const nameHighlightDuration=800,knownSessionNames=new Map(),nameHighlightStarts=new Map();let nameHighlightTimer=null;
function trackNameChanges(sessions){
 const ids=new Set(),now=performance.now();
 for(const s of sessions){ids.add(s.id);if(knownSessionNames.has(s.id)&&knownSessionNames.get(s.id)!==s.name)nameHighlightStarts.set(s.id,now);knownSessionNames.set(s.id,s.name);}
 for(const id of knownSessionNames.keys())if(!ids.has(id)){knownSessionNames.delete(id);nameHighlightStarts.delete(id);}
}
function highlightNameRow(row,id){
 const start=nameHighlightStarts.get(id);if(start===undefined)return;
 const elapsed=performance.now()-start;if(elapsed>=nameHighlightDuration){nameHighlightStarts.delete(id);return;}
 row.classList.add('name-updated');row.style.setProperty('--name-highlight-delay',-elapsed+'ms');
}
function expireNameHighlights(){
 clearTimeout(nameHighlightTimer);nameHighlightTimer=null;const now=performance.now();let next=Infinity;
 for(const [id,start]of nameHighlightStarts){const remaining=nameHighlightDuration-(now-start);if(remaining<=0)nameHighlightStarts.delete(id);else next=Math.min(next,remaining);}
 for(const row of $('users').querySelectorAll('tr.name-updated'))if(!nameHighlightStarts.has(row.querySelector('[data-session]')?.dataset.session)){row.classList.remove('name-updated');row.style.removeProperty('--name-highlight-delay');}
 if(next!==Infinity)nameHighlightTimer=setTimeout(expireNameHighlights,Math.ceil(next));
}
document.addEventListener('visibilitychange',expireNameHighlights);

const recentNameWindow=5*60*1000;let recentNameTimer=null;
function recentNameNow(){return waitServerTime+performance.now()-waitMonotonic;}
function hasRecentName(session,now){const at=session.nameUpdatedAt;return Number.isFinite(at)&&at<=now&&now-at<recentNameWindow;}
function scheduleRecentNameExpiry(){
 clearTimeout(recentNameTimer);recentNameTimer=null;
 if(document.hidden)return;
 const now=recentNameNow(),remaining=state.sessions.filter(s=>hasRecentName(s,now)).map(s=>s.nameUpdatedAt+recentNameWindow-now);
 if(remaining.length)recentNameTimer=setTimeout(render,Math.max(10,Math.ceil(Math.min(...remaining))));
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Number.isFinite(state.serverTime))render();else scheduleRecentNameExpiry();});

// Relative ages use the last server clock and monotonic elapsed time.
let nameAgeTimer=null;
function nameAgeText(at,now){
 const seconds=Math.max(0,Math.floor((now-at)/1000));
 if(seconds===0)return 'Nama baru saja diperbarui';
 const [value,unit]=seconds<60?[seconds,'detik']:seconds<3600?[Math.floor(seconds/60),'menit']:seconds<86400?[Math.floor(seconds/3600),'jam']:[Math.floor(seconds/86400),'hari'];
 return `Nama diperbarui ${value} ${unit} lalu`;
}
function appendNameAge(container,session){
 if(!Number.isFinite(session.nameUpdatedAt))return;
 const age=node('small',nameAgeText(session.nameUpdatedAt,recentNameNow()),'name-update-age');
 age.dataset.nameUpdatedAt=String(session.nameUpdatedAt);age.title=date(session.nameUpdatedAt);container.append(age);
}
function stopNameAges(){clearTimeout(nameAgeTimer);nameAgeTimer=null;}
function syncNameAges(){
 stopNameAges();if(document.hidden)return;
 const ages=$('users').querySelectorAll('[data-name-updated-at]'),now=recentNameNow();
 for(const age of ages){const text=nameAgeText(Number(age.dataset.nameUpdatedAt),now);if(age.textContent!==text)age.textContent=text;}
 if(ages.length)nameAgeTimer=setTimeout(syncNameAges,1000);
}
document.addEventListener('visibilitychange',syncNameAges);
addEventListener('pagehide',stopNameAges);addEventListener('pageshow',syncNameAges);

function syncDataFreshness(){
 const warning=$('stale-data');warning.hidden=connected;
 if(!connected){const text=Number.isFinite(state.serverTime)?`Menampilkan data terakhir · Diperbarui ${date(state.serverTime)}. Menunggu koneksi kembali.`:'Koneksi terputus. Data sesi belum berhasil dimuat.';if(warning.textContent!==text)warning.textContent=text;}
}
function resetFilters(){$('search').value='';$('filter').value='all';changeFilter();}

// Keep copy feedback attached to a session ID through live table refreshes.
const copyStates=new Map();let copyTimer=null;
function paintCopyButton(button,id){
 const status=copyStates.get(id)?.phase;
 button.textContent=status==='busy'?'Menyalin…':status==='done'?'Tersalin ✓':status==='error'?'Salin gagal':'Salin ID';
 button.disabled=status==='busy';button.classList.toggle('is-error',status==='error');
 button.title=status==='error'?'Coba lagi atau salin ID lengkap dari panel Detail.':'Salin ID sesi lengkap';
 button.setAttribute('aria-label',`${button.textContent} · sesi ${id.slice(0,8)}`);
}
function syncCopyButtons(){
 clearTimeout(copyTimer);copyTimer=null;const now=performance.now(),ids=new Set(state.sessions.map(s=>s.id));let next=Infinity;
 for(const [id,status] of copyStates){
  if(!ids.has(id)||(status.expires!==undefined&&status.expires<=now))copyStates.delete(id);
  else if(status.expires!==undefined)next=Math.min(next,status.expires-now);
 }
 for(const button of $('users').querySelectorAll('[data-copy-session]'))paintCopyButton(button,button.dataset.copySession);
 if(!document.hidden&&next!==Infinity)copyTimer=setTimeout(syncCopyButtons,Math.ceil(next));
}
async function copySessionId(id){
 if(copyStates.get(id)?.phase==='busy')return;
 const restoreFocus=document.activeElement?.dataset?.copySession===id,status={phase:'busy'};copyStates.set(id,status);syncCopyButtons();
 try{
  if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
  await navigator.clipboard.writeText(id);if(copyStates.get(id)!==status)return;
  status.phase='done';status.expires=performance.now()+2500;$('copy-feedback').textContent=`ID sesi ${id.slice(0,8)} tersalin lengkap.`;
 }catch{
  if(copyStates.get(id)!==status)return;
  status.phase='error';$('copy-feedback').textContent=`Gagal menyalin ID sesi ${id.slice(0,8)}. Coba lagi atau salin ID lengkap dari panel Detail.`;
 }
 syncCopyButtons();
 if(restoreFocus&&(document.activeElement===document.body||document.activeElement?.dataset?.copySession===id))$('users').querySelector(`[data-copy-session="${id}"]`)?.focus({preventScroll:true});
}
function sessionIdentity(session){
 const group=node('div','','session-id-row'),shortId=node('small',session.id.slice(0,8)),copy=node('button','Salin ID','copy-session');
 copy.type='button';copy.dataset.copySession=session.id;copy.onclick=()=>copySessionId(session.id);paintCopyButton(copy,session.id);group.append(shortId,copy);return group;
}
document.addEventListener('visibilitychange',syncCopyButtons);
addEventListener('pagehide',()=>{clearTimeout(copyTimer);copyTimer=null;});addEventListener('pageshow',syncCopyButtons);

const helpWait=document.createElement('p');helpWait.id='help-wait';helpWait.hidden=true;helpWait.style.cssText='font-weight:600;color:#6827a2;font-variant-numeric:tabular-nums';$('help-detail-copy').after(helpWait);
let waitTimer=null,waitServerTime=0,waitMonotonic=0;
function waitingText(h,now){const seconds=Math.max(0,Math.floor(((h.status==='resolved'?h.resolvedAt:now)-h.createdAt)/1000));const hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60),rest=seconds%60;return (h.status==='resolved'?'Waktu tunggu: ':'Menunggu ')+(hours?hours+' jam ':'')+(minutes||hours?minutes+' menit ':'')+rest+' detik';}
function renderWait(){const h=state.sessions.find(s=>s.id===selected)?.help;helpWait.hidden=!h;if(h)helpWait.textContent=waitingText(h,waitServerTime+performance.now()-waitMonotonic)+(!connected?' · Status terakhir':'');}
function syncWait(){clearInterval(waitTimer);waitTimer=null;renderWait();if(!document.hidden&&state.sessions.find(s=>s.id===selected)?.help?.status==='pending')waitTimer=setInterval(renderWait,1000);}
document.addEventListener('visibilitychange',syncWait);
addEventListener('pagehide',()=>{clearInterval(waitTimer);waitTimer=null;});
addEventListener('pageshow',syncWait);
async function api(path,data){const r=await fetch('/api/admin/'+path,{method:data===undefined?'GET':'POST',headers:data===undefined?{}:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:data===undefined?undefined:JSON.stringify(data)});const d=await r.json();if(!r.ok)throw Error(d.error||'Permintaan gagal');return d;}
function node(tag,text,cls){const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;return e;}
function enter(admin){csrf=admin.csrf;$('admin-name').textContent=admin.username;$('login').hidden=true;$('app').hidden=false;stream?.close();stream=new EventSource('/api/admin/events');stream.addEventListener('snapshot',e=>{connected=true;state=JSON.parse(e.data);waitServerTime=state.serverTime;waitMonotonic=performance.now();$('connection').textContent='● Terhubung langsung';$('connection').classList.add('live');render();});stream.onerror=()=>{connected=false;$('connection').textContent='Koneksi terputus · menyambungkan';$('connection').classList.remove('live');syncDataFreshness();details();};}
$('login-form').addEventListener('submit',async e=>{e.preventDefault();$('login-submit').disabled=true;$('login-error').textContent='';try{const d=await api('login',{username:$('username').value,password:$('password').value});$('password').value='';enter(d);}catch(err){$('login-error').textContent=err.message;}finally{$('login-submit').disabled=false;}});
$('logout').onclick=async()=>{try{await api('logout',{});stream?.close();location.reload();}catch(e){$('connection').textContent=e.message;}};
function render(){syncDataFreshness();const sessions=state.sessions;trackNameChanges(sessions);$('total').textContent=sessions.length;for(const status of ['online','disconnected','offline'])$(status).textContent=sessions.filter(s=>s.status===status).length;$('updated').textContent=date(state.serverTime);const q=$('search').value.toLowerCase(),f=$('filter').value,filterClock=recentNameNow();$('name-filter-note').hidden=f!=='name-updated';$('help-order-note').hidden=f!=='needs-help';$('recent-name-count').textContent=sessions.filter(s=>hasRecentName(s,filterClock)).length+' nama diperbarui · 5 menit';$('filter').closest('.filters').classList.toggle('name-filter-active',f==='name-updated');$('help-filter').textContent=sessions.filter(s=>s.help?.status==='pending').length+' butuh bantuan';const filtered=sessions.filter(s=>(f==='all'||f===s.status||(f==='needs-help'&&s.help?.status==='pending')||(f==='name-updated'&&hasRecentName(s,filterClock)))&&(s.name.toLowerCase().includes(q)||s.id.includes(q)));if(f==='name-updated')filtered.sort((a,b)=>b.nameUpdatedAt-a.nameUpdatedAt||a.id.localeCompare(b.id));if(f==='needs-help')filtered.sort((a,b)=>a.help.createdAt-b.help.createdAt||a.id.localeCompare(b.id));$('count').textContent=filtered.length+' sesi';const focused=document.activeElement?.dataset?.session,focusedCopy=document.activeElement?.dataset?.copySession;const frag=document.createDocumentFragment();for(const s of filtered){const tr=document.createElement('tr');if(s.id===selected)tr.className='selected';highlightNameRow(tr,s.id);const who=document.createElement('td');who.append(node('strong',s.name||'Nama belum diisi'),sessionIdentity(s));appendNameAge(who,s);if(s.help?.status==='pending')who.append(node('span','Minta Bantuan','help-badge'));tr.append(who,node('td',state.pages[s.page]||s.page));const status=document.createElement('td');status.append(node('span',statuses[s.status],'badge '+s.status));tr.append(status,node('td',date(s.lastActivity)));const action=document.createElement('td'),btn=node('button','Detail','view-session');btn.dataset.session=s.id;btn.setAttribute('aria-label','Detail sesi '+s.id.slice(0,8));btn.onclick=()=>{selected=s.id;render();};action.append(btn);tr.append(action);frag.append(tr);}$('users').replaceChildren(frag);expireNameHighlights();scheduleRecentNameExpiry();syncNameAges();syncCopyButtons();if(focusedCopy)$('users').querySelector(`[data-copy-session="${focusedCopy}"]`)?.focus({preventScroll:true});if(focused)$('users').querySelector(`[data-session="${focused}"]`)?.focus({preventScroll:true});$('empty').hidden=filtered.length>0;$('show-all-sessions').hidden=filtered.length>0||sessions.length===0||(f==='all'&&!q);$('empty').textContent=f==='name-updated'?'Tidak ada nama yang cocok dalam 5 menit terakhir.':sessions.length?'Tidak ada sesi yang cocok.':'Belum ada sesi. Buka halaman prototipe melalui server ini.';details();const audit=document.createDocumentFragment();for(const a of state.audit){const row=node('div','','audit-row');row.append(node('span','','audit-dot'));const text=document.createElement('div');text.append(node('strong',`${statuses[a.status]} · ${state.pages[a.from]||a.from} → ${state.pages[a.to]||a.to}`),node('small',`${a.actor} · sesi ${a.sessionId.slice(0,8)} · ${a.reason||'Menunggu perangkat pengguna'}`));row.append(text,node('time',date(a.at)));audit.append(row);}if(!state.audit.length)audit.append(node('p','Belum ada tindakan admin.','empty'));$('audit').replaceChildren(audit);}
let helpResolving=false;
function details(){syncWait();const s=state.sessions.find(x=>x.id===selected);$('detail-empty').hidden=!!s;$('detail-content').hidden=!s;if(!s)return;$('selected-name').textContent=s.name||'Nama belum diisi';$('selected-id').textContent=s.id;$('selected-page').textContent=state.pages[s.page];$('selected-status').textContent=statuses[s.status];$('help-detail').hidden=!s.help;if(s.help){$('help-detail-copy').textContent=(s.help.status==='pending'?'Menunggu admin':'Ditangani')+' · '+state.pages[s.help.page]+' · '+date(s.help.createdAt)+(s.help.resolvedAt?' · Ditangani '+date(s.help.resolvedAt):'');$('help-resolve').disabled=!connected||helpResolving||s.help.status!=='pending';}const signature=JSON.stringify(s.allowed);if($('target').dataset.signature!==signature){const old=$('target').value;$('target').replaceChildren(...s.allowed.map(v=>{const o=node('option',state.pages[v]);o.value=v;return o;}));if(s.allowed.includes(old))$('target').value=old;$('target').dataset.signature=signature;}$('send').disabled=!connected||s.status!=='online'||!s.allowed.length||s.command?.status==='sent';$('route-help').textContent=s.allowed.length?'Hanya halaman yang pernah dibuka dan masih memenuhi syarat alur.':'Navigasi belum tersedia pada tahap ini atau proses sedang berjalan. Dashboard dan analisis dipantau tanpa kendali navigasi.';$('command-state').textContent=s.command?`${statuses[s.command.status]} · ${state.pages[s.command.target]}${s.command.reason?' — '+s.command.reason:''}`:'Belum ada arahan.';}
$('help-filter').onclick=()=>{$('filter').value='needs-help';changeFilter();};
$('help-resolve').onclick=async()=>{const s=state.sessions.find(x=>x.id===selected);if(!s?.help||s.help.status!=='pending'||helpResolving)return;helpResolving=true;$('help-error').textContent='';details();try{await api('help/resolve',{sessionId:s.id,helpId:s.help.id});}catch(e){$('help-error').textContent=e.message;}finally{helpResolving=false;details();}};
$('search').oninput=render;$('filter').onchange=changeFilter;
$('reset-filter').onclick=resetFilters;$('show-all-sessions').onclick=resetFilters;
$('route-form').onsubmit=e=>{e.preventDefault();const s=state.sessions.find(x=>x.id===selected);if(!s||$('send').disabled)return;pending={sessionId:s.id,target:$('target').value,requestId:crypto.randomUUID()};$('confirm-name').textContent=s.name||'Nama belum diisi';$('confirm-id').textContent='ID sesi: '+s.id;$('confirm-target').textContent=(state.pages[s.page]||s.page)+' → '+state.pages[pending.target];$('command-error').textContent='';$('confirm-send').disabled=false;$('confirm').showModal();};
$('confirm-send').onclick=async()=>{if(!pending)return;$('confirm-send').disabled=true;try{await api('command',pending);$('confirm').close();pending=null;}catch(e){$('command-error').textContent=e.message;$('confirm-send').disabled=false;}};
api('me').then(enter).catch(()=>{});
})();
