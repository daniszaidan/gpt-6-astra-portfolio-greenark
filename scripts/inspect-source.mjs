import fs from 'node:fs/promises';
const pages=['','about','works','cv','certificate','works/watchlur','works/dataexchange','works/alrizan','works/myindihome','works/smartcapex','works/zeitplan','works/weddoes','works/endlesscode','works/chevalier','works/mediku'];
await fs.mkdir(new URL('../reference/',import.meta.url),{recursive:true});
const result=await Promise.all(pages.map(async path=>{
 const html=await fetch('https://daniszaidan.vercel.app/'+path).then(r=>r.text());
 const images=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>({alt:m[0].match(/alt="([^"]*)"/)?.[1],src:m[0].match(/src="([^"]*)"/)?.[1]?.replaceAll('&amp;','&')}));
 const links=[...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(m=>({href:m[1].replaceAll('&amp;','&'),text:m[2].replace(/<[^>]+>/g,' ').trim()}));
 const text=html.replace(/<script\b[\s\S]*?<\/script>/g,'').replace(/<style\b[\s\S]*?<\/style>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
 return {path,images,links,text};
}));
await fs.writeFile(new URL('../reference/source.json',import.meta.url),JSON.stringify(result,null,2));
for(const p of result) console.log(p.path||'home',p.images.length,'images',p.links.length,'links');
