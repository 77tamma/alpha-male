// Swap the photo-grid CSS for the cross-section layout. Run from the project root.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

const START = '/* Staggered baselines plus a different parallax rate per column.';
const END   = '.mech__shot{margin-bottom:22px}}';
const a = s.indexOf(START), b = s.indexOf(END);
if (a < 0 || b < 0) { console.error('anchors not found'); process.exit(1); }

const NEW = `/* Diagram left, the three beats stacked right. */
.mech__list{display:grid;gap:clamp(24px,2.8vw,40px);align-content:center}
.mech__item{position:relative;padding:24px 0 0;border-top:1px solid var(--panel-line);
  --md:0;
  --m:clamp(0,(var(--p,0) - .20 - var(--md)*.07)*7,1);
  opacity:var(--m);transform:translate3d(calc((1 - var(--m)) * -14px),0,0)}
.mech__item:nth-child(2){--md:1}
.mech__item:nth-child(3){--md:2}
.mech__item:first-child{border-top-color:var(--accent)}

/* ---- the cross-section ---- */
.cut{margin:0;display:flex;align-items:center;justify-content:center}
.cut svg{width:100%;max-width:clamp(190px,20vw,300px);height:auto;overflow:visible}
/* Each stroke is drawn by its own dash offset, timed off the section's scroll progress
   with a per-stroke delay, so the bottle assembles in the order it would be built
   rather than the whole drawing fading in as one object. */
.cut .d{stroke-dasharray:var(--len);
  --k:clamp(0,(var(--p,0) - .10 - var(--dd)*.05)*7,1);
  stroke-dashoffset:calc(var(--len) * (1 - var(--k)))}
.cut .p{--k:clamp(0,(var(--p,0) - .10 - var(--dd)*.05)*7,1);
  opacity:var(--k);transform:scale(var(--k));transform-origin:center;transform-box:fill-box}
.cut__glass{color:var(--text-secondary);opacity:.9}
.cut__oil{color:var(--accent);opacity:.6}
.cut__mol{color:var(--accent)}
.cut__roll{color:var(--text-primary)}

@media (max-width:820px){
  .cut{margin:0 0 34px}
  .cut svg{max-width:210px}
  .mech__item{transform:none}
}
@media (prefers-reduced-motion:reduce){
  .cut .d{stroke-dashoffset:0}
  .cut .p{opacity:1;transform:none}
  .mech__item{opacity:1;transform:none}
}
`;

s = s.slice(0, a) + NEW + s.slice(b + END.length);

// two columns now, not three
s = s.replace('.mech{display:grid;grid-template-columns:1.06fr 1fr 1.24fr;gap:clamp(22px,3.4vw,54px);',
              '.mech{display:grid;grid-template-columns:.82fr 1.18fr;gap:clamp(34px,6vw,96px);align-items:center;');
s = s.replace('@media (max-width:820px){.mech{grid-template-columns:1fr;gap:0;margin-inline:0}}',
              '@media (max-width:820px){.mech{grid-template-columns:1fr;gap:0;margin-inline:0}}');

// the index sits beside the heading, and the block no longer has a figure above it
s = s.replace('.mech__item .mech__n{position:absolute;top:26px;left:0;',
              '.mech__item .mech__n{position:absolute;top:24px;left:0;');

fs.writeFileSync(p, s);
console.log('mech css replaced');
