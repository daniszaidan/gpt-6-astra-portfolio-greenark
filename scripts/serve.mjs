import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.png':'image/png','.gif':'image/gif','.pdf':'application/pdf','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost');
  const requested=decodeURIComponent(url.pathname).replace(/^\/+/, '');
  let file=path.resolve(root,requested||'index.html');
  if(file!==root&&!file.startsWith(root+path.sep)&&!file.startsWith(root)){res.writeHead(403);return res.end('Forbidden');}
  const stat=await fs.stat(file);if(stat.isDirectory())file=path.join(file,'index.html');
  const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Page not found');}
});
server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('Portfolio v2: http://127.0.0.1:'+server.address().port));
