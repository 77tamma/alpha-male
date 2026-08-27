const { connect, evaluate, sleep } = require('./cdp.cjs');
(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Network.enable');
  for (const [label,w,h,mob] of [['PHONE 375',375,812,true],['DESKTOP 1440',1440,900,false]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:mob});
    await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:mob,maxTouchPoints:5});
    cdp.events.length = 0;
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'});
    await sleep(7000);
    await evaluate(cdp,`window.scrollTo(0,document.body.scrollHeight)`);
    await sleep(2500);
    const got = {};
    for (const e of cdp.events) {
      if (e.method === 'Network.responseReceived') {
        const u = e.params.response.url;
        if (u.includes('localhost')) got[u.split('/').pop()] = 0;
      }
      if (e.method === 'Network.loadingFinished') {
        // map by requestId is fiddly; use encodedDataLength totals instead
      }
    }
    const files = Object.keys(got).filter(f=>f);
    console.log(`${label}: requested -> ${files.join(', ')}`);
  }
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
