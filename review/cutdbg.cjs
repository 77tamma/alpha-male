const { connect, evaluate, sleep } = require('./cdp.cjs');
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5500);
  const top=await evaluate(cdp,`document.getElementById('how').getBoundingClientRect().top+scrollY`);
  await evaluate(cdp,`window.scrollTo(0,${Math.round(top-500)})`); await sleep(1000);
  const r=await evaluate(cdp,`(()=>{const d=document.querySelector('.cut .d');const cs=getComputedStyle(d);
    return {p:getComputedStyle(document.getElementById('how')).getPropertyValue('--p'),
      len:cs.getPropertyValue('--len'), dd:cs.getPropertyValue('--dd'), k:cs.getPropertyValue('--k'),
      dasharray:cs.strokeDasharray, dashoffset:cs.strokeDashoffset,
      inline:d.getAttribute('style')};})()`);
  console.log(JSON.stringify(r,null,1));
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
