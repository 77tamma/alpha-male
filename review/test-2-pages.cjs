const { connect, evaluate, shot, setViewport, sleep } = require('./cdp.cjs');
const URL = 'http://localhost:8899/';
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/shots';

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  // ---------- desktop lower sections
  await setViewport(cdp, 1440, 900, false);
  await cdp.send('Page.navigate', { url: URL });
  await sleep(4500);

  const secs = ['#product', '#how', '#scent', '#faq', '#get'];
  for (const id of secs) {
    await evaluate(cdp, `document.querySelector('${id}').scrollIntoView({behavior:'instant',block:'start'})`);
    await sleep(1500);
    await shot(cdp, `${OUT}/desk${id.replace('#','-')}.png`);
  }

  // horizontal overflow check
  const overflow = await evaluate(cdp, `({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    bodyScrollW: document.body.scrollWidth
  })`);
  console.log('DESKTOP OVERFLOW:', JSON.stringify(overflow), overflow.scrollW > overflow.clientW ? '  <-- SIDEWAYS SCROLL BUG' : '  ok');

  // ---------- phone 375x812 with real touch emulation (tests 3 of the 5 gates)
  await setViewport(cdp, 375, 812, true);
  await cdp.send('Page.navigate', { url: URL });
  await sleep(4000);

  const mobile = await evaluate(cdp, `(() => {
    const v = document.getElementById('hero');
    const sh = document.querySelector('.static-hero');
    return {
      staticHeroVisible: getComputedStyle(sh).display !== 'none',
      videoSrc: v.src ? (v.src.startsWith('blob:') ? 'BLOB LOADED (BAD)' : v.src) : 'none (good)',
      posterRequested: !!document.getElementById('poster').style.backgroundImage,
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      coarse: matchMedia('(pointer: coarse)').matches
    };
  })()`);
  console.log('PHONE 375:', JSON.stringify(mobile, null, 2));
  await shot(cdp, OUT + '/phone-01-hero.png');

  for (const id of ['#product', '#how', '#scent', '#faq']) {
    await evaluate(cdp, `document.querySelector('${id}').scrollIntoView({behavior:'instant',block:'start'})`);
    await sleep(1200);
    await shot(cdp, `${OUT}/phone${id.replace('#','-')}.png`);
  }

  // ---------- 375x667 (small phone)
  await setViewport(cdp, 375, 667, true);
  await cdp.send('Page.navigate', { url: URL });
  await sleep(3000);
  const small = await evaluate(cdp, `({scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth})`);
  console.log('PHONE 375x667 OVERFLOW:', JSON.stringify(small), small.scrollW > small.clientW ? ' <-- BUG' : ' ok');
  await shot(cdp, OUT + '/phone-small.png');

  // ---------- 1280x800
  await setViewport(cdp, 1280, 800, false);
  await cdp.send('Page.navigate', { url: URL });
  await sleep(3500);
  const d1280 = await evaluate(cdp, `({scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth})`);
  console.log('1280x800 OVERFLOW:', JSON.stringify(d1280), d1280.scrollW > d1280.clientW ? ' <-- BUG' : ' ok');

  cdp.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
