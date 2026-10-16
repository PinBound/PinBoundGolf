import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost'),pathname=decodeURIComponent(url.pathname);
    if(pathname.includes('..')||pathname.includes('\\')){res.writeHead(403);return res.end();}
    let relative=pathname==='/'?'index.html':pathname.slice(1);
    if(relative!=='index.html'&&!relative.startsWith('src/'))relative='public/'+relative;
    const file=path.resolve(root,relative);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
    const info=await stat(file);if(!info.isFile())throw new Error('Not file');
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(await readFile(file));
  }catch{res.writeHead(404);res.end('Not found');}
});
const port=Number(process.env.PORT||4180);server.listen(port,'127.0.0.1',()=>console.log(`Pinbound: http://127.0.0.1:${port}`));
