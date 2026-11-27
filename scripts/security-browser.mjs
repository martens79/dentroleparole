import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawn,spawnSync} from 'node:child_process';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.SECURITY_PLAYWRIGHT || 'playwright');
const baseline=process.argv.includes('--baseline-live');
const base=baseline?'https://www.dentroleparole.com':'http://127.0.0.1:3210';
const prefix=baseline?'baseline':'candidate';
const out=path.resolve('.security-artifacts/browser');
fs.mkdirSync(out,{recursive:true});
const results=[],geometry=[];
const GA='G-Z8PEVVKQVB';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const longName='Anteprima_'+('nome_lungo_'.repeat(9))+'.pdf';
const pdf=Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\n%%EOF\n');
let browser,app,fd,externalMutations=0;
const gaRequests=[],pageErrors=[];
function record(name,data={}){results.push({name,...data});console.log('PASS',name);}
async function guard(route){
 const r=route.request(),u=new URL(r.url());
 if(/googletagmanager|google-analytics/.test(u.hostname)){gaRequests.push(r.url());return route.abort();}
 if(!['GET','HEAD'].includes(r.method())&&u.origin!==new URL(base).origin){externalMutations++;return route.abort();}
 return route.continue();
}
async function context(){const c=await browser.newContext({viewport:{width:1280,height:900}});c.on('page',p=>p.on('pageerror',e=>pageErrors.push({url:p.url(),message:e.message})));await c.route('**/*',guard);return c;}
async function hydrated(p){await p.waitForFunction(id=>typeof window['ga-disable-'+id]==='boolean',GA,{timeout:45000});}
async function dismiss(p){
 await sleep(200);
 const refuse=p.getByRole('button',{name:'Rifiuta',exact:true});if(await refuse.isVisible())await refuse.click();
 const close=p.locator('div.fixed.inset-0').filter({has:p.locator('h2')}).getByRole('button',{name:'✕',exact:true});if(await close.isVisible())await close.click();
}
async function goto(p,route='/'){
 const r=await p.goto(base+route,{waitUntil:'domcontentloaded',timeout:90000});assert.equal(r.status(),200,route);await hydrated(p);return r;
}
async function start(){
 if(baseline)return;
 const env={};
 for(const k of ['PATH','Path','SystemRoot','WINDIR','TEMP','TMP','USERPROFILE','APPDATA','LOCALAPPDATA','NODE_EXTRA_CA_CERTS'])if(process.env[k])env[k]=process.env[k];
 Object.assign(env,{NEXT_TELEMETRY_DISABLED:'1',NEXT_PUBLIC_SANITY_PROJECT_ID:'odfxsvll',NEXT_PUBLIC_SANITY_DATASET:'production',BREVO_API_KEY:'',BREVO_LIST_ID:''});
 fd=fs.openSync(path.join(out,'candidate-server.log'),'w');
 app=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'start','--hostname','127.0.0.1','--port','3210'],{cwd:process.cwd(),env,windowsHide:true,stdio:['ignore',fd,fd]});
 for(let i=0;i<90;i++){
  if(app.exitCode!==null)throw Error('Next exited: '+app.exitCode);
  try{if((await fetch(base,{signal:AbortSignal.timeout(3000)})).ok)return;}catch{}
  await sleep(1000);
 }
 throw Error('Next startup timed out');
}
async function forms(p){
 const comparison=baseline?[]:JSON.parse(fs.readFileSync(path.join(out,'baseline-geometry.json'),'utf8'));
 for(const width of [320,375,390,1280]){
  await p.setViewportSize({width,height:900});await goto(p);await dismiss(p);
  const before=await p.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.equal(before.scroll,width,'unselected form overflow '+width);
  const form=p.locator('form[action="https://formsubmit.co/contatti@dentroleparole.com"]');
  assert.equal(await form.getAttribute('method'),'POST');assert.equal(await form.getAttribute('enctype'),'multipart/form-data');
  assert.deepEqual(await form.locator('input[type=hidden]').evaluateAll(es=>Object.fromEntries(es.map(e=>[e.name,e.value]))),
   {_subject:'Nuova richiesta dal sito Dentro le Parole',_captcha:'false',_template:'table',_next:'https://www.dentroleparole.com/grazie'});
  await form.locator('input[name=name]').fill('Prova sicurezza');await form.locator('input[name=email]').fill('regression@example.invalid');await dismiss(p);
  await form.locator('input[type=file]').setInputFiles({name:longName,mimeType:'application/pdf',buffer:pdf});
  await form.getByText('Selezionato: '+longName,{exact:true}).waitFor();await dismiss(p);
  const g=await p.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
  geometry.push({width,...g});
  if(!baseline){const old=comparison.find(x=>x.width===width);assert(old,'baseline width missing');assert(g.scroll<=old.scroll+2,'new long-file overflow regression '+JSON.stringify({old,g}));}
  await form.locator('button[type=submit]').scrollIntoViewIfNeeded();await dismiss(p);
  await p.screenshot({path:path.join(out,prefix+'-form-'+width+'.png')});
  await form.locator('input[type=file]').setInputFiles({name:'invalid.exe',mimeType:'application/octet-stream',buffer:pdf});
  await form.getByText('Formato file non valido. Carica solo PDF, DOC o DOCX.',{exact:true}).waitFor();
  await form.locator('input[type=file]').setInputFiles({name:'large.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(8*1024*1024+1)});
  await form.getByText('Il file è troppo grande. Massimo 8 MB.',{exact:true}).waitFor();
  await form.locator('input[type=file]').setInputFiles([]);
  let sent;
  await p.route('https://formsubmit.co/**',async route=>{
   assert.equal(route.request().method(),'POST');sent=route.request().postDataBuffer();
   return route.fulfill({status:200,contentType:'text/plain',body:'Submission intercepted by local regression test'});
  });
  await form.locator('button[type=submit]').click();await sleep(200);assert(sent?.length>0);
  assert(sent.includes(Buffer.from('regression@example.invalid')));
  record('FormSubmit '+width,{geometry:g,nativePostIntercepted:true});
 }
 fs.writeFileSync(path.join(out,prefix+'-geometry.json'),JSON.stringify(geometry,null,2));
}
async function consent(){
 const c=await context(),p=await c.newPage();await goto(p);
 assert.equal(await p.locator('script[data-dlp-ga]').count(),0);assert.equal(gaRequests.length,0);
 await p.getByRole('button',{name:'Rifiuta',exact:true}).click();
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('dlp_cookie_consent')).analytics),false);
 assert.equal(await p.locator('script[data-dlp-ga]').count(),0);
 await p.getByRole('button',{name:'Preferenze cookie',exact:true}).last().click();await dismissPromo(p);
 await p.getByRole('button',{name:'Accetta',exact:true}).click();
 await p.waitForFunction(id=>window['ga-disable-'+id]===false,GA);
 assert.equal(await p.locator('script[data-dlp-ga]').getAttribute('src'),'https://www.googletagmanager.com/gtag/js?id='+GA);
 assert(gaRequests.some(u=>u.includes(GA)));
 await c.addCookies([{name:'_ga',value:'synthetic',url:base}]);
 await p.getByRole('button',{name:'Preferenze cookie',exact:true}).last().click();
 await p.getByRole('button',{name:'Rifiuta',exact:true}).click();
 await p.waitForFunction(id=>window['ga-disable-'+id]===true,GA);
 assert(!(await c.cookies()).some(x=>x.name==='_ga'));
 record('consent and GA4: unset, reject, grant, revoke; Google requests intercepted');
 await c.close();
}
async function dismissPromo(p){
 const close=p.locator('div.fixed.inset-0').filter({has:p.locator('h2')}).getByRole('button',{name:'✕',exact:true});
 if(await close.isVisible())await close.click();
}
async function newsletter(p){
 await goto(p);await dismiss(p);const form=p.locator('form').filter({has:p.getByPlaceholder('La tua email')});
 let calls=[];
 await p.route('**/api/newsletter',async route=>{calls.push(JSON.parse(route.request().postData()));return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,message:'Iscrizione registrata.'})});});
 await form.getByPlaceholder('La tua email').fill('regression@example.invalid');await dismiss(p);
 await form.getByRole('button',{name:'Iscriviti',exact:true}).click();assert.equal(calls.length,0);
 await form.locator('input[type=checkbox]').check();await form.getByRole('button',{name:'Iscriviti',exact:true}).click();
 await p.getByText(/La tua iscrizione alla newsletter è stata registrata/).waitFor();
 assert.deepEqual(calls,[{email:'regression@example.invalid',consent:true}]);record('newsletter client: consent required, success mocked, no real subscription');
}
async function newsletterHttp(p){
 for(const [name,data,status] of [
  ['missing consent',{email:'regression@example.invalid'},400],
  ['invalid email',{email:'invalid',consent:true},400],
  ['missing isolated configuration',{email:'regression@example.invalid',consent:true},500]
 ]){const r=await p.request.post(base+'/api/newsletter',{data});assert.equal(r.status(),status,name);const body=await r.json();assert.equal(body.ok,false);record('newsletter actual local HTTP: '+name,{status});}
}
async function pages(p){
 for(const width of [1280,375]){
  await p.setViewportSize({width,height:900});
  for(const route of ['/','/servizi','/chi-sono','/pubblicazioni','/portfolio','/blog','/news','/testimonianze','/privacy-policy','/cookie-policy','/termini-di-servizio','/grazie']){
   await goto(p,route);await dismiss(p);assert((await p.locator('main h1, main h2').first().innerText()).trim().length>0);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width,route+' overflow');
   if(['/','/blog','/servizi'].includes(route))await p.screenshot({path:path.join(out,'candidate-'+route.replaceAll('/','')+'-'+width+'.png')});
   record(route+' '+width);
  }
 }
 await p.setViewportSize({width:1280,height:900});await goto(p);await dismiss(p);
 await p.getByRole('link',{name:'Chi sono',exact:true}).first().click();await p.waitForURL('**/chi-sono');
 await p.getByRole('heading',{level:1}).filter({hasText:/Donatella|Chi sono/i}).waitFor();record('Next Link client navigation');
 await goto(p);
 const src=await p.locator('header img').first().getAttribute('src');if(src){const r=await p.request.get(new URL(src,base).href);assert.equal(r.status(),200);record('optimized header image HTTP 200');}
 const rejected=await p.request.get(base+'/_next/image?url=https%3A%2F%2Fexample.invalid%2Fimage.png&w=128&q=75');assert.equal(rejected.status(),400);record('image optimizer rejects source outside existing allowlist');
 for(const route of ['/robots.txt','/sitemap.xml']){const r=await p.request.get(base+route);assert.equal(r.status(),200);record(route);}
 const studio=await p.request.get(base+'/studio');assert.equal(studio.status(),200);record('embedded Sanity Studio HTTP 200 (no login or mutations)');
}
async function cms(p){
 const query='*[_type == "post" && defined(slug.current)]{"slug":slug.current,publishedAt}';
 const r=await fetch('https://odfxsvll.api.sanity.io/v2024-03-01/data/query/production?query='+encodeURIComponent(query),{signal:AbortSignal.timeout(30000)});
 assert(r.ok);const data=(await r.json()).result;assert(Array.isArray(data));
 const future=data.filter(x=>x.publishedAt&&Date.parse(x.publishedAt)>Date.now()+3600000);
 const published=data.filter(x=>x.publishedAt&&Date.parse(x.publishedAt)<=Date.now()).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
 const statuses=[];
 for(const post of future){const res=await p.request.get(base+'/blog/'+encodeURIComponent(post.slug));assert.equal(res.status(),404);statuses.push(res.status());}
 const [blog,sitemap]=await Promise.all(['/blog','/sitemap.xml'].map(async route=>(await p.request.get(base+route)).text()));
 assert(future.every(x=>!blog.includes('/blog/'+x.slug)&&!sitemap.includes('/blog/'+x.slug)));
 if(published[0]){await goto(p,'/blog/'+encodeURIComponent(published[0].slug));record('published blog article HTTP 200');}
 record('scheduled Sanity articles hidden',{futureCount:future.length,statuses,excludedFromBlogAndSitemap:true});
}
async function main(){
 await start();browser=await chromium.launch({headless:true,args:['--disable-background-networking']});
 const c=await context(),p=await c.newPage();p.setDefaultTimeout(45000);
 await forms(p);
 if(!baseline){await pages(p);await newsletter(p);await newsletterHttp(p);await cms(p);await consent();}
 assert.equal(externalMutations,0,'Unexpected external mutation');
 assert.deepEqual(pageErrors,[],'Uncaught browser JavaScript errors');
 record('no uncaught browser JavaScript errors');
 fs.writeFileSync(path.join(out,prefix+'-results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify({prefix,checks:results.length,externalMutations}));
}
main().catch(async e=>{console.error(e);fs.writeFileSync(path.join(out,prefix+'-failure.json'),JSON.stringify({message:e.message,results,pageErrors},null,2));if(browser){const p=browser.contexts()[0]?.pages()[0];if(p)await p.screenshot({path:path.join(out,prefix+'-failure.png')}).catch(()=>{});}process.exitCode=1;}).finally(async()=>{
 if(browser)await browser.close();
 if(app?.pid){if(process.platform==='win32')spawnSync('taskkill',['/pid',String(app.pid),'/t','/f'],{windowsHide:true,stdio:'ignore'});else app.kill('SIGTERM');}
 if(fd!==undefined)fs.closeSync(fd);
});
