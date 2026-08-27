const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';

const PROBE = `(()=>{
  const s = document.getElementById('guarantee');
  const op = e => { const x = document.querySelector(e); return x ? +(+getComputedStyle(x).opacity).toFixed(2) : null; };
  const cp = e => { const x = document.querySelector(e); return x ? getComputedStyle(x).clipPath.slice(0,34) : null; };
  return { g: getComputedStyle(s).getPropertyValue('--g').trim(),
    kick: op('.guar__kick'), h: op('.guar__h'), p: op('.guar__p'),
    fig: op('.guar__fig'), list: op('.guar__list'), clipH: cp('.guar__h') };})()`;

(async () => {
  const url = process.argv[2] || 'http://localhost:8899/';
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length = 0;
  await cdp.send('Emulation.setDeviceMetricsOverride', { width:1600, height:1000, deviceScaleFactor:1, mobile:false });
  await cdp.send('Page.navigate', { url }); await sleep(6800);

  // park well above the section, then walk down through it
  await evaluate(cdp, `document.getElementById('guarantee').scrollIntoView({block:'start',behavior:'instant'})`);
  await sleep(400);
  await evaluate(cdp, `scrollBy(0,-820)`);
  await sleep(1000);

  for (let i = 0; i < 7; i++) {
    if (i) { await evaluate(cdp, `scrollBy(0,190)`); await sleep(620); }
    console.log('  ' + JSON.stringify(await evaluate(cdp, PROBE)));
    if (i === 3) await shot(cdp, `${OUT}/guar-red-mid.png`);
  }
  await evaluate(cdp, `document.getElementById('guarantee').scrollIntoView({block:'center',behavior:'instant'})`);
  await sleep(1400);
  console.log('  settled ' + JSON.stringify(await evaluate(cdp, PROBE)));
  await shot(cdp, `${OUT}/guar-red.png`);

  const errs = cdp.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
  console.log('errors:', errs.length ? errs.map(e => e.params.entry.text.slice(0,130)) : 'none');
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
