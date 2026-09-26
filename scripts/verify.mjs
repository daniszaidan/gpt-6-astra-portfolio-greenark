import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const expected=['index.html','works.html','about.html','expertise.html','playground.html','contact.html','certificate.html','cv.html',...['watchlur','dataexchange','alrizan','myindihome','smartcapex','zeitplan','weddoes','endlesscode','chevalier','mediku'].map(x=>'works/'+x+'/index.html')];
let checks=0;
for(const file of expected){
 const abs=path.join(root,file);const html=await fs.readFile(abs,'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,file+' must have one h1');
 assert.match(html,/<title>[^<]+<\/title>/);assert.match(html,/id="main"/);
 for(const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
  const value=m[1];if(/^(https?:|mailto:|data:|tel:)/.test(value))continue;
  const target=path.resolve(path.dirname(abs),decodeURIComponent(value.split(/[?#]/)[0]));
  assert.ok(target.startsWith(root),file+' escapes folder: '+value);
  await fs.access(target);checks++;
 }
 assert.ok(!/href="#"/.test(html),file+' has placeholder link');
}
const source=JSON.parse(await fs.readFile(path.join(root,'reference/source.json')));
const map=JSON.parse(await fs.readFile(path.join(root,'reference/asset-map.json')));
for(const p of source.filter(p=>p.path.startsWith('works/'))){
 const html=await fs.readFile(path.join(root,p.path,'index.html'),'utf8');
 for(const im of p.images.filter(i=>i.alt!=='danis zaidan'))assert.ok(html.includes(map[im.src]),p.path+' is missing '+im.alt);
}
assert.match(await fs.readFile(path.join(root,'contact.html'),'utf8'),/email application/);
assert.equal((await fs.readFile(path.join(root,'certificate.html'),'utf8')).match(/class="certificate-card/g).length,14);
const comparison=await fs.readFile(path.join(root,'works/dataexchange/index.html'),'utf8');
assert.match(comparison,/data-caption="dx hero before"[\s\S]*?data-caption="dx hero after"/,'Hero comparison needs the before and after in the gallery');
console.log(`PASS: ${expected.length} pages, ${checks} local references, all original project imagery, 14 certificates, honest contact workflow.`);
