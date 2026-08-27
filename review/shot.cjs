// The black-background product shot goes in UNTOUCHED. No key, no relight, no fake
// scene behind it — it was already lit for a dark room and it carries its own contact
// shadow and floor reflection.
//
// The only work needed is a feathered alpha edge so the frame's black (luminance ~1)
// dissolves into the page canvas (#0A0708, luminance 8) with no visible rectangle,
// and a lift of the photo's black point onto the canvas's, so the two blacks match.
const fs = require('fs');

const W = 1122, H = 1402;
const src = fs.readFileSync('work/blk.raw');            // rgb24

// Crop: keep the product plus breathing room, and all of the reflection.
const X0 = 168, X1 = 946, Y0 = 150, Y1 = 1401;
const CW = X1 - X0 + 1, CH = Y1 - Y0 + 1;

// Canvas black the page will composite against.
const CANVAS = [10, 7, 8];

const FX = Math.round(CW * 0.16);   // side feather
const FT = Math.round(CH * 0.10);   // top feather
const FB = Math.round(CH * 0.14);   // bottom feather, swallows the end of the reflection

const out = Buffer.alloc(CW * CH * 4);
for (let y = 0; y < CH; y++) {
  for (let x = 0; x < CW; x++) {
    const i = ((Y0 + y) * W + (X0 + x)) * 3, o = (y * CW + x) * 4;
    let r = src[i], g = src[i + 1], b = src[i + 2];

    // lift the photo's black onto the canvas's black so the two agree; scale the rest
    // so highlights are untouched
    r = CANVAS[0] + r * (255 - CANVAS[0]) / 255;
    g = CANVAS[1] + g * (255 - CANVAS[1]) / 255;
    b = CANVAS[2] + b * (255 - CANVAS[2]) / 255;

    const fx = Math.min(1, Math.min(x, CW - 1 - x) / FX);
    const fy = Math.min(1, Math.min(y / FT, (CH - 1 - y) / FB));
    // smoothstep both axes: a linear ramp still shows a faint edge against flat black
    const s = t => t * t * (3 - 2 * t);
    const a = s(Math.max(0, Math.min(1, fx))) * s(Math.max(0, Math.min(1, fy)));

    out[o] = r; out[o + 1] = g; out[o + 2] = b;
    out[o + 3] = Math.round(a * 255);
  }
}
fs.writeFileSync('work/shot.raw', out);
fs.writeFileSync('work/shotdims.txt', CW + 'x' + CH);
console.error('shot ' + CW + 'x' + CH + '   feather  side ' + FX + '  top ' + FT + '  bottom ' + FB);
