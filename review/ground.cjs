// Ground the relit unit: cut the studio floor reflection off at the true base, then
// give it back a contact shadow and a wet-floor reflection that belong to THIS scene.
// The hero ends on the bottle standing on a wet reflective floor; the product module
// has to read as the same room.
const fs = require('fs');

const W = 1122, H = 1402;
const src = fs.readFileSync('work/prod-keyed.raw');
const N = W * H;

/* alpha with specks already dropped — recompute cheaply by size-filtering again */
const label = new Int32Array(N).fill(-1); const sizes = [];
for (let s = 0; s < N; s++) {
  if (src[s * 4 + 3] < 24 || label[s] !== -1) continue;
  const id = sizes.length; let n = 0; const st = [s]; label[s] = id;
  while (st.length) {
    const i = st.pop(); n++;
    const x = i % W, y = (i / W) | 0; const nb = [];
    if (x > 0) nb.push(i - 1); if (x < W - 1) nb.push(i + 1);
    if (y > 0) nb.push(i - W); if (y < H - 1) nb.push(i + W);
    for (const j of nb) if (label[j] === -1 && src[j * 4 + 3] >= 24) { label[j] = id; st.push(j); }
  }
  sizes.push(n);
}
const alpha = new Float32Array(N);
for (let i = 0; i < N; i++) { const id = label[i]; alpha[i] = (id !== -1 && sizes[id] >= 2000) ? src[i*4+3]/255 : 0; }

const X0 = 240, X1 = 865, Y0 = 226, BASE = 1211;   // BASE measured: below it is studio reflection
const PW = X1 - X0 + 1, PH = BASE - Y0 + 1;
const REF = Math.round(PH * 0.30);                 // how far the reflection falls
const PAD = 26;                                    // room for the shadow to spread sideways
const CW = PW + PAD * 2, CH = PH + REF;

const INF = 1e9;
const dist = new Float32Array(N).fill(INF);
for (let i = 0; i < N; i++) if (alpha[i] <= 0.5) dist[i] = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i=y*W+x; if(!dist[i])continue;
  let d=dist[i]; if(x>0)d=Math.min(d,dist[i-1]+1); if(y>0)d=Math.min(d,dist[i-W]+1);
  if(x>0&&y>0)d=Math.min(d,dist[i-W-1]+1.414); dist[i]=d; }
for (let y = H-1; y >= 0; y--) for (let x = W-1; x >= 0; x--) { const i=y*W+x; if(!dist[i])continue;
  let d=dist[i]; if(x<W-1)d=Math.min(d,dist[i+1]+1); if(y<H-1)d=Math.min(d,dist[i+W]+1);
  if(x<W-1&&y<H-1)d=Math.min(d,dist[i+W+1]+1.414); dist[i]=d; }

const out = Buffer.alloc(CW * CH * 4);
const RIM = 9, cx = (X0 + X1) / 2;

function litPixel(sx, sy) {
  const si = sy * W + sx, a = alpha[si];
  if (a <= 0) return null;
  let r = src[si*4], g = src[si*4+1], b = src[si*4+2];
  const fromBase = 1 - (sy - Y0) / (PH - 1);
  const crush = fromBase < 0.12 ? 0.42 + 0.58 * (fromBase / 0.12) : 1;
  const EXP = 0.80;
  r *= EXP * crush; g *= EXP * 0.985 * crush; b *= EXP * 0.985 * crush;
  const d = dist[si];
  if (d < RIM) {
    const t = Math.pow(1 - d / RIM, 1.7);
    const side = Math.min(1, Math.abs(sx - cx) / (PW * 0.42));
    const k = t * side * 116;
    r = Math.min(255, r + k); g = Math.min(255, g + k * 0.10); b = Math.min(255, b + k * 0.13);
  }
  return [r, g, b, a];
}

/* ---- the product ---- */
for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) {
  const p = litPixel(X0 + x, Y0 + y); if (!p) continue;
  const o = (y * CW + (x + PAD)) * 4;
  out[o] = p[0]; out[o+1] = p[1]; out[o+2] = p[2]; out[o+3] = Math.round(p[3] * 255);
}

/* ---- the reflection: mirrored, dimmed, blurred and fading out ---- */
for (let y = 0; y < REF; y++) {
  const sy = BASE - 1 - Math.round(y * 1.06);           // slight vertical squash
  if (sy < Y0) break;
  const fade = Math.pow(1 - y / REF, 2.1) * 0.30;       // wet floor, not a mirror
  const spread = 1 + y * 0.035;                        // smears wider as it falls
  for (let x = 0; x < PW; x++) {
    const sx = Math.round(X0 + (x - PW/2) / spread + PW/2);
    if (sx < X0 || sx > X1) continue;
    const p = litPixel(sx, sy); if (!p) continue;
    const o = ((PH + y) * CW + (x + PAD)) * 4;
    out[o] = p[0] * 0.85; out[o+1] = p[1] * 0.72; out[o+2] = p[2] * 0.72;
    out[o+3] = Math.round(p[3] * fade * 255);
  }
}

/* ---- contact shadow: hugs the base, darkest right under the footprint ---- */
const foot = new Float32Array(PW);
for (let x = 0; x < PW; x++) {
  let hit = 0;
  for (let y = BASE - 26; y < BASE; y++) if (alpha[y * W + (X0 + x)] > 0.4) hit++;
  foot[x] = hit / 26;
}
const SH = Math.round(PH * 0.075);
for (let y = 0; y < SH; y++) {
  const fy = 1 - y / SH;
  for (let x = -PAD; x < PW + PAD; x++) {
    // sample the footprint with a widening blur so the shadow softens as it spreads
    const rad = 5 + y * 1.5;
    let f = 0, n = 0;
    for (let k = -rad; k <= rad; k += 2) { const xx = Math.round(x + k); if (xx<0||xx>=PW) {n++;continue;} f += foot[xx]; n++; }
    f /= Math.max(1, n);
    const a = f * Math.pow(fy, 1.5) * 0.80;
    if (a <= 0.004) continue;
    const oy = PH - Math.round(SH * 0.28) + y;
    if (oy < 0 || oy >= CH) continue;
    const o = (oy * CW + (x + PAD)) * 4;
    const prev = out[o + 3] / 255;
    const na = a + prev * (1 - a);
    // composite the shadow UNDER whatever is already there
    out[o]   = Math.round((out[o]   * prev * (1 - a) + 6 * a) / Math.max(0.0001, na));
    out[o+1] = Math.round((out[o+1] * prev * (1 - a) + 3 * a) / Math.max(0.0001, na));
    out[o+2] = Math.round((out[o+2] * prev * (1 - a) + 4 * a) / Math.max(0.0001, na));
    out[o+3] = Math.round(na * 255);
  }
}

fs.writeFileSync('work/unit-ground.raw', out);
fs.writeFileSync('work/grounddims.txt', CW + 'x' + CH);
console.error('grounded unit ' + CW + 'x' + CH + '  (product ' + PW + 'x' + PH + ', reflection ' + REF + ', shadow ' + SH + ')');
