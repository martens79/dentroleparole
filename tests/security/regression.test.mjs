import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = process.cwd();
function loadTs(relative) {
 const filename=path.join(root,relative);
 const source=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 const m=new Module(filename);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));m._compile(source,filename);return m.exports;
}
const request = body => new Request('http://localhost/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
async function newsletter(run,{configured=true,response=Response.json({id:1}),fail=false}={}) {
 const saved={key:process.env.BREVO_API_KEY,list:process.env.BREVO_LIST_ID,fetch:globalThis.fetch};
 const calls=[];
 try{
  if(configured){process.env.BREVO_API_KEY='synthetic';process.env.BREVO_LIST_ID='1';}else{delete process.env.BREVO_API_KEY;delete process.env.BREVO_LIST_ID;}
  globalThis.fetch=async(url,options)=>{calls.push({url,body:JSON.parse(options.body)});if(fail)throw Error('synthetic network failure');return response;};
  await run(loadTs('src/app/api/newsletter/route.ts').POST,calls);
 }finally{
  globalThis.fetch=saved.fetch;
  for(const [key,value] of [['BREVO_API_KEY',saved.key],['BREVO_LIST_ID',saved.list]]){if(value===undefined)delete process.env[key];else process.env[key]=value;}
 }
}
test('newsletter: missing/false consent never calls Brevo',()=>newsletter(async(post,calls)=>{
 for(const consent of [undefined,false,'true'])assert.equal((await post(request({email:'test@example.invalid',consent}))).status,400);
 assert.equal(calls.length,0);
}));
test('newsletter: invalid email never calls Brevo',()=>newsletter(async(post,calls)=>{
 for(const email of ['', 'invalid'])assert.equal((await post(request({email,consent:true}))).status,400);
 assert.equal(calls.length,0);
}));
test('newsletter: consent true normalizes email and sends exactly one mocked request',()=>newsletter(async(post,calls)=>{
 const r=await post(request({email:' TEST@EXAMPLE.INVALID ',consent:true}));assert.equal(r.status,200);
 assert.equal(calls.length,1);assert.equal(calls[0].url,'https://api.brevo.com/v3/contacts');
 assert.deepEqual(calls[0].body,{email:'test@example.invalid',listIds:[1],updateEnabled:true});
 assert.equal((await r.json()).message,'Iscrizione registrata.');
}));
test('newsletter: missing configuration is handled without outgoing requests',()=>newsletter(async(post,calls)=>{
 assert.equal((await post(request({email:'test@example.invalid',consent:true}))).status,500);assert.equal(calls.length,0);
},{configured:false}));
test('newsletter: provider refusal preserves failure status',()=>newsletter(async(post)=>{
 const r=await post(request({email:'test@example.invalid',consent:true}));assert.equal(r.status,400);assert.equal((await r.json()).ok,false);
},{response:Response.json({message:'synthetic refusal'},{status:400})}));
test('newsletter: network failure returns a controlled error',()=>newsletter(async(post)=>{
 const r=await post(request({email:'test@example.invalid',consent:true}));assert.equal(r.status,500);assert.equal((await r.json()).ok,false);
},{fail:true}));
test('newsletter: malformed JSON does not call the provider',()=>newsletter(async(post,calls)=>{
 const r=await post(new Request('http://localhost/api/newsletter',{method:'POST',body:'{'}));assert.equal(r.status,500);assert.equal(calls.length,0);
}));
function withConsent(run,{unavailable=false}={}) {
 const saved=globalThis.window,storage=new Map();let events=0;
 globalThis.window={localStorage:{getItem:k=>{if(unavailable)throw Error('disabled');return storage.get(k)??null;},setItem:(k,v)=>{if(unavailable)throw Error('disabled');storage.set(k,v);}},dispatchEvent:()=>{events++;}};
 try{return run(loadTs('src/lib/consent.ts'),storage,()=>events);}finally{if(saved===undefined)delete globalThis.window;else globalThis.window=saved;}
}
test('consent: explicit rejection and grant persist version/time and notify',()=>withConsent((c,s,count)=>{
 assert.equal(c.getConsentState(),'unset');c.saveConsent(false);assert.equal(c.getConsentState(),'denied');
 const value=JSON.parse(s.get(c.CONSENT_STORAGE_KEY));assert.equal(value.v,1);assert.equal(value.analytics,false);assert.equal(typeof value.ts,'number');
 c.saveConsent(true);assert.equal(c.getConsentState(),'granted');assert.equal(count(),2);assert.equal(c.CONSENT_TTL_DAYS,180);
}));
test('consent: expired, future-dated, malformed and incompatible records are rejected',()=>withConsent((c,s)=>{
 for(const v of ['{',JSON.stringify({v:1,analytics:true,ts:Date.now()-181*86400000}),JSON.stringify({v:1,analytics:true,ts:Date.now()+86400000}),JSON.stringify({v:99,analytics:true,ts:Date.now()})]){
  s.set(c.CONSENT_STORAGE_KEY,v);assert.equal(c.getConsentState(),'unset');
 }
}));
test('consent: unavailable storage retains only the current in-memory choice',()=>withConsent(c=>{
 c.saveConsent(false);assert.equal(c.getConsentState(),'denied');
},{unavailable:true}));
test('mail, consent, analytics, CMS queries and legal configuration remain byte-equivalent to main',()=>{
 for(const file of ['src/components/ContactForm.jsx','src/components/NewsletterMini.tsx','src/app/api/newsletter/route.ts','src/components/Analytics.tsx','src/lib/consent.ts','src/lib/sanity/queries.ts','src/content/legal.ts','next.config.js']){
  const original=execFileSync('git',['show','origin/main:'+file],{encoding:'utf8'}).replaceAll('\r\n','\n');
  assert.equal(fs.readFileSync(file,'utf8').replaceAll('\r\n','\n'),original,file+' changed');
 }
 assert.equal(fs.existsSync('src/app/api/contatti/route.ts'),false,'SMTP migration must not be included');
});
