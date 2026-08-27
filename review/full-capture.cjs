const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  cdp.events.length = 0;
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);

  const range = await evaluate(cdp,`document.getElementById('hero-sec').offsetHeight - window.innerHeight`);
  const beats = [['01-hero-open',0],['02-hero-fall',0.32],['03-hero-approach',0.60],['04-hero-settle',1.0]];
  for (const [name,p] of beats) {
    await evaluate(cdp,`window.scrollTo(0, ${Math.round(range*p)})`);
    await sleep(1600);
    await shot(cdp, `${OUT}/${name}.png`);
  }
  const secs = [['05-product','#product'],['06-how','#how'],['07-scent','#scent'],
                ['08-inside','#inside'],['09-proof','#proof'],['10-faq','#faq'],['11-close','#get']];
  for (const [name,sel] of secs) {
    await evaluate(cdp,`document.querySelector('${sel}').scrollIntoView({behavior:'instant',block:'start'})`);
    await sleep(1500);
    await shot(cdp, `${OUT}/${name}.png`);
  }
  await evaluate(cdp,`document.querySelector('.guar').scrollIntoView({behavior:'instant',block:'center'})`);
  await sleep(1400); await shot(cdp, `${OUT}/10b-guarantee.png`);
  await evaluate(cdp,`window.scrollTo(0, document.body.scrollHeight)`);
  await sleep(1400); await shot(cdp, `${OUT}/12-footer.png`);

  // phone
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
  await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(4500);
  await shot(cdp, `${OUT}/13-phone-hero.png`);
  for (const [n,s] of [['14-phone-product','#product'],['15-phone-proof','#proof'],['16-phone-close','#get']]) {
    await evaluate(cdp,`document.querySelector('${s}').scrollIntoView({behavior:'instant',block:'start'})`);
    await sleep(1300); await shot(cdp, `${OUT}/${n}.png`);
  }
  const errs = cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('console errors:', errs.length ? errs.map(e=>e.params.entry.text) : 'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
