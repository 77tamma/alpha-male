const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';

const PROBE = `(()=>{
  const s = document.getElementById('guarantee');
  const op = e => { const x = document.querySelector(e); return x ? +(+getComputedStyle(x).opacity).toFixed(2) : null; };
  const fill = getComputedStyle(document.querySelector('.steps__fill')).transform;
  const m = fill.match(/matrix\\(([\\d.]+)/);
  return { sp:+getComputedStyle(s).getPropertyValue('--sp'),
    kick:op('.guar__kick'), h1:op('.guar__h1'), h2:op('.guar__h2'), p:op('.guar__p'),
    s1:op('.step:nth-child(1)'), s2:op('.step:nth-child(2)'), s3:op('.step:nth-child(3)'),
    railFill: m ? +(+m[1]).toFixed(2) : null,
    anims: document.getAnimations().filter(a=>{try{return a.effect.target.closest('#guarantee')}catch(e){return 0}}).length,
    ovf: document.documentElement.scrollWidth - document.documentElement.clientWidth };})()`;

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length = 0;
  await cdp.send('Emulation.setDeviceMetricsOverride', { width:1600, height:1000, deviceScaleFactor:1, mobile:false });
  await cdp.send('Page.navigate', { url: process.argv[2] || 'http://localhost:8899/' }); await sleep(6800);

  const top  = await evaluate(cdp, `Math.round(document.getElementById('guarantee').getBoundingClientRect().top + scrollY)`);
  const span = await evaluate(cdp, `(()=>{const s=document.getElementById('guarantee');return Math.max(1,s.offsetHeight-innerHeight);})()`);
  console.log('scrub span=' + span + 'px');

  for (const f of [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1]) {
    await evaluate(cdp, `scrollTo(0, ${top} + ${span} * ${f})`);
    await sleep(700);
    console.log('  ' + f.toFixed(2) + '  ' + JSON.stringify(await evaluate(cdp, PROBE)));
    if (f === 0.65) await shot(cdp, `${OUT}/promise-mid.png`);
    if (f === 1)    await shot(cdp, `${OUT}/promise-end.png`);
  }

  // the seam into the offer, now that the rule is gone
  await evaluate(cdp, `(()=>{const g=document.getElementById('get');
    scrollTo(0, g.getBoundingClientRect().top + scrollY - 260);})()`);
  await sleep(900);
  await shot(cdp, `${OUT}/seam-offer.png`);

  const errs = cdp.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
  console.log('errors:', errs.length ? errs.map(e => e.params.entry.text.slice(0,130)) : 'none');
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
