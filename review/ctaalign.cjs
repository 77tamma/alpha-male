// Drop the "opening shortly" notice, and sit the CTA in the middle column so it is exactly
// as wide as the Best Value card above it.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };
const all = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS(all): ' + a.slice(0, 80)); process.exit(1); } s = s.split(a).join(b); };

/* ---------- 1. the notice goes, in both boxes ---------- */
all('\n    <p class="buy__soon" hidden></p>', '');
rep(`.buy__soon{margin:12px 0 0;font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--text-dim)}\n`, '');
rep('.buy--compact .buy__soon{margin-top:9px;font-size:9.5px}\n', '');
rep(`    var cta  = box.querySelector('.cta');
    var soon = box.querySelector('.buy__soon');`,
    `    var cta  = box.querySelector('.cta');`);
rep(`    if (!live && soon) { soon.textContent = 'Online store opening shortly.'; soon.hidden = false; }\n`, '');

/* ---------- 2. one grid for the whole box, so the CTA can occupy a real column ----------
   The card row and the box share a column template and a gap, so "the middle column" means
   the same thing to both and the button lands exactly under the Best Value card. */
rep('.buy{--sel:0}',
`.buy{--sel:0;--cgap:clamp(10px,1.2vw,18px);
  display:grid;grid-template-columns:.9fr 1.24fr .9fr;gap:0 var(--cgap)}
.buy > *{grid-column:1/-1}`);

rep(`.buy__opts{display:grid;grid-template-columns:.9fr 1.24fr .9fr;
  gap:clamp(10px,1.2vw,18px);align-items:stretch;margin:0}
@media (max-width:760px){.buy__opts{grid-template-columns:1fr;max-width:430px;margin-inline:auto}}`,
`.buy__opts{display:grid;grid-template-columns:.9fr 1.24fr .9fr;
  gap:var(--cgap);align-items:stretch;margin:0}
@media (max-width:760px){
  .buy{grid-template-columns:1fr}
  .buy__opts{grid-template-columns:1fr;max-width:430px;margin-inline:auto}
  .cta{grid-column:1;max-width:430px;margin-inline:auto}
}`);

/* the button fills its column rather than hugging its label */
rep(`.cta{position:relative;display:flex;align-items:center;justify-content:center;gap:13px;
  margin:clamp(22px,2.6vw,32px) auto 0;width:max-content;max-width:100%;
  padding:clamp(16px,1.55vw,21px) clamp(30px,3.6vw,54px);border-radius:4px;`,
`.cta{grid-column:2;position:relative;display:flex;align-items:center;justify-content:center;
  gap:13px;margin:clamp(22px,2.6vw,32px) 0 0;
  padding:clamp(16px,1.55vw,21px) clamp(16px,1.6vw,26px);border-radius:4px;`);
/* ---------- 3. the compact box: same rule, its own gap ---------- */
rep(`.buy--compact{margin-top:clamp(24px,3.4vh,42px)}
.buy--compact .buy__opts{gap:clamp(8px,.9vw,13px)}`,
`.buy--compact{margin-top:clamp(24px,3.4vh,42px);--cgap:clamp(8px,.9vw,13px)}`);

rep(`/* the module column is left-aligned type, so the button aligns to it rather than floating
   centre under the middle card, which read as belonging to that card */
.buy--compact .cta{margin-left:0;margin-right:auto;margin-top:clamp(18px,2.2vh,26px);
  padding:13px clamp(24px,2.6vw,38px);font-size:clamp(14px,1.2vw,17px);gap:10px}`,
`.buy--compact .cta{margin-top:clamp(18px,2.2vh,26px);
  padding:13px clamp(12px,1.2vw,20px);font-size:clamp(13px,1.1vw,16px);gap:9px}`);

rep(`@media (max-width:1180px){
  .buy--compact .buy__opts{grid-template-columns:1fr;gap:8px;max-width:none}`,
`@media (max-width:1180px){
  .buy--compact{grid-template-columns:1fr}
  .buy--compact .cta{grid-column:1;max-width:430px;margin-inline:0}
  .buy--compact .buy__opts{grid-template-columns:1fr;gap:8px;max-width:none}`);

fs.writeFileSync(p, s);
console.log('cta aligned to the middle column; net ' + (s.length - t0) + ' bytes');
