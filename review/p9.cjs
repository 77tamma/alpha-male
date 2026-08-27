const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final/';

const P = `(()=>{
  const op = e => { const x = document.querySelector(e); return x ? +(+getComputedStyle(x).opacity).toFixed(2) : null; };
  const steps = [...document.querySelectorAll('.steps__row .step')].map(e => +(+getComputedStyle(e).opacity).toFixed(2));
  const glosses = [...document.querySelectorAll('.step em')].map(e => e.textContent);
  const tf = getComputedStyle(document.querySelector('.steps__fill')).transform;
  const m = tf.match(/matrix\\(([0-9.]+)/);
  const row = document.querySelector('.steps__row').getBoundingClientRect();
  const one = document.querySelector('.step').getBoundingClientRect();
  return { sp:+getComputedStyle(document.getElementById('guarantee')).getPropertyValue('--sp'),
    sky:op('.guar__sky'), h1:op('.guar__h1'), h2:op('.guar__h2'),
    steps, glosses,
    caps:getComputedStyle(document.querySelector('.guar__h')).textTransform,
    headText:document.querySelector('.guar__h').innerText.replace(/\\n/g,' / '),
    rail:m ? +(+m[1]).toFixed(2) : null,
    rowOneLine: row.height < one.height * 1.5,
    ovf:document.documentElement.scrollWidth - document.documentElement.clientWidth };})()`;

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length = 0;
  await cdp.send('Emulation.setDeviceMetricsOverride', { width:1600, height:1000, deviceScaleFactor:1, mobile:false });
  await cdp.send('Page.navigate', { url: process.argv[2] || 'http://localhost:8899/' }); await sleep(6800);

  const top  = await evaluate(cdp, `Math.round(document.getElementById('guarantee').getBoundingClientRect().top + scrollY)`);
  const span = await evaluate(cdp, `(()=>{const s=document.getElementById('guarantee');return Math.max(1,s.offsetHeight-innerHeight);})()`);

  for (const f of [0, 0.3, 0.5, 0.7, 0.85, 1]) {
    await evaluate(cdp, `scrollTo(0, ${top} + ${span} * ${f})`);
    await sleep(650);
    console.log(f.toFixed(2) + '  ' + JSON.stringify(await evaluate(cdp, P)));
    if (f === 0.5) await shot(cdp, OUT + 'p9-mid.png');
    if (f === 1)   await shot(cdp, OUT + 'p9-end.png');
  }

  // and the centred reviews headline
  await evaluate(cdp, `document.getElementById('proof').scrollIntoView({block:'start',behavior:'instant'})`);
  await sleep(1000);
  console.log('reviews ' + JSON.stringify(await evaluate(cdp, `(()=>{
    const h=document.querySelector('#proof .h').getBoundingClientRect();
    const g=document.querySelector('#get h2').getBoundingClientRect();
    return {proofCentre:Math.round(h.left+h.width/2), offerCentre:Math.round(g.left+g.width/2),
      align:getComputedStyle(document.querySelector('#proof .h')).textAlign};})()`)));
  await shot(cdp, OUT + 'proof-centred.png');

  const errs = cdp.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
  console.log('errors:', errs.length ? errs.map(e => e.params.entry.text.slice(0,130)) : 'none');
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
