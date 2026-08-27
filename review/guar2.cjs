const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 60)); process.exit(1); } s = s.replace(a, b); };

/* ---------- 1. a light sweep across the field ---------- */
rep(`  <div class="guar__bed" aria-hidden="true">
    <span class="guar__ring guar__ring--a"></span>`,
`  <span class="guar__sweep" aria-hidden="true"></span>
  <div class="guar__bed" aria-hidden="true">
    <span class="guar__ring guar__ring--a"></span>`);

rep(`.guar__bed{position:absolute;inset:0;pointer-events:none;z-index:1}`,
`/* a highlight travelling across the field, the way light crosses a painted panel.
   It is the piece that keeps a flat colour from reading as a flat colour. */
.guar__sweep{position:absolute;top:-30%;bottom:-30%;left:-60%;width:52%;z-index:1;
  pointer-events:none;transform:rotate(14deg);
  background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.11) 46%,
                             rgba(255,255,255,.17) 52%,rgba(255,255,255,.09) 58%,rgba(255,255,255,0) 100%);
  animation:guarSweep 8.5s cubic-bezier(.5,0,.5,1) infinite}
@keyframes guarSweep{0%{left:-60%}62%,100%{left:150%}}

.guar__bed{position:absolute;inset:0;pointer-events:none;z-index:1}`);

/* ---------- 2. the copy arrives, rather than being simply present ---------- */
rep(`.guar__kick{margin:0 0 18px;font-family:var(--mono);font-size:clamp(12px,1.15vw,16px);
  letter-spacing:.26em;text-transform:uppercase;color:#fff;opacity:.92}
.guar__h{font-family:var(--display);font-weight:400;margin:0;color:#fff;
  font-size:clamp(40px,7vw,116px);line-height:.98;letter-spacing:-.03em}
.guar__p{color:#fff;opacity:.94;max-width:44ch;margin:clamp(20px,2.6vw,34px) auto 0;
  font-size:clamp(17px,1.75vw,26px);line-height:1.45}`,
`/* every line rises on entry, staggered, so the red does not simply appear fully formed */
.guar__kick,.guar__h,.guar__p,.guar__row li{
  opacity:0;transform:translate3d(0,22px,0);
  transition:opacity .8s var(--ease),transform .9s cubic-bezier(.22,.61,.36,1)}
.guar.in .guar__kick,.guar.in .guar__h,.guar.in .guar__p,.guar.in .guar__row li{
  opacity:1;transform:none}
.guar.in .guar__h{transition-delay:.08s}
.guar.in .guar__p{transition-delay:.18s}
.guar.in .guar__row li:nth-child(1){transition-delay:.30s}
.guar.in .guar__row li:nth-child(2){transition-delay:.38s}
.guar.in .guar__row li:nth-child(3){transition-delay:.46s}

.guar__kick{margin:0 0 18px;font-family:var(--mono);font-size:clamp(13px,1.2vw,17px);
  letter-spacing:.26em;text-transform:uppercase;color:#fff}
.guar.in .guar__kick{opacity:.94}
.guar__h{font-family:var(--display);font-weight:400;margin:0;color:#fff;
  font-size:clamp(40px,7vw,116px);line-height:.98;letter-spacing:-.03em}
.guar__p{color:#fff;max-width:44ch;margin:clamp(20px,2.6vw,34px) auto 0;
  font-size:clamp(18px,1.85vw,28px);line-height:1.45}
.guar.in .guar__p{opacity:.95}`);

/* ---------- 3. the row: baselines line up even when a heading wraps ---------- */
rep(`.guar__row li{padding-top:18px;border-top:2px solid rgba(255,255,255,.45)}
.guar__row b{display:block;font-family:var(--display);font-weight:400;color:#fff;
  font-size:clamp(19px,2.1vw,32px);line-height:1.08;margin-bottom:8px;letter-spacing:-.01em}
.guar__row span{display:block;color:#fff;opacity:.9;
  font-size:clamp(14px,1.25vw,19px);line-height:1.4}`,
`.guar__row li{padding-top:18px;border-top:2px solid rgba(255,255,255,.5)}
/* "No awkward breakup" wraps to two lines and the other two do not, so the headings are
   given the height of two lines and the sublines sit on a common baseline regardless */
.guar__row b{display:block;font-family:var(--display);font-weight:400;color:#fff;
  font-size:clamp(19px,2.1vw,32px);line-height:1.12;min-height:2.24em;
  margin-bottom:10px;letter-spacing:-.01em}
.guar__row span{display:block;color:#fff;opacity:.92;
  font-size:clamp(15px,1.4vw,21px);line-height:1.4}`);

/* ---------- 4. mobile + reduced motion keep up ---------- */
rep(`  .guar__row li{padding:16px 0;border-top:2px solid rgba(255,255,255,.4)}
  .guar__num{font-size:76vw}`,
`  .guar__row li{padding:16px 0;border-top:2px solid rgba(255,255,255,.45)}
  .guar__row b{min-height:0;margin-bottom:6px}
  .guar__num{font-size:76vw}
  .guar__sweep{width:80%}`);

rep(`  .guar__num,.guar__ring{animation:none}
  .guar__num{opacity:.075}
  .guar__ring{opacity:.16;transform:scale(2)}
  .guar .gd{transition:none;stroke-dashoffset:0}`,
`  .guar__num,.guar__ring,.guar__sweep{animation:none}
  .guar__num{opacity:.075}
  .guar__sweep{display:none}
  .guar__ring{opacity:.16;transform:scale(2)}
  .guar .gd{transition:none;stroke-dashoffset:0}
  .guar__kick,.guar__h,.guar__p,.guar__row li{opacity:1;transform:none;transition:none}`);

fs.writeFileSync(p, s);
console.log('guarantee refined; net ' + (s.length - t0) + ' bytes');
