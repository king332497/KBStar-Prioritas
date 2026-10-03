import test from 'node:test';import assert from 'node:assert/strict';import http from 'node:http';import {mkdtempSync,readFileSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import path from 'node:path';import {randomUUID} from 'node:crypto';import {createService,makeAdmin} from '../server.mjs';
test('auth, session isolation, duplicate commands, expiry, validation and audit',async()=>{
 let now=Date.now();const dir=mkdtempSync(path.join(tmpdir(),'kb-admin-test-'));const service=createService({admin:makeAdmin('tester','Testing-only-Secret-123'),publicDir:path.resolve('public'),dataDir:dir,clock:()=>now});const server=http.createServer(service.handler);await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;const aborts=[];
 const req=async(url,data,headers={})=>{const response=await fetch(origin+url,{method:data===undefined?'GET':'POST',headers:{Origin:origin,...(data===undefined?{}:{'Content-Type':'application/json'}),...headers},body:data===undefined?undefined:JSON.stringify(data)});const result=await response.json();return {response,result};};
 try{
 assert.equal((await req('/api/admin/sessions')).response.status,401);
 assert.equal((await req('/api/admin/login',{username:'tester',password:'bad'})).response.status,401);
 const login=await req('/api/admin/login',{username:'tester',password:'Testing-only-Secret-123'});assert.equal(login.response.status,200);const cookie=login.response.headers.get('set-cookie').split(';')[0];assert(login.response.headers.get('set-cookie').includes('HttpOnly'));const ah={Cookie:cookie,'X-CSRF-Token':login.result.csrf};
 const a=(await req('/api/session',{})).result,b=(await req('/api/session',{})).result;assert.notEqual(a.id,b.id);const sh=x=>({Authorization:'Bearer '+x.token});
 assert.equal((await req('/api/session/state',{name:'Dendi',page:'verify',allowed:['login'],active:true},sh(a))).response.status,200);
 await req('/api/session/state',{name:'Dendi',page:'verify',allowed:['login'],active:true},sh(b));
 assert.equal((await req('/api/session/state',{name:'Dendi',page:'verify',allowed:['login'],password:'must-not-be-saved'},sh(a))).response.status,400);
 assert.equal((await req('/api/session/state',{name:'x',page:'verify',allowed:['https://evil.test']},sh(a))).response.status,400);
 for(const x of [a,b]){const ac=new AbortController();aborts.push(ac);const r=await fetch(origin+'/api/session/events',{headers:sh(x),signal:ac.signal});assert.equal(r.status,200);x.reader=r.body.getReader();await x.reader.read();}
 let snap=(await req('/api/admin/sessions',undefined,ah)).result;assert.equal(snap.sessions.filter(x=>x.name==='Dendi').length,2);assert.equal(snap.sessions.filter(x=>x.status==='online').length,2);
 const requestId=randomUUID();const payload={sessionId:a.id,target:'login',requestId};assert.equal((await req('/api/admin/command',payload,{Cookie:cookie})).response.status,403);
 assert.equal((await req('/api/admin/command',{...payload,target:'confirmation'},ah)).response.status,409);
 const c=await req('/api/admin/command',payload,ah);assert.equal(c.response.status,202);assert.equal((await req('/api/admin/command',payload,ah)).result.id,c.result.id);
 assert.equal((await req('/api/session/ack',{commandId:c.result.id,status:'applied',page:'login'},sh(b))).response.status,404);
 assert.equal((await req('/api/session/ack',{commandId:c.result.id,status:'applied',page:'verify'},sh(a))).response.status,409);
 assert.equal((await req('/api/session/ack',{commandId:c.result.id,status:'applied',page:'login'},sh(a))).result.status,'applied');
 const second=await req('/api/admin/command',{...payload,requestId:randomUUID()},ah);assert.equal(second.response.status,202);
 assert.equal((await req('/api/admin/command',payload,ah)).result.id,c.result.id); // Retry old request cannot create a third command.
 now+=16000;assert.equal((await req('/api/session/ack',{commandId:second.result.id,status:'applied',page:'login'},sh(a))).result.status,'expired');
 await req('/api/session/leave',{},sh(a));snap=(await req('/api/admin/sessions',undefined,ah)).result;assert.equal(snap.sessions.find(x=>x.id===a.id).status,'offline');assert.equal(snap.sessions.find(x=>x.id===b.id).page,'verify');
 assert.equal((await req('/api/admin/command',{...payload,requestId:randomUUID()},ah)).response.status,409);
 const ac=aborts[1];ac.abort();await new Promise(r=>setTimeout(r,50));snap=(await req('/api/admin/sessions',undefined,ah)).result;assert.equal(snap.sessions.find(x=>x.id===b.id).status,'disconnected');
 assert.equal((await req('/api/admin/logout',{},ah)).response.status,200);assert.equal((await req('/api/admin/sessions',undefined,ah)).response.status,401);
 assert.equal((await req('/api/session',{}, {Origin:'https://evil.test'})).response.status,403);
 const log=readFileSync(path.join(dir,'audit.jsonl'),'utf8');assert(!log.includes('Testing-only-Secret'));assert(!log.includes('must-not-be-saved'));assert(!log.includes(a.token));assert(log.includes('expired'));assert(log.includes('applied'));
 }finally{for(const a of aborts)a.abort();service.close();server.closeAllConnections();await new Promise(r=>server.close(r));rmSync(dir,{recursive:true,force:true});}
});
