// Rebuild prod-shot.webp from the real product photograph.
//
// The asset in use is a different shot entirely — the box is at a wider angle and its wolf
// mark is malformed into a jagged arrow. This keys the genuine photograph instead.
//
// The key is a flood fill from the borders, NOT a luminance threshold: the background is
// white and so is the type on the box, and a threshold would erase the logo along with the
// backdrop. Flood fill only removes white that is CONNECTED to the edge of the frame.
const { connect, evaluate, sleep } = require('./cdp.cjs');
const fs = require('fs');

const SRC = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/assets-in/box and bottle together no cap.png';
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/site/assets/prod-shot.webp';
const TOL = Number(process.argv[2] || 26);   // how far from white still counts as backdrop
const MAXW = 1000;

const b64 = fs.readFileSync(SRC).toString('base64');

const WORK = `(async () => {
  const img = new Image();
  img.src = 'data:image/png;base64,${b64}';
  await img.decode();

  const scale = Math.min(1, ${MAXW} / img.width);
  const W = Math.round(img.width * scale), H = Math.round(img.height * scale);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d', {willReadFrequently:true});
  x.drawImage(img, 0, 0, W, H);
  const im = x.getImageData(0, 0, W, H);
  const d = im.data;

  const isBg = i => d[i] >= 255-${TOL} && d[i+1] >= 255-${TOL} && d[i+2] >= 255-${TOL};

  // flood fill inward from every border pixel
  const seen = new Uint8Array(W*H);
  const stack = [];
  for (let px = 0; px < W; px++){ stack.push(px); stack.push((H-1)*W + px); }
  for (let py = 0; py < H; py++){ stack.push(py*W); stack.push(py*W + W-1); }
  while (stack.length){
    const p = stack.pop();
    if (seen[p]) continue;
    const i = p*4;
    if (!isBg(i)) continue;
    seen[p] = 1;
    const px = p % W, py = (p - px) / W;
    if (px > 0)   stack.push(p-1);
    if (px < W-1) stack.push(p+1);
    if (py > 0)   stack.push(p-W);
    if (py < H-1) stack.push(p+W);
  }

  // hard alpha from the fill, then one feather pass so the cut edge is not aliased
  const a = new Float32Array(W*H);
  for (let p = 0; p < W*H; p++) a[p] = seen[p] ? 0 : 1;
  const blur = new Float32Array(W*H);
  for (let py = 0; py < H; py++){
    for (let px = 0; px < W; px++){
      const p = py*W+px;
      let s = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++){
        const qx = px+dx, qy = py+dy;
        if (qx<0||qy<0||qx>=W||qy>=H) continue;
        s += a[qy*W+qx]; n++;
      }
      blur[p] = s/n;
    }
  }
  // The reflection is a soft grey mirror that the flood fill stops dead against, leaving a
  // jagged shelf. Find where the product actually ends — the last row carrying real dark
  // pixels — and below that derive alpha from darkness so the mirror fades out the way it
  // does in the photograph. Restricted to that band, because the white type on the box is
  // the same value as the backdrop and a global luminance key would erase it.
  let base = H - 1;
  for (let py = H-1; py >= 0; py--){
    let dark = 0;
    for (let px = 0; px < W; px++){
      const i = (py*W+px)*4;
      if (d[i] < 110 && d[i+1] < 110 && d[i+2] < 110) dark++;
    }
    if (dark > W*0.02){ base = py; break; }
  }

  const FEATHER = 26;
  let kept = 0;
  for (let p = 0; p < W*H; p++){
    let v = Math.min(a[p] === 1 ? 1 : blur[p], 1);
    const py = (p / W) | 0;
    // The mirror in the source is a LIGHT reflection on a white studio floor. Kept at any
    // alpha it reads as a white smear once the shot sits on black, because the pixels
    // themselves are near-white. It is cut, and the page's own dark floor grounds the
    // product instead.
    if (py > base) v = 0;
    // The product's own base is a lit face, so cutting flush leaves a bright line across
    // the bottom. Feather the last few rows so it settles into the dark instead.
    else if (py > base - FEATHER) v *= (base - py) / FEATHER;
    d[p*4+3] = Math.round(v * 255);
    if (v > 0.5) kept++;
  }
  x.putImageData(im, 0, 0);
  return {w:W, h:H, base, keptPct: Math.round(kept/(W*H)*1000)/10,
          data: c.toDataURL('image/webp', 0.92)};
})()`;

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Page.navigate', { url: 'http://localhost:8899/' });
  await sleep(3000);
  const r = await evaluate(cdp, WORK);
  if (!r || !r.data) { console.error('no result'); process.exit(1); }
  const buf = Buffer.from(r.data.split(',')[1], 'base64');
  fs.writeFileSync(OUT, buf);
  console.log('wrote ' + OUT);
  console.log('  ' + r.w + 'x' + r.h + '   kept ' + r.keptPct + '% opaque   ' + (buf.length/1024).toFixed(0) + 'KB   tol=' + TOL);
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
