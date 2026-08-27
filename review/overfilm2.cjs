const { connect, evaluate, sleep } = require('./cdp.cjs');
function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);}
function ratio(a,b){const x=lum(a),y=lum(b),h=Math.max(x,y),l=Math.min(x,y);return (h+0.05)/(l+0.05);}
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);
  const g=await evaluate(cdp,`(()=>{const h=document.getElementById('how');const f=h.querySelector('.loud__film');
    return {track:h.offsetHeight, fh:Math.round(f.getBoundingClientRect().height), top:Math.round(h.getBoundingClientRect().top+scrollY)};})()`);
  const span=g.track-g.fh, stick=(900-g.fh)/2;
  const worst={};
  // every text is fully revealed and the film fully faded in past p≈0.75
  for (const pf of [0.78,0.88,0.98]) {
    await evaluate(cdp,`window.scrollTo(0,${Math.round(g.top - stick + span*pf)})`); await sleep(900);
    for (let k=0;k<8;k++){
      await evaluate(cdp,`document.getElementById('coupleLoop').currentTime=${(k*0.5).toFixed(2)}`);
      await sleep(360);
      for (const sel of ['.loud .h','.beat h3','.beat p','.formula span']) {
        const r=await evaluate(cdp,`(()=>{const e=document.querySelector('#how ${sel}');const b=e.getBoundingClientRect();
          return {c:getComputedStyle(e).color,x:Math.round(b.x+scrollX),y:Math.round(b.y+scrollY),w:Math.round(b.width),h:Math.round(b.height)};})()`);
        await evaluate(cdp,`document.querySelectorAll('.loud__copy > *,.beats > *').forEach(e=>e.style.visibility='hidden')`);
        await sleep(110);
        const s=await cdp.send('Page.captureScreenshot',{format:'png',clip:{x:r.x,y:r.y,width:Math.max(8,r.w),height:Math.max(8,r.h),scale:1},captureBeyondViewport:false});
        await evaluate(cdp,`document.querySelectorAll('.loud__copy > *,.beats > *').forEach(e=>e.style.visibility='')`);
        const px=await evaluate(cdp,`(async()=>{const i=new Image();i.src='data:image/png;base64,${s.data}';await i.decode();
          const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const x=c.getContext('2d');x.drawImage(i,0,0);
          const d=x.getImageData(0,0,c.width,c.height).data;const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};
          let w=-1,q=null;for(let k=0;k<d.length;k+=4){const L=0.2126*f(d[k])+0.7152*f(d[k+1])+0.0722*f(d[k+2]);if(L>w){w=L;q=[d[k],d[k+1],d[k+2]];}}return q;})()`);
        const col=r.c.replace(/[^0-9,]/g,'').split(',').slice(0,3).map(Number);
        const rr=ratio(col,px);
        if(!worst[sel]||rr<worst[sel].r) worst[sel]={r:rr,px};
      }
    }
  }
  let ok=true;
  console.log('worst across the loop, inside the pinned range:');
  for (const [k,v] of Object.entries(worst)){const pass=v.r>=3.5; if(!pass)ok=false;
    console.log('  '+k.padEnd(16), v.r.toFixed(2)+':1 over rgb('+v.px.join(',')+')', pass?'PASS':'FAIL');}
  console.log(ok?'ALL PASS':'FAILURES');
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
