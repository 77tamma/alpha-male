// Full-page sanity under the artifact's CSP: does the whole page still work, and does the
// red field survive being served with the strict policy?
const { connect, evaluate, sleep } = require('./cdp.cjs');
(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length = 0;
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: 'http://localhost:8911/' }); await sleep(7000);

  const r = await evaluate(cdp, `(()=>{
    const g=document.getElementById('guarantee');
    return {sections:[...document.querySelectorAll('section')].map(s=>s.id||s.className.split(' ')[1]),
      guarBg:getComputedStyle(g).backgroundImage.slice(0,46),
      guarAnims:document.getAnimations().filter(a=>{try{return a.effect.target.closest('.guar')}catch(e){return 0}}).length,
      heroScrubbed:(()=>{const v=document.getElementById('heroScrub');return v?{src:v.currentSrc.slice(0,16),ready:v.readyState,dur:Math.round(v.duration||0)}:null})(),
      scentScrubbed:(()=>{const v=document.getElementById('scentScrub');return v?{src:v.currentSrc.slice(0,16),ready:v.readyState,dur:Math.round(v.duration||0)}:null})(),
      badLinks:[...document.querySelectorAll('a[href^="#"]')].filter(a=>a.getAttribute('href')!=='#'&&!document.querySelector(a.getAttribute('href'))).map(a=>a.getAttribute('href')),
      overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
  console.log(JSON.stringify(r, null, 1));

  await evaluate(cdp, `document.getElementById('guarantee').scrollIntoView({block:'center',behavior:'instant'})`);
  await sleep(2000);
  const g = await evaluate(cdp, `(()=>{const s=document.getElementById('guarantee');
    return {inClass:s.classList.contains('in'),
      tick:getComputedStyle(document.querySelector('.gd--tick')).strokeDashoffset,
      hOpacity:getComputedStyle(document.querySelector('.guar__h')).opacity,
      liOpacity:[...document.querySelectorAll('.guar__row li')].map(e=>getComputedStyle(e).opacity)};})()`);
  console.log('guar', JSON.stringify(g));

  const errs = cdp.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
  console.log('errors:', errs.length ? errs.map(e => e.params.entry.text.slice(0, 140)) : 'none');
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
