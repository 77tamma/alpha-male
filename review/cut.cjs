const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);
  const top=await evaluate(cdp,`document.getElementById('how').getBoundingClientRect().top+scrollY`);
  for (const off of [-500,-100,250,600]) {
    await evaluate(cdp,`window.scrollTo(0,${Math.round(top+off)})`); await sleep(1100);
    const st=await evaluate(cdp,`(()=>{const h=document.getElementById('how');
      const ds=[...document.querySelectorAll('.cut .d')];
      const v=document.getElementById('smokeBed2');
      return {p:getComputedStyle(h).getPropertyValue('--p').trim(),
        drawn:ds.map(d=>{const cs=getComputedStyle(d);
          const num=v=>{const m=String(v).match(/-?[0-9.]+/);return m?parseFloat(m[0]):0;}; const len=num(cs.strokeDasharray)||1, off=num(cs.strokeDashoffset);
          return +(1-off/len).toFixed(2);}),
        items:[...document.querySelectorAll('.mech__item')].map(i=>+getComputedStyle(i).opacity.slice(0,4)),
        bedPaused:v?v.paused:null, bedT:v?+v.currentTime.toFixed(2):null,
        overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
    console.log('off='+String(off).padStart(5), JSON.stringify(st));
    await shot(cdp,`${OUT}/cut-${off}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,120)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
