const { connect, evaluate, sleep } = require('./cdp.cjs');
const fs = require('fs');
const PDF = 'file:///C:/Users/DadWorkPC/Documents/Claude%20Design/AM%20Pheromone%20Cologne/assets-in/0721%20Alphamale%20Cologne-Original%20225%20x%201875%20in%20FOR%20PRINT.pdf';
(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable');
  // 2.25 x 1.88 in at very high scale -> a big clean raster of the vector label
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 900, height: 760, deviceScaleFactor: 5, mobile: false });
  await cdp.send('Page.navigate', { url: PDF + '#toolbar=0&navpanes=0&scrollbar=0&view=Fit' });
  await sleep(6000);
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync('label-raw.png', Buffer.from(r.data, 'base64'));
  console.log('captured');
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
