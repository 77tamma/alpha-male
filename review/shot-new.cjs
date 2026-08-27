const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/shots';
(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  cdp.events.length = 0;
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(4500);
  for (const id of ['#product','#inside','#proof','#get']) {
    await evaluate(cdp,`document.querySelector('${id}').scrollIntoView({behavior:'instant',block:'start'})`);
    await sleep(1500);
    await shot(cdp, `${OUT}/v2${id.replace('#','-')}.png`);
  }
  await evaluate(cdp,`document.querySelector('.guar').scrollIntoView({behavior:'instant',block:'center'})`);
  await sleep(1400); await shot(cdp, OUT+'/v2-guarantee.png');
  const errs = cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error').map(e=>e.params.entry.text);
  console.log('console errors:', errs.length?errs:'none');
  console.log('overflow:', await evaluate(cdp,`({s:document.documentElement.scrollWidth,c:document.documentElement.clientWidth})`));
  console.log('tiers wired:', await evaluate(cdp,`[...document.querySelectorAll('.tier')].map(t=>({buy:t.dataset.buy,href:t.getAttribute('href'),soon:t.classList.contains('tier--soon')}))`));
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
