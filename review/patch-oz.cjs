// Patch ONLY the "0.34oz e 10ml" line, using the real print artwork.
// The artwork's black/white are remapped onto the frame's own label tones,
// so the patch inherits the photograph's exposure instead of looking pasted.
const fs = require('fs');
const W = 1920, H = 1080;
const AW = +process.argv[2], AH = +process.argv[3];
const T = {
  x0: +(process.argv[4] || 884), x1: +(process.argv[5] || 1022),
  y0: +(process.argv[6] || 841), y1: +(process.argv[7] || 873),
  cx: 985, r: 105
};

const base = Buffer.from(fs.readFileSync('work/base.raw'));
const art  = fs.readFileSync('work/artstrip.raw');
const out  = Buffer.from(base);

// frame's local black level: darkest decile of the label panel around the strip
const darks = [[],[],[]];
for (let y = T.y0 - 26; y < T.y0 - 6; y++)
  for (let x = T.x0; x < T.x1; x++) {
    const i = (y * W + x) * 3;
    darks[0].push(base[i]); darks[1].push(base[i+1]); darks[2].push(base[i+2]);
  }
const K = darks.map(a => { a.sort((p,q)=>p-q); return a[Math.floor(a.length * 0.5)]; });

// frame's white level: brightest decile of the existing oz text
const lights = [[],[],[]];
for (let y = T.y0; y <= T.y1; y++)
  for (let x = T.x0; x < T.x1; x++) {
    const i = (y * W + x) * 3;
    const L = 0.299*base[i] + 0.587*base[i+1] + 0.114*base[i+2];
    if (L > 120) { lights[0].push(base[i]); lights[1].push(base[i+1]); lights[2].push(base[i+2]); }
  }
const Wt = lights[0].length
  ? lights.map(a => { a.sort((p,q)=>p-q); return a[Math.floor(a.length * 0.7)]; })
  : [215, 210, 208];

console.error('panel black:', K.join(','), '  text white:', Wt.join(','));

const thL = Math.asin(Math.max(-1, Math.min(1, (T.x0 - T.cx) / T.r)));
const thR = Math.asin(Math.max(-1, Math.min(1, (T.x1 - T.cx) / T.r)));

for (let y = T.y0; y <= T.y1; y++) {
  const v = (y - T.y0) / (T.y1 - T.y0);
  const ay = Math.min(AH - 1, Math.max(0, Math.round(v * (AH - 1))));
  for (let x = T.x0; x <= T.x1; x++) {
    const s = (x - T.cx) / T.r;
    if (s < -1 || s > 1) continue;
    const th = Math.asin(s);
    const u = (th - thL) / (thR - thL);
    if (u < 0 || u > 1) continue;
    const ax = Math.min(AW - 1, Math.max(0, Math.round(u * (AW - 1))));
    const ai = (ay * AW + ax) * 3;
    const oi = (y * W + x) * 3;

    // remap artwork tone onto the frame's own black and white points
    for (let c = 0; c < 3; c++) {
      const t = art[ai + c] / 255;
      out[oi + c] = Math.max(0, Math.min(255, K[c] + t * (Wt[c] - K[c])));
    }

    // feather the rectangle edges so there is no seam
    const edge = Math.min(x - T.x0, T.x1 - x, y - T.y0, T.y1 - y);
    if (edge < 5) {
      const a = Math.max(0, edge / 5);
      for (let c = 0; c < 3; c++)
        out[oi + c] = base[oi + c] + (out[oi + c] - base[oi + c]) * a;
    }
  }
}
fs.writeFileSync('work/patched.raw', out);
console.log('patched');
