// Minimal Chrome DevTools Protocol driver. Node 22+ has a global WebSocket, zero deps.
const fs = require('fs');

function connect() {
  return fetch('http://127.0.0.1:9222/json/list')
    .then(r => r.json())
    .then(list => {
      const t = list.find(x => x.type === 'page');
      if (!t) throw new Error('no page target');
      return new Promise((res, rej) => {
        const ws = new WebSocket(t.webSocketDebuggerUrl);
        let id = 0;
        const waiters = new Map();
        const events = [];
        ws.addEventListener('open', () => res(api));
        ws.addEventListener('error', rej);
        ws.addEventListener('message', ev => {
          const m = JSON.parse(ev.data);
          if (m.id && waiters.has(m.id)) {
            const { resolve, reject } = waiters.get(m.id);
            waiters.delete(m.id);
            m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
          } else if (m.method) events.push(m);
        });
        const api = {
          send(method, params = {}) {
            const mid = ++id;
            return new Promise((resolve, reject) => {
              waiters.set(mid, { resolve, reject });
              ws.send(JSON.stringify({ id: mid, method, params }));
              setTimeout(() => {
                if (waiters.has(mid)) { waiters.delete(mid); reject(new Error('timeout ' + method)); }
              }, 30000);
            });
          },
          events,
          close() { ws.close(); }
        };
      });
    });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function evaluate(cdp, expr) {
  const r = await cdp.send('Runtime.evaluate', {
    expression: expr, returnByValue: true, awaitPromise: true
  });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' :: ' + (r.exceptionDetails.exception && r.exceptionDetails.exception.description));
  return r.result.value;
}

async function shot(cdp, file, opts = {}) {
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', ...opts });
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
  return file;
}

async function setViewport(cdp, width, height, mobile = false) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile
  });
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: 5 });
}

module.exports = { connect, evaluate, shot, setViewport, sleep };
