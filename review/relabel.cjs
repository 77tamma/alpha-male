// Composite the real vector label onto every frame of the video's resting tail.
// Pure raw-pixel maths: ffmpeg decodes, we warp, ffmpeg re-encodes.
const fs = require('fs');

const W = 1920, H = 1080;
const LW = +process.argv[2], LH = +process.argv[3];   // label artwork size
const NF = +process.argv[4];                          // number of tail frames
const RAMP = +process.argv[5] || 10;                  // frames to fade the label in over

// measured off the frame: the black panel runs y 347..846, not 330..880
const P = { cx:985, r:105, x0:898, x1:1072, y0:346, y1:875, shade:0.46, amb:0.50 };

const label = fs.readFileSync('work/label.raw');
const frames = fs.readFileSync('work/tail.raw');
const blurs  = fs.readFileSync('work/tailblur.raw');   // heavy blur = base lighting
const mids   = fs.readFileSync('work/tailmid.raw');    // medium blur = broad specular, no glyphs
const FSZ = W * H * 3;
const out = Buffer.alloc(FSZ * NF);

const thL = Math.asin(Math.max(-1, Math.min(1, (P.x0 - P.cx) / P.r)));
const thR = Math.asin(Math.max(-1, Math.min(1, (P.x1 - P.cx) / P.r)));

for (let f = 0; f < NF; f++) {
  const fo = f * FSZ;
  frames.copy(out, fo, fo, fo + FSZ);

  // global fade-in so the swap lands while the shot is still settling
  const gA = Math.min(1, (f + 1) / RAMP);

  // reference lighting level for this frame
  let ref = 0, n = 0;
  for (let y = P.y0; y <= P.y1; y += 2)
    for (let x = P.x0; x <= P.x1; x += 2) {
      const i = fo + (y * W + x) * 3;
      ref += 0.299*blurs[i] + 0.587*blurs[i+1] + 0.114*blurs[i+2];
      n++;
    }
  ref = Math.max(1, ref / n);

  for (let y = P.y0; y <= P.y1; y++) {
    const v = (y - P.y0) / (P.y1 - P.y0);
    const ly = Math.min(LH - 1, Math.max(0, Math.round(v * (LH - 1))));
    for (let x = P.x0; x <= P.x1; x++) {
      const s = (x - P.cx) / P.r;
      if (s < -1 || s > 1) continue;
      const th = Math.asin(s);
      const u = (th - thL) / (thR - thL);
      if (u < 0 || u > 1) continue;

      const lx = Math.min(LW - 1, Math.max(0, Math.round(u * (LW - 1))));
      const li = (ly * LW + lx) * 3;
      const oi = fo + (y * W + x) * 3;

      const bl = 0.299*blurs[oi] + 0.587*blurs[oi+1] + 0.114*blurs[oi+2];
      const md = 0.299*mids[oi]  + 0.587*mids[oi+1]  + 0.114*mids[oi+2];

      let light = P.amb + (1 - P.amb) * (bl / ref);
      // real glass curvature
      light *= 1 - P.shade * (1 - Math.cos(th));
      // broad specular / rim structure from the frame itself. Medium blur keeps
      // the highlight bands but destroys glyph-scale detail, so no text ghosts.
      const detail = Math.max(0.55, Math.min(2.2, md / Math.max(1, bl)));
      light *= detail;

      const tint = blurs[oi] / Math.max(1, bl);
      let R = Math.min(255, label[li]   * light * (0.85 + 0.15 * tint));
      let G = Math.min(255, label[li+1] * light);
      let B = Math.min(255, label[li+2] * light);

      let a = gA;
      const edge = Math.min(x - P.x0, P.x1 - x, y - P.y0, P.y1 - y);
      if (edge < 3) a *= Math.max(0, edge / 3);

      out[oi]   = frames[oi]   + (R - frames[oi])   * a;
      out[oi+1] = frames[oi+1] + (G - frames[oi+1]) * a;
      out[oi+2] = frames[oi+2] + (B - frames[oi+2]) * a;
    }
  }
  if (f % 8 === 0) process.stderr.write('frame ' + f + '/' + NF + '\n');
}
fs.writeFileSync('work/tailout.raw', out);
console.log('composited ' + NF + ' frames');
