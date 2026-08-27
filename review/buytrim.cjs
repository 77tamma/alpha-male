// The module's buy box was carrying the closing offer's full furniture in half the width.
// Strip it back: no trust strip there, a CTA that hugs its label, and room above the cards.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* ---------- 1. the trust strip leaves the module ----------
   It says the same four things the closing offer says, 1500px further up the page, in a
   column half as wide. Repeating reassurance does not double it. */
const M0 = s.indexOf('<div class="buy buy--compact" id="buyModule">');
const T0 = s.indexOf('<ul class="trust">', M0);
const T1 = s.indexOf('</ul>', T0) + 5;
if (M0 < 0 || T0 < 0 || T1 < 4) { console.error('module trust strip not found'); process.exit(1); }
// make sure we are cutting the module's copy, not the closing one
if (T0 > s.indexOf('<section class="close" id="get">')) { console.error('wrong trust strip'); process.exit(1); }
s = s.slice(0, T0) + s.slice(T1);

/* ---------- 2. the CTA hugs its label ----------
   A 920px bar under a three-word label reads as a banner, not a button. */
rep(`.cta{position:relative;display:flex;align-items:center;justify-content:center;gap:14px;
  margin:clamp(22px,2.6vw,34px) auto 0;max-width:920px;
  padding:clamp(18px,1.8vw,24px) 28px;border-radius:4px;`,
`.cta{position:relative;display:flex;align-items:center;justify-content:center;gap:13px;
  margin:clamp(22px,2.6vw,32px) auto 0;width:max-content;max-width:100%;
  padding:clamp(16px,1.55vw,21px) clamp(30px,3.6vw,54px);border-radius:4px;`);

/* ---------- 3. the module's box: room above it, and a tighter build ---------- */
rep(`.buy--compact .opt{padding:26px 10px 14px;gap:4px}`,
`/* the cards were sitting against the lede above them */
.buy--compact{margin-top:clamp(24px,3.4vh,42px)}
.buy--compact .buy__opts{gap:clamp(8px,.9vw,13px)}
.buy--compact .opt{padding:24px 10px 13px;gap:3px}`);
rep(`.buy--compact .cta{margin-top:20px;padding:15px 20px;font-size:clamp(15px,1.35vw,19px);gap:11px}`,
`.buy--compact .cta{margin-top:clamp(18px,2.2vh,26px);
  padding:13px clamp(24px,2.6vw,38px);font-size:clamp(14px,1.2vw,17px);gap:10px}
.buy--compact .cta__i{width:16px;height:16px}
.buy--compact .cta__a{width:21px}
.buy--compact .buy__soon{margin-top:9px;font-size:9.5px}`);

/* ---------- 4. the closing box keeps its strip but breathes better ---------- */
rep(`.trust{list-style:none;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;
  gap:0;margin:clamp(20px,2.4vw,30px) 0 0;padding:0}`,
`.trust{list-style:none;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;
  gap:0;margin:clamp(24px,2.8vw,36px) 0 0;padding:0}`);

fs.writeFileSync(p, s);
console.log('buy box trimmed; net ' + (s.length - t0) + ' bytes');
