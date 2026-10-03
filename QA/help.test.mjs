import test from 'node:test';import assert from 'node:assert/strict';import http from 'node:http';import {mkdtempSync,readFileSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import path from 'node:path';import {createService,makeAdmin} from '../server.mjs';
test('help requests: idempotency, identity isolation, admin auth, resolve, reconnect snapshot, cooldown',async()=>{
let now=Date.now();const dir=mkdtempSync(path.join(tmpdir(),'kb-help-test-'));const service=createService({admin:makeAdmin('tester','Testing-only-Secret-123'),publicDir:path.resolve('public'),dataDir:dir,clock:()=>now});const server=http.createServer(service.handler);await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;let streamAbort;
const req=async(url,data,headers={})=>{const response=await fetch(origin+url,{method:data===undefined?'GET':'POST',headers:{Origin:origin,...(data===undefined?{}:{'Content-Type':'application/json'}),...headers},body:data===undefined?undefined:JSON.stringify(data)});return {response,result:await response.json()};};
try{const a=(await req('/api/session',{})).result,b=(await req('/api/session',{})).result;const sh=x=>({Authorization:'Bearer '+x.token});
await req('/api/session/state',{name:'Dendi',page:'verify',allowed:['login']},sh(a));await req('/api/session/state',{name:'Dendi',page:'verify',allowed:['login']},sh(b));
assert.equal((await req('/api/session/help',{page:'verify'})).response.status,401);
assert.equal((await req('/api/session/help',{page:'verify',sessionId:b.id},sh(a))).response.status,400);
const first=await req('/api/session/help',{page:'verify'},sh(a));assert.equal(first.response.status,201);
const duplicate=await req('/api/session/help',{page:'code'},sh(a));assert.equal(duplicate.result.id,first.result.id);assert.equal(duplicate.result.page,'verify');
assert.equal((await req('/api/admin/help/resolve',{sessionId:a.id,helpId:first.result.id})).response.status,401);
const login=await req('/api/admin/login',{username:'tester',password:'Testing-only-Secret-123'});const cookie=login.response.headers.get('set-cookie').split(';')[0],ah={Cookie:cookie,'X-CSRF-Token':login.result.csrf};
let snap=(await req('/api/admin/sessions',undefined,ah)).result;assert.equal(snap.sessions.find(s=>s.id===a.id).help.status,'pending');assert.equal(snap.sessions.find(s=>s.id===b.id).help,null);
assert.equal((await req('/api/admin/help/resolve',{sessionId:b.id,helpId:first.result.id},ah)).response.status,404);
assert.equal((await req('/api/admin/help/resolve',{sessionId:a.id,helpId:first.result.id},{Cookie:cookie})).response.status,403);
const resolved=await req('/api/admin/help/resolve',{sessionId:a.id,helpId:first.result.id},ah);assert.equal(resolved.result.status,'resolved');assert.equal((await req('/api/admin/help/resolve',{sessionId:a.id,helpId:first.result.id},ah)).result.resolvedAt,resolved.result.resolvedAt);
streamAbort=new AbortController();const stream=await fetch(origin+'/api/session/events',{headers:sh(a),signal:streamAbort.signal});const reader=stream.body.getReader();let text='';while(!text.includes('event: ready'))text+=new TextDecoder().decode((await reader.read()).value);assert(text.includes('resolved'));
assert.equal((await req('/api/session/help',{page:'verify'},sh(a))).response.status,429);now+=31000;const next=await req('/api/session/help',{page:'verify'},sh(a));assert.equal(next.response.status,201);assert.notEqual(next.result.id,first.result.id);
assert.equal((await req('/api/admin/help/resolve',{sessionId:a.id,helpId:first.result.id},ah)).response.status,404);
const log=readFileSync(path.join(dir,'audit.jsonl'),'utf8').trim().split('\n').map(JSON.parse);assert.equal(log.filter(x=>x.status==='help_requested').length,2);assert.equal(log.filter(x=>x.status==='help_resolved').length,1);assert(!JSON.stringify(log).includes(a.token));
}finally{streamAbort?.abort();service.close();server.closeAllConnections();await new Promise(r=>server.close(r));rmSync(dir,{recursive:true,force:true});}
});
