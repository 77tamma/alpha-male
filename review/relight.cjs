// Relight the studio product shot so it belongs in the dark smoke scene.
//
// A cutout fails not because its edges are wrong but because its LIGHT is wrong: this
// pair was shot flat and bright against white, and the scene it now sits in is dark
// with red light raking from the sides. Four passes fix that:
//   1. drop stray keying specks (connected components below a size floor)
//   2. grade the body down and crush the base, so it sits in the scene's exposure
//   3. rake a red rim along the silhouette, matching the scene's side light
//   4. bake a contact shadow + falling reflection, so it is standing on something
const fs = require('fs');

const W = 1122, H = 1402;
const src = fs.readFileSync('work/prod-keyed.raw');       // RGBA from the flood-fill key
const N = W * H;

/* ---------- 1. despeckle ---------- */
const label = new Int32Array(N).fill(-1);
const sizes = [];
for (let s = 0; s < N; s++) {
  if (src[s * 4 + 3] < 24 || label[s] !== -1) continue;
  const id = sizes.length; let n = 0; const st = [s]; label[s] = id;
  while (st.length) {
    const i = st.pop(); n++;
    const x = i % W, y = (i / W) | 0;
    const nb = [];
    if (x > 0) nb.push(i - 1); if (x < W - 1) nb.push(i + 1);
    if (y > 0) nb.push(i - W); if (y < H - 1) nb.push(i + W);
    for (const j of nb) if (label[j] === -1 && src[j * 4 + 3] >= 24) { label[j] = id; st.push(j); }
  }
  sizes.push(n);
}
const MINPX = 2000;
let killed = 0;
const alpha = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const id = label[i];
  const keep = id !== -1 && sizes[id] >= MINPX;
  if (id !== -1 && !keep) killed++;
  alpha[i] = keep ? src[i * 4 + 3] / 255 : 0;
}
console.error('components: ' + sizes.length + '   specks removed: ' + killed + 'px');

/* ---------- crop to the surviving product ---------- */
let x0 = W, x1 = 0, y0 = H, y1 = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (alpha[y * W + x] > 0.09) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
}
console.error('bbox ' + x0 + ',' + y0 + ' -> ' + x1 + ',' + y1);

/* ---------- distance from silhouette edge, for the rim ---------- */
const INF = 1e9;
const dist = new Float32Array(N).fill(INF);
for (let i = 0; i < N; i++) if (alpha[i] <= 0.5) dist[i] = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {          // forward
  const i = y * W + x; if (dist[i] === 0) continue;
  let d = dist[i];
  if (x > 0) d = Math.min(d, dist[i - 1] + 1);
  if (y > 0) d = Math.min(d, dist[i - W] + 1);
  if (x > 0 && y > 0) d = Math.min(d, dist[i - W - 1] + 1.414);
  dist[i] = d;
}
for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) { // backward
  const i = y * W + x; if (dist[i] === 0) continue;
  let d = dist[i];
  if (x < W - 1) d = Math.min(d, dist[i + 1] + 1);
  if (y < H - 1) d = Math.min(d, dist[i + W] + 1);
  if (x < W - 1 && y < H - 1) d = Math.min(d, dist[i + W + 1] + 1.414);
  dist[i] = d;
}

/* ---------- 2+3. grade, crush the base, rake the rim ---------- */
const CW = x1 - x0 + 1, CH = y1 - y0 + 1;
const out = Buffer.alloc(CW * CH * 4);
const RIM = 9;            // px the red rim reaches inward
const cx = (x0 + x1) / 2;

for (let y = 0; y < CH; y++) {
  const sy = y0 + y;
  // the base sits in shadow: a short crush over the bottom eighth, nothing above it
  const fromBase = 1 - y / (CH - 1);
  const baseCrush = fromBase < 0.12 ? 0.42 + 0.58 * (fromBase / 0.12) : 1;
  for (let x = 0; x < CW; x++) {
    const sx = x0 + x, si = sy * W + sx, o = (y * CW + x) * 4;
    const a = alpha[si];
    if (a <= 0) continue;

    let r = src[si * 4], g = src[si * 4 + 1], b = src[si * 4 + 2];

    // global grade: studio-bright -> scene exposure
    const EXP = 0.80;
    r *= EXP; g *= EXP * 0.985; b *= EXP * 0.985;   // a touch warm, the scene is red-lit
    r *= baseCrush; g *= baseCrush; b *= baseCrush;

    // red rim from the sides, strongest on whichever flank faces outward
    const d = dist[si];
    if (d < RIM) {
      const t = Math.pow(1 - d / RIM, 1.7);
      const side = Math.min(1, Math.abs(sx - cx) / (CW * 0.42));   // flanks, not the face
      const k = t * side * 116;
      r = Math.min(255, r + k);
      g = Math.min(255, g + k * 0.10);
      b = Math.min(255, b + k * 0.13);
    }
    out[o] = r; out[o + 1] = g; out[o + 2] = b;
    out[o + 3] = Math.round(a * 255);
  }
}
fs.writeFileSync('work/unit-lit.raw', out);
fs.writeFileSync('work/unitdims.txt', CW + 'x' + CH);
console.error('relit unit ' + CW + 'x' + CH);
