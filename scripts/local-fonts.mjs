import fs from 'node:fs/promises';
const root=new URL('../assets/',import.meta.url);
const url='https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;550;600;650;700&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap';
const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}});
const css=await response.text();
const blocks=[...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)].map(m=>m[1]);
if(!blocks.length)throw new Error('No Latin font faces found');
await fs.mkdir(new URL('fonts/',root),{recursive:true});
let output=blocks.join('\n');
const urls=[...new Set([...output.matchAll(/url\(([^)]+)\)/g)].map(m=>m[1]))];
for(const [i,link] of urls.entries()){
 const r=await fetch(link);if(!r.ok)throw Error(link);
 const name=`font-${i+1}.woff2`;
 await fs.writeFile(new URL('fonts/'+name,root),Buffer.from(await r.arrayBuffer()));
 output=output.replaceAll(link,'fonts/'+name);
}
await fs.writeFile(new URL('fonts.css',root),'/* Google Fonts: DM Sans, IBM Plex Mono, Instrument Serif. SIL Open Font License. */\n'+output);
console.log('Stored',urls.length,'font files locally.');
