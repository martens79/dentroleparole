/* eslint-disable @typescript-eslint/no-require-imports */
// Local browser regression: no external browser requests and no real email.
// Usage: CONTACT_TEST_PLAYWRIGHT=<path to installed playwright> node scripts/contact-browser.cjs [formsubmit|api]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const cp = require('node:child_process');
const {createHash} = require('node:crypto');
const {chromium} = require(process.env.CONTACT_TEST_PLAYWRIGHT || 'playwright');
const {makePdf} = require('../.test-build/tests/contact/fixtures.js');
const {MAX_FILE_BYTES} = require('../.test-build/src/lib/contact/limits.js');
const mode = process.argv[2] || 'formsubmit';
assert(['api','formsubmit'].includes(mode));
const port = mode === 'api' ? 3199 : 3198;
const origin = 'http://127.0.0.1:' + port;
const out = path.resolve('.test-build/browser');
fs.mkdirSync(out,{recursive:true});
const results = [];
const messages = [];
const sockets = new Set();
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const sha = b => createHash('sha256').update(b).digest('hex');
const pdf = Buffer.from(makePdf(1000,'synthetic-browser-regression'));
let server, app, browser, logFd;
async function smtpStart(){
 server = net.createServer(socket=>{
  sockets.add(socket); socket.on('close',()=>sockets.delete(socket)); socket.on('error',()=>{});
  socket.setEncoding('latin1'); socket.write('220 local.test ESMTP\r\n');
  let buf='', data=false;
  socket.on('data',chunk=>{
   buf+=chunk;
   while(true){
    if(data){
     let end=buf.indexOf('\r\n.\r\n'); if(end<0) return;
     messages.push(buf.slice(0,end)); buf=buf.slice(end+5); data=false; socket.write('250 queued\r\n');
    }
    let end=buf.indexOf('\r\n'); if(end<0)return;
    let line=buf.slice(0,end).toUpperCase(); buf=buf.slice(end+2);
    if(line.startsWith('EHLO')||line.startsWith('HELO'))socket.write('250-local.test\r\n250 AUTH PLAIN\r\n');
    else if(line.startsWith('AUTH'))socket.write('235 ok\r\n');
    else if(line==='DATA'){data=true;socket.write('354 go\r\n');}
    else if(line==='QUIT'){socket.end('221 bye\r\n');return;}
    else socket.write('250 ok\r\n');
   }
  });
 });
 await new Promise((resolve,reject)=>{server.once('error',reject); server.listen(47002,'127.0.0.1',resolve);});
}
async function smtpStop(){
 for(const s of sockets)s.destroy();
 if(server?.listening)await new Promise(r=>server.close(r));
}
async function ready(){
 for(let i=0;i<180;i++){
  if(app.exitCode!==null)throw new Error('Next exited: '+app.exitCode);
  try{if((await fetch(origin)).ok)return;}catch{}
  await sleep(1000);
 }
 throw new Error('Next readiness timeout');
}
async function dismiss(page){
 await sleep(250);
 const refuse=page.getByRole('button',{name:'Rifiuta',exact:true}); if(await refuse.isVisible())await refuse.click();
 const close=page.locator('div.fixed.inset-0').filter({has:page.locator('h2')}).getByRole('button',{name:'✕',exact:true}); if(await close.isVisible())await close.click();
}
async function fill(page){
 if(mode==='api')await page.waitForFunction(()=>Boolean(document.querySelector('input[name=form_token]')?.value));
 await page.locator('input[name=name]').fill('Prova sintetica');
 await page.locator('input[name=email]').fill('browser@example.invalid');
 await dismiss(page);
}
async function layout(page,width,label){
 await page.mouse.move(0,0); await sleep(250);
 const info=await page.evaluate(()=>{
  const form=document.querySelector('form[action*="contatti"],form[action*="formsubmit"]');
  const button=form.querySelector('button[type=submit]');
  const style=getComputedStyle(button);
  return {width:innerWidth,scroll:document.documentElement.scrollWidth,x:scrollX,
   button:{bg:style.backgroundColor,color:style.color},
   overflowing:[...form.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)}).map(e=>e.tagName)};
 });
 assert.equal(info.scroll,width,label+': overflow'); assert.equal(info.x,0);
 assert.deepEqual(info.overflowing,[]);
 assert.equal(info.button.bg,'rgb(214, 179, 106)'); assert.equal(info.button.color,'rgb(7, 10, 18)');
 results.push({case:label,width,info});
}
async function alertCheck(page,pattern){
 const alert=page.locator('form [role=alert]');
 await alert.waitFor(); assert.match(await alert.innerText(),pattern);
 assert.equal(await alert.evaluate(e=>e===document.activeElement),true);
}
async function main(){
 logFd=fs.openSync(path.join(out,(process.env.CONTACT_TEST_RATELIMIT==='1'?'ratelimit':mode)+'-server.log'),'w');
 // Clean test environment: carry OS/runtime variables only, no user SMTP/Brevo credentials.
 const env={};
 for(const k of ['PATH','Path','SystemRoot','WINDIR','TEMP','TMP','USERPROFILE','APPDATA','LOCALAPPDATA','NODE_EXTRA_CA_CERTS'])
  if(process.env[k])env[k]=process.env[k];
 Object.assign(env,{NEXT_TELEMETRY_DISABLED:'1',NODE_USE_SYSTEM_CA:'1',
  NEXT_PUBLIC_SANITY_PROJECT_ID:'odfxsvll',NEXT_PUBLIC_SANITY_DATASET:'production',
  NEXT_PUBLIC_CONTACT_BACKEND:mode,SMTP_HOST:'127.0.0.1',SMTP_PORT:'47002',
  SMTP_ALLOW_PLAINTEXT_LOOPBACK:'true',SMTP_USER:'form@example.invalid',SMTP_PASS:'local-fake-only',
  CONTACT_TO:'receiver@example.invalid',CONTACT_FORM_SECRET:['local','synthetic','key'].join('-').repeat(3),
  CONTACT_RATE_IP_MAX:'100',CONTACT_RATE_INSTANCE_MAX:'1000'});
 const nextArgs=process.env.CONTACT_TEST_PRODUCTION==='1' ? ['start','--hostname','127.0.0.1','--port',String(port)] : ['dev','--webpack','--hostname','127.0.0.1','--port',String(port)];
 if(process.env.CONTACT_TEST_RATELIMIT==='1'){delete env.CONTACT_RATE_IP_MAX;delete env.CONTACT_RATE_INSTANCE_MAX;}
 app=cp.spawn(process.execPath,[require.resolve('next/dist/bin/next'),...nextArgs],
  {cwd:process.cwd(),env,windowsHide:true,stdio:['ignore',logFd,logFd]});
 await ready();
 if(process.env.CONTACT_TEST_RATELIMIT==='1'){
  const check=cp.spawnSync(process.execPath,['scripts/contact-collaudo.mjs','ratelimit','--base',origin],{cwd:process.cwd(),env,encoding:'utf8',timeout:60000,windowsHide:true});
  fs.writeFileSync(path.join(out,'ratelimit.log'),(check.stdout||'')+(check.stderr||''));
  assert.equal(check.status,0,check.stdout+' '+check.stderr); console.log(check.stdout);return;
 }
 if(mode==='api'){
  if(process.env.CONTACT_TEST_SKIP_MATRIX!=='1'){
  const matrix=cp.spawnSync(process.execPath,['scripts/contact-collaudo.mjs','local','--base',origin,'--smtp-port','47002'],
   {cwd:process.cwd(),env,encoding:'utf8',timeout:180000,windowsHide:true});
  fs.writeFileSync(path.join(out,'matrix.log'),(matrix.stdout||'')+(matrix.stderr||''));
  assert.equal(matrix.status,0,'SMTP matrix: '+matrix.stdout+' '+matrix.stderr);
  results.push({case:'existing SMTP matrix',status:matrix.status});
  }
  await smtpStart();
 }
 browser=await chromium.launch({headless:true,args:['--disable-background-networking']});
 const context=await browser.newContext({viewport:{width:1280,height:900}});
 let externalPosts=0;
 await context.route('**/*',async route=>{
  const request=route.request(), u=new URL(request.url());
  if(u.origin===origin||['data:','blob:'].includes(u.protocol)) return route.continue();
  if(request.method()==='POST')externalPosts++;
  return route.abort();
 });
 const page=await context.newPage();
 page.setDefaultTimeout(60000); page.setDefaultNavigationTimeout(120000);
 for(const width of [320,375,390,1280]){
  console.log('Testing',mode,width);
  await page.setViewportSize({width,height:900});
  await page.goto(origin,{waitUntil:'domcontentloaded',timeout:120000});
  const form=page.locator(mode==='api'?'form[action="/api/contatti"]':'form[action^="https://formsubmit.co/"]');
  await form.waitFor();
  const refuse=page.getByRole('button',{name:'Rifiuta',exact:true}); if(await refuse.isVisible())await refuse.click();
  if(mode==='formsubmit'){
   const actual=await form.locator('input[type=hidden]').evaluateAll(es=>Object.fromEntries(es.map(e=>[e.name,e.value])));
   assert.deepEqual(actual,{_subject:'Nuova richiesta dal sito Dentro le Parole',_captcha:'false',_template:'table',_next:'https://www.dentroleparole.com/grazie'});
   assert.equal(await form.getAttribute('method'),'POST');
   assert.equal(await form.getAttribute('enctype'),'multipart/form-data');
   assert.equal(await form.getAttribute('action'),'https://formsubmit.co/contatti@dentroleparole.com');
  }
  await fill(page);
  const filename='Anteprima_sintetica_'+('nome_molto_lungo_'.repeat(10))+'.pdf';
  await form.locator('input[type=file]').setInputFiles({name:filename,mimeType:'application/pdf',buffer:pdf});
  await form.getByText('Selezionato: '+filename,{exact:true}).waitFor();
  if(await refuse.isVisible())await refuse.click();
  await form.locator('button[type=submit]').scrollIntoViewIfNeeded(); await dismiss(page);
  await layout(page,width,mode+' selected long filename'); console.log('layout OK',width);
  await page.screenshot({path:path.join(out,mode+'-'+width+'.png')});
  const select=form.getByRole('button',{name:'Allega anteprima'});
  await select.focus(); await page.keyboard.press('Tab');
  assert.equal(await page.getByRole('button',{name:'Rimuovi file'}).evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Tab');
  assert.equal(await form.locator('button[type=submit]').evaluate(e=>e===document.activeElement),true);
  const focus=await form.locator('button[type=submit]').evaluate(e=>getComputedStyle(e).boxShadow);
  assert.notEqual(focus,'none');
  await form.locator('input[type=file]').setInputFiles({name:'bad.exe',mimeType:'application/octet-stream',buffer:pdf});
  await alertCheck(page,/Formato file non valido/); console.log('invalid format OK',width);
  await layout(page,width,mode+' invalid format');
  const tooLarge=Buffer.alloc((mode==='api'?MAX_FILE_BYTES:8*1024*1024)+1);
  await form.locator('input[type=file]').setInputFiles({name:'large.pdf',mimeType:'application/pdf',buffer:tooLarge});
  await alertCheck(page,/troppo grande/); console.log('oversize OK',width);
  assert.match(await page.locator('form [role=alert]').innerText(),mode==='api'?/4,4 MB/:/8 MB/);
  if(mode==='api'){
   await page.goto(origin,{waitUntil:'domcontentloaded',timeout:120000}); await fill(page);
   const current=page.locator('form[action="/api/contatti"]');
   await current.locator('input[type=file]').setInputFiles({name:'proof.pdf',mimeType:'application/pdf',buffer:pdf});
   await sleep(3200);
   const before=messages.length;
   await current.locator('button[type=submit]').click();
   await page.waitForURL('**/grazie');
   assert.equal(messages.length,before+1);
   const raw=messages.at(-1);
   const b64=raw.split(/filename=proof.pdf\r?\n\r?\n/i)[1]?.split(/\r?\n--/)[0].replace(/\s+/g,'');
   assert(b64,'MIME attachment missing'); assert.equal(sha(Buffer.from(b64,'base64')),sha(pdf));
   results.push({case:'browser SMTP + SHA256',width,sha256:sha(pdf)});
  }else{
   // Native submit, intercepted before any network traffic leaves the browser.
   await form.locator('input[type=file]').setInputFiles([]);
   let native;
   await page.route('https://formsubmit.co/**',async route=>{
    native={method:route.request().method(),bytes:route.request().postDataBuffer()?.length}; await route.fulfill({status:200,contentType:'text/plain',body:'FormSubmit submission intercepted locally'});
   });
   await form.locator('button[type=submit]').click(); await sleep(500);
   assert.equal(native?.method,'POST'); assert(native.bytes>0);
   results.push({case:'native FormSubmit intercepted, no real send',width});
  }
 }
 if(mode==='api'){
  await page.goto(origin,{waitUntil:'domcontentloaded',timeout:120000}); await fill(page); await sleep(3200);
  let before=messages.length;
  await page.locator('form[action="/api/contatti"] button[type=submit]').click(); await page.waitForURL('**/grazie');
  assert.equal(messages.length,before+1); assert(!messages.at(-1).includes('Content-Disposition: attachment'));
  results.push({case:'browser without attachment'});
  await smtpStop();
  await page.goto(origin,{waitUntil:'domcontentloaded',timeout:120000}); await fill(page); await sleep(3200);
  await page.locator('form[action="/api/contatti"] button[type=submit]').click();
  await alertCheck(page,/Non è stato possibile inviare/);
  assert.equal(await page.locator('form[action="/api/contatti"] button[type=submit]').isEnabled(),true);
  results.push({case:'SMTP unavailable: accessible error, retry enabled'});
  await page.route('**/api/contatti',route=>route.request().method()==='POST'?route.abort('internetdisconnected'):route.continue());
  await page.locator('form[action="/api/contatti"] button[type=submit]').click();
  await alertCheck(page,/Connessione non riuscita/);
  results.push({case:'network disconnected: accessible error'});
 }
 assert.equal(externalPosts,0,'unexpected external POST');
 fs.writeFileSync(path.join(out,mode+'-results.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify({mode,passed:results.length,messages:messages.length,out}));
}
main().catch(async e=>{console.error(e);if(browser){const p=browser.contexts()[0]?.pages()[0];if(p){console.error(await p.locator('form').first().innerText().catch(()=>''));await p.screenshot({path:path.join(out,mode+'-failure.png')}).catch(()=>{});}}process.exitCode=1}).finally(async()=>{
 if(browser)await browser.close();
 await smtpStop();
 if(app?.pid)cp.spawnSync('taskkill',['/pid',String(app.pid),'/t','/f'],{windowsHide:true,stdio:'ignore'});
 if(logFd!==undefined)fs.closeSync(logFd);
});
