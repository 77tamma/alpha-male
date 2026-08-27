// Worst-frame legibility for the scrub hero.
//
// Measured on the real composited page: scroll to a position, hide the band's own
// glyphs, screenshot exactly the rect each text element occupies, and find the
// lightest pixel the reader's eye has to resolve that text against.
//
// Three things this gets right that the naive version did not:
//   1. Clip PER ELEMENT. Not per column (a grid track is wider than its ragged text)
//      and not a union rect (its corners cover space no glyph occupies). Either one
//      flags failures for pixels no letter ever sits on.
//   2. Use each element's OWN computed colour. Scoring a white headline against the
//      secondary grey is a fabricated failure.
//   3. Hide foreground artwork too — the logo is an <img>, and left visible it gets
//      sampled as if it were background, reporting a bogus 1.14:1 on pure white.
const { connect, evaluate, sleep } = require('./cdp.cjs');
const fs = require('fs');
const URL = 'http://localhost:8899/';
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/shots';
const FLOOR = 3.5;
const HIDE = 'h1,h2,.sub,.kicker,.spec,.btn,.settle-logo';

function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);}
function ratio(a,b){const x=lum(a),y=lum(b),hi=Math.max(x,y),lo=Math.min(x,y);return (hi+0.05)/(lo+0.05);}

async function lightestPixel(cdp, b64) {
  return evaluate(cdp, `(async () => {
    const img = new Image();
    img.src = 'data:image/png;base64,${b64}';
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const x = c.getContext('2d');
    x.drawImage(img,0,0);
    const d = x.getImageData(0,0,c.width,c.height).data;
    const f = v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); };
    let worst = -1, px = null;
    for (let i=0;i<d.length;i+=4){
      const L = 0.2126*f(d[i]) + 0.7152*f(d[i+1]) + 0.0722*f(d[i+2]);
      if (L > worst){ worst = L; px = [d[i],d[i+1],d[i+2]]; }
    }
    return px;
  })()`);
}

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width:1440, height:900, deviceScaleFactor:1, mobile:false });
  await cdp.send('Page.navigate', { url: URL });
  await sleep(5000);

  const range = await evaluate(cdp, `document.getElementById('hero-sec').offsetHeight - window.innerHeight`);
  const bandRanges = await evaluate(cdp, `[...document.querySelectorAll('.band')].map(b=>({a:+b.dataset.a,b:+b.dataset.b}))`);

  console.log('Worst-frame legibility, measured on the real composited page with glyphs hidden.');
  console.log(`Every text element clipped and scored against its own colour. Floor is ${FLOOR}:1.\n`);

  let allPass = true;
  for (let i = 0; i < bandRanges.length; i++) {
    const { a, b } = bandRanges[i];
    const samples = [0.15, 0.4, 0.65, 0.9, 0.99].map(f => a + (b-a)*f);
    const per = new Map();   // tag -> { colour, worstPx, worstL, at, size }

    for (const p of samples) {
      await evaluate(cdp, `window.scrollTo(0, ${Math.round(range * p)})`);
      await sleep(950);

      // Skip positions where the band has already faded out. A band at 4% opacity is
      // not text anyone reads, and scoring it manufactures failures at every band edge.
      const bandOpacity = await evaluate(cdp, `+getComputedStyle(document.querySelectorAll('.band')[${i}]).opacity`);
      if (bandOpacity < 0.6) continue;

      // rect + own colour for every text element in this band. The logo is artwork,
      // not text, so it is hidden during capture but never scored.
      const els = await evaluate(cdp, `(() => {
        const PAD = 6;
        return [...document.querySelectorAll('.band')[${i}]
                  .querySelectorAll('h1,h2,.sub,.kicker,.btn,.spec__step,.spec__line')]
          .map(e => {
            const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
            const m = cs.color.match(/[\\d.]+/g).slice(0,3).map(Number);
            return { tag: e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).split(' ')[0] : ''),
                     colour: m, size: Math.round(parseFloat(cs.fontSize)),
                     x: Math.round(r.x + scrollX - PAD), y: Math.round(r.y + scrollY - PAD),
                     w: Math.round(r.width) + PAD*2,     h: Math.round(r.height) + PAD*2 };
          })
          .filter(o => o.w > 8 && o.h > 8);
      })()`);

      await evaluate(cdp, `document.querySelectorAll('.band')[${i}].querySelectorAll('${HIDE}').forEach(e=>e.style.visibility='hidden')`);
      await sleep(260);
      const shots = [];
      for (const e of els) {
        shots.push(await cdp.send('Page.captureScreenshot', {
          format: 'png',
          clip: { x: e.x, y: e.y, width: Math.max(8, e.w), height: Math.max(8, e.h), scale: 1 },
          captureBeyondViewport: false
        }));
      }
      await evaluate(cdp, `document.querySelectorAll('.band')[${i}].querySelectorAll('${HIDE}').forEach(e=>e.style.visibility='')`);

      for (let c = 0; c < shots.length; c++) {
        const px = await lightestPixel(cdp, shots[c].data);
        const L = lum(px);
        const prev = per.get(els[c].tag);
        if (!prev || L > prev.worstL) {
          per.set(els[c].tag, { colour: els[c].colour, size: els[c].size, worstPx: px, worstL: L, at: p });
          fs.writeFileSync(`${OUT}/legib-b${i}-${els[c].tag.replace(/[^a-z0-9]/gi,'_')}.png`, Buffer.from(shots[c].data,'base64'));
        }
      }
    }

    let bandWorst = Infinity, bandLine = '';
    for (const [tag, v] of per) {
      const r = ratio(v.colour, v.worstPx);
      if (r < bandWorst) {
        bandWorst = r;
        bandLine = `<${tag}> ${v.size}px rgb(${v.colour.join(',')}) over rgb(${v.worstPx.join(',')}) at p=${v.at.toFixed(2)}`;
      }
    }
    const pass = bandWorst >= FLOOR;
    if (!pass) allPass = false;
    console.log(`  band ${i}: worst ${bandWorst.toFixed(2)}:1  ${bandLine}   ${pass?'PASS':'FAIL'}`);
  }
  console.log('\n' + (allPass ? 'ALL BANDS PASS' : 'SOME BANDS FAIL, scrim needs deepening'));
  cdp.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
