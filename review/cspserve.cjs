// serve preview.html under a strict CSP resembling an artifact host
const http=require('http'), fs=require('fs');
// must be the file build-preview.cjs actually writes, or this tests a stale build
const file='C:/Users/DADWOR~1/AppData/Local/Temp/claude/C--Users-DadWorkPC/736b769d-3e4f-49ca-b756-c2895e569576/scratchpad/alphamale-preview.html';
http.createServer((req,res)=>{
  const body=fs.readFileSync(file);
  res.writeHead(200,{
    'Content-Type':'text/html; charset=utf-8',
    'Content-Security-Policy':
      "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; "+
      "img-src data: blob:; media-src data: blob:; font-src data:; connect-src 'self'"
  });
  res.end(body);
}).listen(8911,()=>console.error('csp server on 8911'));
