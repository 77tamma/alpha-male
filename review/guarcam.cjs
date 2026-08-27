const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';

const PROBE = `(()=>{
  const s = document.getElementById('guarantee');
  const op = e => { const x = document.querySelector(e); return x ? +(+getComputedStyle(x).opacity).toFixed(2) : null; };
  const cam = getComputedStyle(document.querySelector('.guar__cam')).transform;
  return { sp:+getComputedStyle(s).getPropertyValue('--sp'),
    kick:op('.guar__kick'), h:op('.guar__h'), p:op('.guar__p'),
    r1:op('.guar__row li:nth-child(1)'), r2:op('.guar__row li:nth-child(2)'), r3:op('.guar__row li:nth-child(3)'),
    cam: cam.slice(0,46),
    anims: document.getAnimations().filter(a=>{try{return a.effect.target.closest('#guarantee')}catch(e){return 0}}).length,
    ovf: document.documentElement.scrollWidth - document.documentElement.clientWidth };})()`;

(async () => {
  const url = process.argv[2] || 'http://localhost:8899/';
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length = 0;
  await cdp.send('Emulation.setDeviceMetricsOverride', { width:1600, height:1000, deviceScaleFactor:1, mobile:false });
  await cdp.send('Page.navigate', { url }); await sleep(6800);

  const top = await evaluate(cdp, `(()=>{const s=document.getElementById('guarantee');
    return Math.round(s.getBoundingClientRect().top + scrollY);})()`);
  const span = await evaluate(cdp, `(()=>{const s=document.getElementById('guarantee');
    return Math.max(1, s.offsetHeight - innerHeight);})()`);
  console.log('track top=' + top + '  scrub span=' + span + 'px');

  for (const f of [0, 0.2, 0.4, 0.6, 0.8, 1]) {
    await evaluate(cdp, `scrollTo(0, ${top} + ${span} * ${f})`);
    await sleep(750);
    const r = await evaluate(cdp, PROBE);
    console.log('  sp≈' + f.toFixed(1) + '  ' + JSON.stringify(r));
    if (f === 0 || f === 0.5 || f === 1) await shot(cdp, `${OUT}/cam-${String(f).replace('.','')}.png`);
    if (f === 0.4) await shot(cdp, `${OUT}/cam-mid.png`);
  }

  const errs = cdp.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
  console.log('errors:', errs.length ? errs.map(e => e.params.entry.text.slice(0,130)) : 'none');
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
