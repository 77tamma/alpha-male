const { connect, evaluate, sleep } = require('./cdp.cjs');
(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(3500);
  console.log('pinned (reduced motion on):', await evaluate(cdp,`[...document.querySelectorAll('.band')].map(b=>b.style.getPropertyValue('--k'))`));
  await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await sleep(2500);
  console.log('after flip off, at scrollY=0:', await evaluate(cdp,`[...document.querySelectorAll('.band')].map(b=>b.style.getPropertyValue('--k'))`));
  await evaluate(cdp,`window.scrollTo(0, document.getElementById('hero-sec').offsetHeight*0.45)`); await sleep(1200);
  console.log('after scrolling to 45%:      ', await evaluate(cdp,`[...document.querySelectorAll('.band')].map(b=>b.style.getPropertyValue('--k'))`));
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
