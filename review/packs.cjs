const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  for (const [w,h] of [[1440,900],[1280,800]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5000);
    const top=await evaluate(cdp,`document.getElementById('product').getBoundingClientRect().top+scrollY`);
    await evaluate(cdp,`window.scrollTo(0,${Math.round(top+800)})`); await sleep(1500);
    const st=await evaluate(cdp,`(()=>{const p=[...document.querySelectorAll('.pack')];
      return {n:p.length, overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth,
        cards:p.map(c=>({buy:c.dataset.buy, price:c.querySelector('.pack__p').textContent,
          soon:c.classList.contains('pack--soon'), href:c.getAttribute('href'),
          aria:c.getAttribute('aria-disabled'),
          w:Math.round(c.getBoundingClientRect().width),
          overflows:c.scrollWidth>c.clientWidth+1})),
        opacity:+getComputedStyle(document.querySelector('.packs')).opacity};})()`);
    console.log(w+'x'+h, JSON.stringify(st));
    await shot(cdp,`${OUT}/packs-${w}.png`);
  }
  // bottom tiers
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await evaluate(cdp,`document.querySelector('.tiers').scrollIntoView({behavior:'instant',block:'center'})`); await sleep(1200);
  const t=await evaluate(cdp,`[...document.querySelectorAll('.tier')].map(x=>({q:x.querySelector('.tier__q').textContent,p:x.querySelector('.tier__p').textContent,u:x.querySelector('.tier__u').textContent.replace(/\s+/g,' ').trim()}))`);
  console.log('tiers',JSON.stringify(t));
  await shot(cdp,`${OUT}/tiers-new.png`);
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
