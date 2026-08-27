const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);}
function ratio(a,b){const x=lum(a),y=lum(b),h=Math.max(x,y),l=Math.min(x,y);return (h+0.05)/(l+0.05);}
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  for (const [w,h] of [[1440,900],[1024,800],[820,900],[375,812]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<500});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(4500);
    await evaluate(cdp,`document.getElementById('how').scrollIntoView({behavior:'instant',block:'start'})`);
    await sleep(1600);
    const st=await evaluate(cdp,`(()=>{const its=[...document.querySelectorAll('.mech__item')];
      return {n:its.length, overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth,
        shown:its.map(i=>+getComputedStyle(i).opacity),
        widths:its.map(i=>Math.round(i.getBoundingClientRect().width)),
        formula:document.querySelector('.formula').textContent.replace(/\s+/g,' ').trim(),
        eyebrow:document.querySelector('#how .eyebrow').textContent.trim(),
        head:document.querySelector('#how .h').textContent.trim()};})()`);
    console.log(w+'x'+h, JSON.stringify(st));
    await shot(cdp,`${OUT}/mech-${w}.png`);
  }
  // contrast of the new text against the section ground
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await evaluate(cdp,`document.getElementById('how').scrollIntoView({behavior:'instant',block:'start'})`); await sleep(1200);
  for (const sel of ['.formula','.mech__item h3','.mech__item p','.mech__n']) {
    const r=await evaluate(cdp,`(()=>{const e=document.querySelector('${sel}');const b=e.getBoundingClientRect();
      return {c:getComputedStyle(e).color,x:Math.round(b.x+scrollX),y:Math.round(b.y+scrollY),w:Math.round(b.width),h:Math.round(b.height)};})()`);
    await evaluate(cdp,`document.querySelectorAll('.formula,.mech__item h3,.mech__item p,.mech__n').forEach(e=>e.style.visibility='hidden')`);
    await sleep(200);
    const s=await cdp.send('Page.captureScreenshot',{format:'png',clip:{x:r.x,y:r.y,width:Math.max(8,r.w),height:Math.max(8,r.h),scale:1},captureBeyondViewport:false});
    await evaluate(cdp,`document.querySelectorAll('.formula,.mech__item h3,.mech__item p,.mech__n').forEach(e=>e.style.visibility='')`);
    const px=await evaluate(cdp,`(async()=>{const i=new Image();i.src='data:image/png;base64,${s.data}';await i.decode();
      const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const x=c.getContext('2d');x.drawImage(i,0,0);
      const d=x.getImageData(0,0,c.width,c.height).data;const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};
      let w=-1,q=null;for(let k=0;k<d.length;k+=4){const L=0.2126*f(d[k])+0.7152*f(d[k+1])+0.0722*f(d[k+2]);if(L>w){w=L;q=[d[k],d[k+1],d[k+2]];}}return q;})()`);
    const col=r.c.replace(/[^0-9,]/g,'').split(',').slice(0,3).map(Number);
    console.log(sel.padEnd(18), ratio(col,px).toFixed(2)+':1', ratio(col,px)>=3.5?'PASS':'FAIL');
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
