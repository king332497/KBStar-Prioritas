import http from 'node:http';
import https from 'node:https';
import {randomBytes,randomUUID,scryptSync,timingSafeEqual} from 'node:crypto';
import {readFileSync,writeFileSync,appendFileSync,existsSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const PAGES={home:'Beranda',hero:'Pembuka pinjaman',login:'Login',verify:'Verifikasi Data',code:'Kode simulasi',calculator:'Data Pengajuan',documents:'Dokumen',loaninfo:'Informasi Pinjaman',disbursement:'Rekening Pencairan',confirmation:'Persetujuan',analysis:'Analisis',dashboard:'Dashboard',transfer:'Transfer',accounts:'Akun',products:'Produk',menu:'Menu',notifications:'Notifikasi',other:'Halaman lainnya'};
export const ROUTES=['hero','login','verify','code','calculator','documents','loaninfo','disbursement','confirmation'];
const token=()=>randomBytes(32).toString('hex');
export function makeAdmin(username,password){if(!username.trim()||password.length<12)throw Error('Nama admin wajib diisi dan sandi minimal 12 karakter.');const salt=token();return {username:username.trim(),salt,hash:scryptSync(password,salt,64).toString('hex')};}
export function createService({admin,publicDir,dataDir,secure=false,clock=Date.now,commandTtl=15000,staleMs=20000}){
 mkdirSync(dataDir,{recursive:true});const sessions=new Map(),admins=new Map(),watchers=new Map(),attempts=new Map(),creates=new Map();
 const auditPath=path.join(dataDir,'audit.jsonl');let audit=[];
 if(existsSync(auditPath)){audit=readFileSync(auditPath,'utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l)).slice(-500);for(const row of [...audit].filter(x=>x.status==='sent')){if(!audit.some(x=>x.commandId===row.commandId&&x.status!=='sent'))record({...row,status:'expired',reason:'Server dimulai ulang',at:clock()});}}
 function record(row){const entry={...row,at:clock()};appendFileSync(auditPath,JSON.stringify(entry)+'\n',{mode:0o600});audit.push(entry);audit=audit.slice(-500);}
 const status=s=>s.closed?'offline':s.stream&&clock()-s.seen<staleMs?'online':'disconnected';
 const publicSession=s=>({id:s.id,name:s.name,nameUpdatedAt:s.nameUpdatedAt,page:s.page,allowed:s.allowed,status:status(s),lastActivity:s.activity,lastSeen:s.seen,created:s.created,help:s.help,command:s.command?{...s.command}:null});
 const snapshot=()=>({sessions:[...sessions.values()].map(publicSession),audit:audit.slice(-100).reverse(),pages:PAGES,serverTime:clock()});
 function emit(res,event,data){if(!res.destroyed)res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);}
 function broadcast(){for(const [res,a] of watchers)if(a.expires>clock())emit(res,'snapshot',snapshot());else{res.end();watchers.delete(res);}}
 function finish(s,result,reason){const c=s.command;if(!c||c.status!=='sent')return;record({actor:c.actor,sessionId:s.id,commandId:c.id,from:c.from,to:c.target,status:result,reason});Object.assign(c,{status:result,reason,finished:clock()});broadcast();}
 const sweep=setInterval(()=>{for(const s of sessions.values()){if(s.command?.status==='sent'&&s.command.expires<=clock())finish(s,'expired','Batas waktu konfirmasi habis');if(clock()-s.seen>86400000){s.stream?.end();sessions.delete(s.id);}}for(const [k,a] of admins)if(a.expires<=clock())admins.delete(k);for(const m of [attempts,creates])for(const [k,v] of m)if(v.until<=clock())m.delete(k);for(const [res,a] of watchers)if(a.expires<=clock()){res.end();watchers.delete(res);}else res.write(': keepalive\n\n');broadcast();},1000);sweep.unref();
 const json=(res,code,data)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
 const body=async req=>{let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>8192)throw {status:413,message:'Permintaan terlalu besar'};}try{return JSON.parse(raw||'{}')}catch{throw {status:400,message:'JSON tidak valid'}}};
 const allowedFields=(data,keys)=>{if(!data||typeof data!=='object'||Array.isArray(data)||Object.keys(data).some(k=>!keys.includes(k)))throw {status:400,message:'Data tidak diizinkan'};};
 const getAdmin=req=>{const v=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('kb_admin='))?.slice(9);const a=admins.get(v);if(!a||a.expires<=clock())throw {status:401,message:'Silakan masuk sebagai admin'};return [v,a];};
 const getSession=req=>{const bearer=(req.headers.authorization||'').replace(/^Bearer /,'');for(const s of sessions.values())if(s.token===bearer)return s;throw {status:401,message:'Sesi tidak valid'};};
 const openStream=res=>{res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store','Connection':'keep-alive','X-Accel-Buffering':'no'});res.write(': connected\n\n');};
 const handler=async(req,res)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');try{
 const url=new URL(req.url,'http://localhost');const method=req.method;const expected=`${secure?'https':'http'}://${req.headers.host}`;
 if(method==='POST'&&req.headers.origin!==expected)throw {status:403,message:'Asal permintaan ditolak'};
 if(url.pathname==='/api/admin/login'&&method==='POST'){
 const ip=req.socket.remoteAddress;let a=attempts.get(ip);if(a&&a.until>clock()&&a.count>=5)throw {status:429,message:'Terlalu banyak percobaan. Tunggu 15 menit.'};const d=await body(req);allowedFields(d,['username','password']);
 const pass=typeof d.password==='string'?d.password:'';const hash=scryptSync(pass,admin.salt,64);if(d.username!==admin.username||!timingSafeEqual(hash,Buffer.from(admin.hash,'hex'))){if(!a||a.until<=clock())a={count:0,until:clock()+900000};a.count++;attempts.set(ip,a);throw {status:401,message:'Nama admin atau kata sandi salah'};}
 attempts.delete(ip);const id=token(),csrf=token();admins.set(id,{username:admin.username,csrf,expires:clock()+8*3600000});res.setHeader('Set-Cookie',`kb_admin=${id}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=28800${secure?'; Secure':''}`);return json(res,200,{username:admin.username,csrf});}
 if(url.pathname.startsWith('/api/admin/')){
 const [id,a]=getAdmin(req);if(method==='POST'&&req.headers['x-csrf-token']!==a.csrf)throw {status:403,message:'Token permintaan tidak valid'};
 if(url.pathname==='/api/admin/me'&&method==='GET')return json(res,200,{username:a.username,csrf:a.csrf});
 if(url.pathname==='/api/admin/logout'&&method==='POST'){admins.delete(id);for(const [r,who] of watchers)if(who===a){r.end();watchers.delete(r);}res.setHeader('Set-Cookie',`kb_admin=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0${secure?'; Secure':''}`);return json(res,200,{ok:true});}
 if(url.pathname==='/api/admin/sessions'&&method==='GET')return json(res,200,snapshot());
 if(url.pathname==='/api/admin/events'&&method==='GET'){openStream(res);watchers.set(res,a);emit(res,'snapshot',snapshot());req.on('close',()=>watchers.delete(res));return;}
 if(url.pathname==='/api/admin/help/resolve'&&method==='POST'){
 const d=await body(req);allowedFields(d,['sessionId','helpId']);const s=sessions.get(d.sessionId);
 if(!s||!s.help||s.help.id!==d.helpId)throw {status:404,message:'Permintaan bantuan tidak ditemukan'};
 if(s.help.status==='resolved')return json(res,200,s.help);
 record({actor:a.username,sessionId:s.id,helpId:s.help.id,from:s.help.page,to:s.help.page,status:'help_resolved',reason:'Admin menandai permintaan ditangani'});
 Object.assign(s.help,{status:'resolved',resolvedAt:clock(),resolvedBy:a.username});
 if(s.stream)emit(s.stream,'help',s.help);broadcast();return json(res,200,s.help);
 }
 if(url.pathname==='/api/admin/command'&&method==='POST'){
 const d=await body(req);allowedFields(d,['sessionId','target','requestId']);if(typeof d.requestId!=='string'||!/^[a-zA-Z0-9-]{12,80}$/.test(d.requestId))throw {status:400,message:'ID perintah tidak valid'};
 const s=sessions.get(d.sessionId);if(!s)throw {status:404,message:'Sesi tidak ditemukan'};
 if(s.requests.has(d.requestId)){const prior=s.requests.get(d.requestId);if(prior.target!==d.target)throw {status:409,message:'ID perintah sudah digunakan'};return json(res,200,prior);}
 if(!ROUTES.includes(d.target)||!s.allowed.includes(d.target))throw {status:409,message:'Halaman belum diizinkan oleh alur pengguna'};
 if(status(s)!=='online')throw {status:409,message:'Pengguna tidak terhubung'};
 if(s.command?.status==='sent')throw {status:409,message:'Masih menunggu perintah sebelumnya'};
 if(s.requests.size>=1000)throw {status:429,message:'Batas perintah sesi tercapai'};
 const c={id:randomUUID(),requestId:d.requestId,target:d.target,from:s.page,actor:a.username,status:'sent',created:clock(),expires:clock()+commandTtl};record({actor:c.actor,sessionId:s.id,commandId:c.id,from:c.from,to:c.target,status:'sent'});s.command=c;s.requests.set(d.requestId,c);emit(s.stream,'command',c);broadcast();return json(res,202,c);}
 }
 if(url.pathname==='/api/session'&&method==='POST'){
 const d=await body(req);allowedFields(d,[]);const ip=req.socket.remoteAddress;let r=creates.get(ip);if(!r||r.until<=clock())r={count:0,until:clock()+60000};if(++r.count>60||sessions.size>=1000)throw {status:429,message:'Batas sesi tercapai'};creates.set(ip,r);
 const s={id:randomUUID(),token:token(),name:'',nameUpdatedAt:null,page:'home',allowed:[],created:clock(),activity:clock(),seen:clock(),closed:false,stream:null,command:null,help:null,requests:new Map()};sessions.set(s.id,s);broadcast();return json(res,201,{id:s.id,token:s.token});}
 if(url.pathname.startsWith('/api/session/')){
 const s=getSession(req);
 if(url.pathname==='/api/session/events'&&method==='GET'){if(s.stream)throw {status:409,message:'Sesi sudah terhubung'};s.closed=false;s.seen=clock();openStream(res);s.stream=res;emit(res,'ready',{id:s.id,serverTime:clock(),help:s.help});if(s.command?.status==='sent'){
 if(s.command.expires<=clock())finish(s,'expired','Perintah habis sebelum tersambung');else emit(res,'command',s.command);}
 broadcast();req.on('close',()=>{if(s.stream===res){s.stream=null;broadcast();}});return;}
 if(url.pathname==='/api/session/help'&&method==='POST'){
 const d=await body(req);allowedFields(d,['page']);if(!Object.hasOwn(PAGES,d.page))throw {status:400,message:'Halaman permintaan tidak valid'};
 if(s.help?.status==='pending')return json(res,200,s.help);
 if(s.help&&clock()-s.help.createdAt<30000)throw {status:429,message:'Tunggu sebentar sebelum mengirim permintaan baru'};
 const help={id:randomUUID(),status:'pending',page:d.page,createdAt:clock(),resolvedAt:null,resolvedBy:null};
 record({actor:'Pengguna',sessionId:s.id,helpId:help.id,from:help.page,to:help.page,status:'help_requested',reason:'Pengguna meminta pendampingan'});
 s.help=help;s.activity=clock();s.seen=clock();if(s.stream)emit(s.stream,'help',help);broadcast();return json(res,201,help);
 }
 if(url.pathname==='/api/session/state'&&method==='POST'){
 const d=await body(req);allowedFields(d,['name','page','allowed','active']);if(typeof d.name!=='string'||d.name.length>100||!Object.hasOwn(PAGES,d.page)||!Array.isArray(d.allowed)||d.allowed.length>ROUTES.length||d.allowed.some(x=>!ROUTES.includes(x)))throw {status:400,message:'Status sesi tidak valid'};
 const nextName=d.name.trim();if(nextName!==s.name)s.nameUpdatedAt=clock();s.name=nextName;s.page=d.page;s.allowed=[...new Set(d.allowed)];s.seen=clock();s.closed=false;if(d.active===true)s.activity=clock();broadcast();return json(res,200,{ok:true});}
 if(url.pathname==='/api/session/ack'&&method==='POST'){
 const d=await body(req);allowedFields(d,['commandId','status','page','reason']);const c=s.command;if(!c||c.id!==d.commandId)throw {status:404,message:'Perintah tidak ditemukan'};if(c.status!=='sent')return json(res,200,{status:c.status});if(c.expires<=clock()){finish(s,'expired','Konfirmasi terlambat');return json(res,200,{status:'expired'});}
 if(!['applied','rejected'].includes(d.status)||!Object.hasOwn(PAGES,d.page))throw {status:400,message:'Konfirmasi tidak valid'};
 if(d.status==='applied'&&d.page!==c.target)throw {status:409,message:'Halaman tujuan belum aktif'};s.page=d.page;finish(s,d.status,d.status==='applied'?'Perangkat mengonfirmasi halaman aktif':'Perangkat menolak: syarat atau kondisi berubah');return json(res,200,{status:s.command.status});}
 if(url.pathname==='/api/session/leave'&&method==='POST'){s.closed=true;s.stream?.end();s.stream=null;broadcast();return json(res,200,{ok:true});}
 }
 const files={'/':'index.html','/index.html':'index.html','/admin':'admin.html','/admin/':'admin.html','/admin.js':'admin.js','/admin.css':'admin.css','/support-client.js':'support-client.js'};
 if(method==='GET'&&files[url.pathname]){const f=files[url.pathname],type=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html';res.setHeader('Cache-Control','no-store');res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self' blob: data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");res.writeHead(200,{'Content-Type':type+'; charset=utf-8'});return res.end(readFileSync(path.join(publicDir,f==='index.html'?'../index.html':f)));}
 return json(res,404,{error:'Tidak ditemukan'});
 }catch(e){if(res.headersSent)return res.end();json(res,e.status||500,{error:e.status?e.message:'Server tidak dapat memproses permintaan'});}};
 return {handler,close(){clearInterval(sweep);for(const s of sessions.values())s.stream?.end();for(const r of watchers.keys())r.end();},sessions};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const dir=path.dirname(fileURLToPath(import.meta.url)),dataDir=path.join(dir,'data'),config=path.join(dataDir,'admin.json');mkdirSync(dataDir,{recursive:true});
 if(!existsSync(config)){const {setup}=await import('./setup.mjs');await setup(config);}
 const admin=JSON.parse(readFileSync(config,'utf8'));const host=process.env.HOST||'127.0.0.1',port=Number(process.env.PORT||8787);const secure=!!(process.env.HTTPS_CERT&&process.env.HTTPS_KEY);
 if(!['127.0.0.1','localhost','::1'].includes(host)&&!secure)throw Error('Akses lintas perangkat wajib HTTPS. Isi HTTPS_CERT dan HTTPS_KEY sebelum mengubah HOST.');
 const service=createService({admin,publicDir:path.join(dir,'public'),dataDir,secure});const server=secure?https.createServer({cert:readFileSync(process.env.HTTPS_CERT),key:readFileSync(process.env.HTTPS_KEY)},service.handler):http.createServer(service.handler);
 server.listen(port,host,()=>console.log(`Prototipe: ${secure?'https':'http'}://${host}:${port}\nAdmin: ${secure?'https':'http'}://${host}:${port}/admin`));
 const stop=()=>{service.close();server.close(()=>process.exit(0));};process.on('SIGINT',stop);process.on('SIGTERM',stop);
}
