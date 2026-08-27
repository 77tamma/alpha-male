const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);}
function ratio(a,b){const x=lum(a),y=lum(b),h=Math.max(x,y),l=Math.min(x,y);return (h+0.05)/(l+0.05);}
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  // desktop contrast of the copy over the veiled bed, at the worst point
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5000);
  const top=await evaluate(cdp,`document.getElementById('product').getBoundingClientRect().top+scrollY`);
  await evaluate(cdp,`window.scrollTo(0,${Math.round(top+1350*0.8)})`); await sleep(1200);
  for (const sel of ['.pin__copy .h','.pin__copy .lede','.pin__copy .price__u']) {
    const box=await evaluate(cdp,`(()=>{const e=document.querySelector('${sel}');const r=e.getBoundingClientRect();
      const c=getComputedStyle(e).color;
      return {x:Math.round(r.x+scrollX-4),y:Math.round(r.y+scrollY-4),w:Math.round(r.width)+8,h:Math.round(r.height)+8,c:c};})()`);
    await evaluate(cdp,`document.querySelectorAll('.pin__copy .h,.pin__copy .lede,.pin__copy .price,.pin__copy .cta-row').forEach(e=>e.style.visibility='hidden')`);
    await sleep(200);
    const s=await cdp.send('Page.captureScreenshot',{format:'png',clip:{x:box.x,y:box.y,width:box.w,height:box.h,scale:1},captureBeyondViewport:false});
    await evaluate(cdp,`document.querySelectorAll('.pin__copy .h,.pin__copy .lede,.pin__copy .price,.pin__copy .cta-row').forEach(e=>e.style.visibility='')`);
    const px=await evaluate(cdp,`(async()=>{const i=new Image();i.src='data:image/png;base64,${s.data}';await i.decode();
      const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const x=c.getContext('2d');x.drawImage(i,0,0);
      const d=x.getImageData(0,0,c.width,c.height).data;const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};
      let w=-1,q=null;for(let k=0;k<d.length;k+=4){const L=0.2126*f(d[k])+0.7152*f(d[k+1])+0.0722*f(d[k+2]);if(L>w){w=L;q=[d[k],d[k+1],d[k+2]];}}return q;})()`);
    const col=box.c.replace(/[^0-9,]/g,'').split(',').slice(0,3).map(Number);
    console.log(sel.padEnd(22), 'rgb('+col.join(',')+') over rgb('+px.join(',')+')  =', ratio(col,px).toFixed(2)+':1', ratio(col,px)>=3.5?'PASS':'FAIL');
  }
  // phone
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(4500);
  const m=await evaluate(cdp,`(()=>{const t=document.getElementById('product');
    return {trackH:t.offsetHeight, pinPos:getComputedStyle(t.querySelector('.pin')).position,
            shotW:Math.round(document.querySelector('.rig__unit').getBoundingClientRect().width),
            overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
  console.log('phone', JSON.stringify(m));
  await evaluate(cdp,`document.getElementById('product').scrollIntoView({behavior:'instant',block:'start'})`); await sleep(1400);
  await shot(cdp,`${OUT}/prod-phone.png`);
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('console errors:', errs.length?errs.map(e=>e.params.entry.text):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
