import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const sensitive=['adm-zip','@sanity/cli','@sanity/codegen','@sanity/runtime-cli'];
const evidence=[];
for(const file of walk('.next/server/app').filter(f=>f.endsWith('.nft.json')&&!f.split(path.sep).includes('studio'))){
 const files=JSON.parse(fs.readFileSync(file,'utf8')).files.map(f=>path.resolve(path.dirname(file),f).replaceAll('\\','/'));
 const matches=files.filter(f=>sensitive.some(p=>f.includes('/node_modules/'+p+'/'))||f.includes('/@sanity/codegen/node_modules/zod/'));
 evidence.push({routeTrace:file.replaceAll('\\','/'),tracedFiles:files.length,sensitiveExternalFiles:matches});
 assert.deepEqual(matches,[],file+': sensitive CLI files in public runtime trace');
}
assert(evidence.some(e=>e.routeTrace.includes('/api/newsletter/')),'Newsletter trace missing');
assert(evidence.some(e=>e.routeTrace.includes('/blog/[slug]/')),'Blog trace missing');
// This guard addresses external runtime files only. Bundled code/input reachability
// still requires source review; @sanity/client is not @sanity/cli.
fs.writeFileSync('.security-artifacts/runtime-traces-linux.json',JSON.stringify({limitation:'External NFT files only; combine with source and input-path review.',routes:evidence},null,2));
console.log('Reviewed public route traces:',evidence.length);
