import fs from 'node:fs';
import assert from 'node:assert/strict';

// npm exits 1 for the explicitly reviewed residuals. Keep the full report;
// fail on new packages/advisories, increased severity or any critical finding.
const baseline=JSON.parse(fs.readFileSync('docs/security/2026-11-27/audit-after.json','utf8'));
const current=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
assert(!current.error,JSON.stringify(current.error));
assert(current.vulnerabilities&&current.metadata?.vulnerabilities,'Invalid audit response');
const rank={info:0,low:1,moderate:2,high:3,critical:4};
const failures=[];
for(const [name,v] of Object.entries(current.vulnerabilities)){
 const old=baseline.vulnerabilities[name];
 if(!old||rank[v.severity]>rank[old.severity]||v.severity==='critical')failures.push(name+': new/increased severity '+v.severity);
 const reviewed=new Set((old?.via||[]).filter(x=>typeof x==='object').map(x=>x.url));
 for(const via of v.via.filter(x=>typeof x==='object'))if(!reviewed.has(via.url))failures.push(name+': unreviewed '+via.url);
}
assert.equal(current.metadata.vulnerabilities.critical,0,'Critical vulnerability');
assert.deepEqual(failures,[],'Audit changed: review required; do not auto-upgrade');
console.log(JSON.stringify({audit:process.argv[2],counts:current.metadata.vulnerabilities,reviewedResidualsAccepted:true},null,2));
