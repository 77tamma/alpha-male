const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: 'http://localhost:8899/' }); await sleep(5500);

  // top seam: reviews -> red
  await evaluate(cdp, `(()=>{const r=document.getElementById('guarantee').getBoundingClientRect();
    scrollBy(0, r.top - 430);})()`);
  await sleep(1600); await shot(cdp, `${OUT}/seam-top.png`);

  // bottom seam: red -> the buy block
  await evaluate(cdp, `(()=>{const r=document.getElementById('guarantee').getBoundingClientRect();
    scrollBy(0, r.bottom - 470);})()`);
  await sleep(1600); await shot(cdp, `${OUT}/seam-bot.png`);
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
