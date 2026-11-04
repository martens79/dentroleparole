import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import cp from 'node:child_process';
import ts from 'typescript';
import {createHash} from 'node:crypto';
function data(source) {
  const box = {exports: {}};
  vm.runInNewContext(ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText, box);
  return JSON.parse(JSON.stringify(box.exports));
}
const items = data(fs.readFileSync('src/data/portfolio.ts', 'utf8')).portfolioItems;
const old = data(cp.execFileSync('git', ['show', 'ac8fc21:src/data/portfolio.ts'], {encoding: 'utf8'})).portfolioItems;
const brief = fs.readFileSync('docs/BRIEF_COMPLETO_2026-11-04.md', 'utf8').replaceAll('\r\n','\n');
const exact = title => {
  const matches = items.filter(i => i.title === title);
  assert.equal(matches.length, 1, title + ' must occur once');
  return matches[0];
};
const replacements = {
  'Romanzo autobiografico su resilienza e rivincita personale': 'Respiro di un salto invisibile',
  'Secondo volume di un romanzo surreale': 'Mela glassata deluxe',
  'Saggio divulgativo di astrofisica': 'La vita e le stelle',
  'Contemporary Romance Young Adult': 'The Bad Boy’s Love 4',
};
for (const before of old) {
  if (replacements[before.title]) {
    const after = exact(replacements[before.title]);
    for (const field of ['desc','highlights','category','status']) assert.deepEqual(after[field],before[field]);
  } else {
    const matches = items.filter(i => i.cover === before.cover && i.title === before.title);
    assert.equal(matches.length,1);
    assert.deepEqual(matches[0],before);
  }
}
const harmonyTitles = ['Duello di corteggiamento','Il duca dottore','Come sposare un duca tentatore','Una seducente sfida per il duca','La dama che sfidò il duca','Come corteggiare un libertino','La sirena del Norfolk','Un bacio proibito con il laird'];
for (const title of harmonyTitles) {
  const item = exact(title);
  assert.equal(item.collection, old.find(i => i.title.startsWith('Romanzo Harmony')).title);
  assert.ok(old.some(i => i.desc === item.desc), 'Harmony intervention must come from repository');
  assert.equal(item.year,undefined);
}
for (let n=13; n<=20; n++) {
  const match = brief.match(new RegExp('\\*\\*'+n+'\\. (.*?)\\*\\*[^\\n]*\\n([\\s\\S]*?)(?=\\n\\*\\*\\d+\\.|\\n### |\\n## Controlli)'));
  const item = exact(match[1]);
  const paragraphs = match[2].trim().split('\n\n').filter(p => /^(Intervento |Il lavoro |Il progetto,|Un'iniziativa|Percorso di writing|Un percorso)/.test(p));
  assert.equal(item.desc, paragraphs.join('\n\n'), 'verbatim paragraphs: '+n);
  for (const [label,field] of [['Autrici','author'],['Autrice','author'],['Autore','author'],['Autori','author'],['Casa editrice','publisher'],['Genere','genre'],['Servizio','service'],['Modalità','modality']]) {
    const value = match[2].match(new RegExp('^'+label+': (.+)$','m'));
    if (value) assert.equal(item[field],value[1]);
  }
}
for (const asset of JSON.parse(fs.readFileSync('docs/copertine-sha256.json','utf8'))) {
  assert.equal(createHash('sha256').update(fs.readFileSync(asset.file)).digest('hex'),asset.sha256);
}
const covered = items.filter(i => /\/\d{2}_/.test(i.cover || ''));
assert.equal(covered.length,18);
assert.equal(new Set(covered.map(i => i.cover)).size,18);
for (const i of items) if (i.cover) assert.ok(fs.existsSync('public'+i.cover),i.cover);
for (const i of covered) assert.ok(i.coverAlt?.length>10);
assert.equal(exact('Il Custode del Tempo').cover,undefined);
assert.equal(exact('Percorso di Writing Coaching').cover,undefined);
assert.equal(exact('Percorso di Writing Coaching').statusLabel,'Collaborazione in corso');
const respiro = exact('Respiro di un salto invisibile');
assert.equal(respiro.year,undefined);
assert.equal(respiro.release,'In uscita il 22 gennaio 2027');
assert.equal(respiro.editorialNote,undefined);
assert.ok(!/2007/.test(JSON.stringify(respiro)));
assert.match(exact('Mela glassata deluxe').coverAlt,/dorso/);
assert.match(exact('Sentieri di carta – Racconti senza confini').desc,/del racconto Aurora/);
const updates = data(fs.readFileSync('src/data/updates.ts','utf8')).updates;
assert.equal(updates.length,2);
assert.deepEqual(updates.map(i=>'✦ '+i.desc),[
  '✦ Stesura in corso di un romanzo Dark Fantasy Romance per Just Read Edizioni.',
  '✦ Editing narrativo in corso su due romanzi, con interventi strutturali, stilistici e di approfondimento dei personaggi.'
]);
assert.equal(items.length,old.length+16);
const config = JSON.parse(fs.readFileSync('vercel.json','utf8').replace(/^\uFEFF/,''));
assert.equal(config.git.deploymentEnabled['work/donatella-21-aggiornamenti-20261104'], false);
console.log(`PASS: 21 requests; 19 target books (8 Harmony), coaching, 2 exact ticker messages; 18 original images; ${old.length} previous entries preserved/updated -> ${items.length} total.`);
