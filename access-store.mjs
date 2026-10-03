import {randomBytes,randomUUID,createHash,timingSafeEqual} from 'node:crypto';
import {readFileSync,writeFileSync,renameSync,existsSync,mkdirSync,openSync,fsyncSync,closeSync} from 'node:fs';
import path from 'node:path';
export const STAGES=['verify','code','calculator','documents','loaninfo','disbursement','confirmation','analysis','completed'];
const digest=s=>createHash('sha256').update(s).digest('hex');
const normalize=s=>s.normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('id-ID');
const fail=(status,message)=>{throw {status,message};};
export function createAccessStore({dataDir,secure=false,clock=Date.now}){
 mkdirSync(dataDir,{recursive:true});const file=path.join(dataDir,'applications.json');
 let records=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):[];
 if(!Array.isArray(records)||records.some(r=>!r.id||!r.codeHash||!STAGES.includes(r.stage)))throw Error('Penyimpanan pengajuan tidak valid; tidak ditimpa.');
 const sessions=new Map(),limits=new Map(),lookupLimits=new Map();
 function save(next){const temp=file+'.tmp';const fd=openSync(temp,'w',0o600);try{writeFileSync(fd,JSON.stringify(next));fsyncSync(fd);}finally{closeSync(fd);}renameSync(temp,file);records=next;}
 function sessionCookie(res,id){res.setHeader('Set-Cookie',`kb_application=${id}; HttpOnly; SameSite=Strict; Path=/api/application; Max-Age=28800${secure?'; Secure':''}`);}
 function issueSession(res,id){const token=randomBytes(32).toString('hex');sessions.set(digest(token),{id,expires:clock()+28800000});sessionCookie(res,token);}
 function authenticated(req){const token=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('kb_application='))?.slice(15)||'';const s=sessions.get(digest(token));if(!s||s.expires<=clock())fail(401,'Masukkan nama lengkap dan kode akses prototipe.');const r=records.find(r=>r.id===s.id);if(!r)fail(401,'Pengajuan tidak tersedia.');return r;}
 function publicRecord(r){return {id:r.id,name:r.name,stage:r.stage,completed:r.stage==='completed',updatedAt:r.updatedAt,summary:r.summary||null};}
 function rate(req){const key=req.socket.remoteAddress||'unknown';for(const [k,v]of limits)if(v.until<=clock())limits.delete(k);for(const [k,v]of sessions)if(v.expires<=clock())sessions.delete(k);let r=limits.get(key);if(!r){r={count:0,until:clock()+60000};limits.set(key,r);}if(++r.count>10)fail(429,'Terlalu banyak percobaan. Tunggu satu menit.');}
 return async function applicationRoute(req,res,url,body,json){
  if(!url.pathname.startsWith('/api/application/'))return false;
  const name=url.pathname.slice('/api/application/'.length),method=req.method;
  const keys=(d,allowed)=>{if(!d||typeof d!=='object'||Array.isArray(d)||Object.keys(d).some(k=>!allowed.includes(k)))fail(400,'Data tidak diizinkan.');};
  if(method==='POST'&&name==='lookup'){
   const ip=req.socket.remoteAddress||'unknown';
   for(const [k,v]of lookupLimits)if(v.until<=clock())lookupLimits.delete(k);
   let limit=lookupLimits.get(ip);if(!limit){limit={count:0,until:clock()+60000};lookupLimits.set(ip,limit);}
   if(++limit.count>60)fail(429,'Pencarian terlalu sering. Tunggu satu menit, lalu coba lagi.');
   const d=await body(req);keys(d,['name']);
   if(typeof d.name!=='string'||d.name.trim().length<2||d.name.length>100)fail(400,'Isi nama lengkap, 2–100 karakter.');
   // Name selects a login presentation only; never return IDs, status or financial data here.
   json(res,200,{requiresAccessCode:records.some(r=>r.normalizedName===normalize(d.name))});return true;
  }
  if(method==='POST'&&(name==='new'||name==='login')){
   rate(req);const d=await body(req);keys(d,name==='new'?['name']:['name','accessCode']);
   if(typeof d.name!=='string'||d.name.trim().length<2||d.name.length>100)fail(400,'Isi nama lengkap, 2–100 karakter.');
   if(name==='new'){
    if(records.length>=10000)fail(503,'Kapasitas prototipe tercapai.');
    const code=randomBytes(32).toString('hex'),r={id:randomUUID(),name:d.name.trim().replace(/\s+/g,' '),normalizedName:normalize(d.name),codeHash:digest(code),stage:'verify',createdAt:clock(),updatedAt:clock(),analysisAt:null};
    save([...records,r]);issueSession(res,r.id);json(res,201,{...publicRecord(r),accessCode:code});return true;
   }
   const candidate=typeof d.accessCode==='string'?d.accessCode.trim():'';
   const h=digest(candidate),r=records.find(r=>timingSafeEqual(Buffer.from(r.codeHash,'hex'),Buffer.from(h,'hex'))&&r.normalizedName===normalize(d.name));
   if(!r)fail(401,'Nama lengkap atau kode akses prototipe tidak cocok.');
   issueSession(res,r.id);json(res,200,publicRecord(r));return true;
  }
  const record=authenticated(req);
  if(method==='GET'&&name==='me'){json(res,200,publicRecord(record));return true;}
  if(method==='POST'&&name==='progress'){
   const d=await body(req);keys(d,['stage','summary']);const next=STAGES.indexOf(d.stage),current=STAGES.indexOf(record.stage);
   if(next<0||next>current+1)fail(409,'Urutan tahapan belum terpenuhi.');
   if(d.summary&&d.stage!=='completed')fail(400,'Ringkasan hanya disimpan setelah selesai.');
   if(next<=current){json(res,200,publicRecord(record));return true;}
   if(d.stage==='completed'){
    if(record.analysisAt===null||clock()-record.analysisAt<300000)fail(409,'Analisis simulasi belum selesai.');
    keys(d.summary,['account','amount']);
    if(typeof d.summary.account!=='string'||!/^\d{12}$/.test(d.summary.account)||typeof d.summary.amount!=='string'||d.summary.amount.length>50||!/^Rp[\s.\d,]+$/.test(d.summary.amount))fail(400,'Periksa ringkasan rekening dan nominal.');
   }
   const updated={...record,stage:d.stage,updatedAt:clock(),...(d.stage==='analysis'?{analysisAt:clock()}:{}),...(d.stage==='completed'?{summary:{account:d.summary.account,amount:d.summary.amount}}:{})};
   save(records.map(r=>r.id===record.id?updated:r));json(res,200,publicRecord(updated));return true;
  }
  if(method==='POST'&&name==='logout'){const token=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('kb_application='))?.slice(15)||'';sessions.delete(digest(token));sessionCookie(res,'');json(res,200,{ok:true});return true;}
  fail(404,'Tidak ditemukan.');
 };
}
