const { connect, evaluate, sleep } = require('./cdp.cjs');
function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);}
function ratio(a,b){const x=lum(a),y=lum(b),h=Math.max(x,y),l=Math.min(x,y);return (h+0.05)/(l+0.05);}
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);
  const g=await evaluate(cdp,`(()=>{const s=document.getElementById('scent');return {track:s.offsetHeight,top:Math.round(s.getBoundingClientRect().top+scrollY)};})()`);
  const span=g.track-900;
  const worst={};
  for (const f of [0.55,0.7,0.85,1.0]) {
    await evaluate(cdp,`window.scrollTo(0,${Math.round(g.top+span*f)})`); await sleep(1300);
    for (const sel of ['.scent__head','.sn--l .sn__k','.sn--l .sn__v','.sn--l .sn__d','.sn--r .sn__k','.sn--r .sn__d']) {
      const r=await evaluate(cdp,`(()=>{const e=document.querySelector('#scent ${sel}');if(!e)return null;const b=e.getBoundingClientRect();
        return {c:getComputedStyle(e).color,x:Math.round(b.x+scrollX),y:Math.round(b.y+scrollY),w:Math.round(b.width),h:Math.round(b.height)};})()`);
      if(!r||r.w<6||r.h<6) continue;
      await evaluate(cdp,`document.querySelectorAll('#scent .scent__ui *').forEach(e=>e.style.visibility='hidden')`);
      await sleep(130);
      const sh=await cdp.send('Page.captureScreenshot',{format:'png',clip:{x:r.x,y:r.y,width:r.w,height:r.h,scale:1},captureBeyondViewport:false});
      await evaluate(cdp,`document.querySelectorAll('#scent .scent__ui *').forEach(e=>e.style.visibility='')`);
      const px=await evaluate(cdp,`(async()=>{const i=new Image();i.src='data:image/png;base64,${sh.data}';await i.decode();
        const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const x=c.getContext('2d');x.drawImage(i,0,0);
        const d=x.getImageData(0,0,c.width,c.height).data;const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};
        let w=-1,q=null;for(let k=0;k<d.length;k+=4){const L=0.2126*f(d[k])+0.7152*f(d[k+1])+0.0722*f(d[k+2]);if(L>w){w=L;q=[d[k],d[k+1],d[k+2]];}}return q;})()`);
      const col=r.c.replace(/[^0-9,]/g,'').split(',').slice(0,3).map(Number);
      const rr=ratio(col,px);
      if(!worst[sel]||rr<worst[sel].r) worst[sel]={r:rr,px};
    }
  }
  let ok=true;
  for (const [k,v] of Object.entries(worst)){const pass=v.r>=3.5; if(!pass)ok=false;
    console.log('  '+k.padEnd(16), v.r.toFixed(2)+':1 over rgb('+v.px.join(',')+')', pass?'PASS':'FAIL');}
  console.log(ok?'ALL PASS':'FAILURES');
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
