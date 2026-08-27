const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5000);
  const top=await evaluate(cdp,`document.getElementById('product').getBoundingClientRect().top+scrollY`);
  await evaluate(cdp,`window.scrollTo(0,${Math.round(top+740)})`); await sleep(1400);
  const geom=await evaluate(cdp,`(()=>{const s=[...document.querySelectorAll('.spot')];
    const pin=document.querySelector('.pin').getBoundingClientRect();
    return {n:s.length, pin:{l:Math.round(pin.left),r:Math.round(pin.right),t:Math.round(pin.top),b:Math.round(pin.bottom)},
      dots:s.map(b=>{const r=b.getBoundingClientRect();return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};}),
      scale:getComputedStyle(document.querySelector('.rig__stack')).transform.slice(0,30)};})()`);
  console.log('geom',JSON.stringify(geom));
  // open each and verify the card lands inside the pin
  for (let i=0;i<geom.n;i++){
    await evaluate(cdp,`document.querySelectorAll('.spot')[${i}].dispatchEvent(new Event('focus'))`);
    await sleep(700);
    const st=await evaluate(cdp,`(()=>{const b=document.querySelectorAll('.spot')[${i}];
      const n=document.getElementById(b.getAttribute('aria-controls'));const r=n.getBoundingClientRect();
      const p=document.querySelector('.pin').getBoundingClientRect();
      return {open:n.classList.contains('is-open'),expanded:b.getAttribute('aria-expanded'),
        inside:(r.left>=p.left-1&&r.right<=p.right+1&&r.top>=p.top-1&&r.bottom<=p.bottom+1),
        box:{l:Math.round(r.left),r:Math.round(r.right),t:Math.round(r.top),b:Math.round(r.bottom)},
        opacity:+getComputedStyle(n).opacity};})()`);
    console.log(' spot'+i, JSON.stringify(st));
    await shot(cdp,`${OUT}/spot-${i}.png`);
    await evaluate(cdp,`document.querySelectorAll('.spot')[${i}].dispatchEvent(new Event('blur'))`);
    await sleep(350);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:', errs.length?errs.map(e=>e.params.entry.text.slice(0,120)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
