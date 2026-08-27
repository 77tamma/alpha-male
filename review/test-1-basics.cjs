const { connect, evaluate, shot, setViewport, sleep } = require('./cdp.cjs');
const URL = 'http://localhost:8899/';
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/shots';
require('fs').mkdirSync(OUT, { recursive: true });

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  await cdp.send('Network.enable');

  const consoleErrors = [];
  cdp.events.length = 0;

  await setViewport(cdp, 1440, 900, false);
  await cdp.send('Page.navigate', { url: URL });
  await sleep(5000);

  // ---- console errors
  for (const e of cdp.events) {
    if (e.method === 'Log.entryAdded' && e.params.entry.level === 'error') {
      consoleErrors.push(e.params.entry.text);
    }
    if (e.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(e.params.exceptionDetails.text);
    }
  }
  console.log('CONSOLE ERRORS:', consoleErrors.length ? consoleErrors : 'none');

  // ---- did the video actually load and is the scrub armed?
  const state = await evaluate(cdp, `(() => {
    const v = document.getElementById('hero');
    const stage = document.getElementById('stage');
    return {
      videoSrcType: v.src ? (v.src.startsWith('blob:') ? 'blob' : v.src.slice(0,40)) : 'NONE',
      duration: v.duration || 0,
      readyState: v.readyState,
      videoReadyClass: stage.classList.contains('video-ready'),
      posterSet: !!document.getElementById('poster').style.backgroundImage,
      docHeight: document.documentElement.scrollHeight,
      heroHeight: document.getElementById('hero-sec').offsetHeight,
      vh: window.innerHeight
    };
  })()`);
  console.log('LOAD STATE:', JSON.stringify(state, null, 2));

  await shot(cdp, OUT + '/01-top-1440.png');

  // ---- scrub at several positions: does currentTime track and do bands respond?
  const range = state.heroHeight - state.vh;
  const probes = [0, 0.15, 0.35, 0.55, 0.8, 1.0];
  const rows = [];
  for (const p of probes) {
    await evaluate(cdp, `window.scrollTo(0, ${Math.round(range * p)})`);
    await sleep(900);
    const r = await evaluate(cdp, `(() => {
      const v = document.getElementById('hero');
      const bands = [...document.querySelectorAll('.band')];
      return {
        y: Math.round(scrollY),
        t: +(v.currentTime || 0).toFixed(3),
        op: bands.map(b => +(+getComputedStyle(b).opacity).toFixed(2)),
        k:  bands.map(b => +(+getComputedStyle(b).getPropertyValue('--k') || 0).toFixed(2))
      };
    })()`);
    rows.push({ p, ...r });
  }
  console.log('\nSCRUB PROBE (progress, scrollY, video currentTime, band opacities, band --k):');
  for (const r of rows) {
    console.log(`  p=${r.p.toFixed(2)}  y=${String(r.y).padStart(5)}  t=${r.t.toFixed(2)}  op=[${r.op.join(', ')}]  k=[${r.k.join(', ')}]`);
  }

  // settle screenshot
  await evaluate(cdp, `window.scrollTo(0, ${Math.round(range)})`);
  await sleep(1200);
  await shot(cdp, OUT + '/02-settle-1440.png');

  cdp.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
