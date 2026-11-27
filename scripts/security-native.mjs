import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url);
assert.equal(process.platform,'linux');assert.equal(process.arch,'x64');
const glibc=process.report.getReport().header.glibcVersionRuntime;
assert(glibc,'Expected Ubuntu glibc');
// Resolve the exact image library visible from Next, not an unrelated copy.
const nextRequire=createRequire(require.resolve('next/package.json'));
const sharp=nextRequire('sharp');
assert(require('semver').gte(sharp.versions.sharp,'0.35.5'));
require('@next/swc-linux-x64-gnu');
require('@tailwindcss/oxide');
const transformed=require('esbuild').transformSync('const value: number = 1',{loader:'ts'});
assert(transformed.code.includes('value'));
const raw=Buffer.from([255,0,0,255,0,255,0,255,0,0,255,255,255,255,255,255]);
const digest=b=>createHash('sha256').update(b).digest('hex');
const codecs=[];
for(const format of ['png','webp','avif']){
 const encoded=await sharp(raw,{raw:{width:2,height:2,channels:4}}).toFormat(format,{lossless:true}).toBuffer();
 const {data,info}=await sharp(encoded).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 assert.equal(info.width,2);assert.equal(info.height,2);assert.equal(info.channels,4);
 if(format==='png'||format==='webp')assert.equal(digest(data),digest(raw),format+' lossless roundtrip');
 codecs.push({format,bytes:encoded.length,decodedSha256:digest(data),exactRoundtrip:format!=='avif'});
}
const svg=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="red"/></svg>');
const {info}=await sharp(svg).resize(4,4).png().toBuffer({resolveWithObject:true});
assert.equal(info.width,4);assert.equal(info.height,4);
const evidence={node:process.version,platform:process.platform,arch:process.arch,glibc,sharpPath:nextRequire.resolve('sharp'),versions:sharp.versions,codecs,svgRasterization:true,swc:true,oxide:true,esbuild:true};
fs.mkdirSync('.security-artifacts',{recursive:true});
fs.writeFileSync('.security-artifacts/native-linux.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
