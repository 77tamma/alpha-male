// Grade the lifestyle shot into the page's world.
//
// Keying is not an option here: the backdrop gradients from luminance 185 at the top to
// 6 at the bottom right, so no threshold separates it from the subjects. Instead the
// whole frame is re-mapped onto the brand's own tonal range — near-black shadows, a red
// lift through the midtones, restrained warm highlights — which removes the lighting
// mismatch by construction rather than patching it. Then the edges feather to nothing so
// it dissolves into the canvas the way the product shot does.
const fs = require('fs');

const W = 1254, H = 1254;
const src = fs.readFileSync('work/fc.raw');

const SHADOW = [8, 5, 6];        // canvas-deep, near enough
const MID    = [78, 24, 28];     // where the red lives
const HIGH   = [240, 230, 228];  // restrained, not blown

function mix(a, b, t) { return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]; }

// Levels, not a plain S-curve. The studio backdrop sits at luminance ~0.72 and the lit
// skin at ~0.88; a symmetric curve leaves both in the midtones and the whole frame reads
// pink. Pulling the black point up to 0.34 drops the backdrop into the shadows while the
// speculars survive, which is what separates the subjects from their background.
const BLACK = 0.34, WHITE = 0.94, GAMMA = 1.55;
function curve(t) {
  t = (t - BLACK) / (WHITE - BLACK);
  t = Math.max(0, Math.min(1, t));
  return Math.pow(t, GAMMA);
}

const CX = W / 2, CY = H / 2;
const out = Buffer.alloc(W * H * 4);

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3, o = (y * W + x) * 4;
    const L = (0.2126 * src[i] + 0.7152 * src[i + 1] + 0.0722 * src[i + 2]) / 255;
    const t = curve(L);

    // two-stop ramp so the red sits in the midtones and does not tint the whole frame
    const c = t < 0.5 ? mix(SHADOW, MID, t / 0.5) : mix(MID, HIGH, (t - 0.5) / 0.5);

    // keep a trace of the original chroma so skin still reads as skin
    const mx = Math.max(src[i], src[i+1], src[i+2]), mn = Math.min(src[i], src[i+1], src[i+2]);
    const sat = (mx - mn) / 255;
    const keep = 0.16 * sat;
    let r = c[0] * (1 - keep) + src[i]     * keep;
    let g = c[1] * (1 - keep) + src[i + 1] * keep;
    let b = c[2] * (1 - keep) + src[i + 2] * keep;

    // elliptical vignette to transparency, so the frame has no edge
    const dx = (x - CX) / (W * 0.52), dy = (y - CY) / (H * 0.54);
    const d = Math.sqrt(dx * dx + dy * dy);
    let a = 1 - (d - 0.50) / 0.42;
    a = Math.max(0, Math.min(1, a));
    a = a * a * (3 - 2 * a);

    out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = Math.round(a * 255);
  }
}
fs.writeFileSync('work/fc-graded.raw', out);
console.log('graded ' + W + 'x' + H);
