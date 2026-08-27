// The plate was invisible because the scrim that protects the copy was at full strength
// from the first frame — before any copy existed to protect. Split the two jobs: the seams
// are always sealed, and the reading scrim fades UP as the words arrive.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* ---------- markup: a second layer, so the two jobs can move independently ---------- */
rep('    <div class="guar__veil" aria-hidden="true"></div>',
    '    <div class="guar__scrim" aria-hidden="true"></div>\n    <div class="guar__veil" aria-hidden="true"></div>');

/* ---------- the plate is lifted: the source frame was graded near-black on purpose ---------- */
rep(`.guar__plate{position:absolute;inset:-16%;
  background:url('assets/guar-plate.jpg') 70% 50%/cover no-repeat}`,
`.guar__plate{position:absolute;inset:-16%;
  background:url('assets/guar-plate.jpg') 70% 50%/cover no-repeat;
  /* the frame was generated deliberately low-key; at 1:1 it reads as an empty black
     rectangle once it is behind anything at all */
  filter:brightness(2.1) contrast(1.06)}`);

/* ---------- veil keeps only the seams; the reading scrim becomes its own layer ---------- */
rep(`.guar__veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:
  radial-gradient(76% 104% at 50% 50%,rgba(6,4,5,.95) 0%,rgba(6,4,5,.92) 52%,
                  rgba(6,4,5,.6) 78%,rgba(6,4,5,.12) 100%),
  linear-gradient(180deg,var(--canvas) 0%,rgba(6,4,5,.42) 7%,rgba(6,4,5,.06) 20%,
                  rgba(6,4,5,.06) 80%,rgba(6,4,5,.42) 93%,var(--canvas) 100%)}`,
`/* the seams, always sealed — this is what keeps the cloud from bleeding into the black
   sections either side */
.guar__veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:
  linear-gradient(180deg,var(--canvas) 0%,rgba(6,4,5,.5) 7%,rgba(6,4,5,.08) 20%,
                  rgba(6,4,5,.08) 80%,rgba(6,4,5,.5) 93%,var(--canvas) 100%)}
/* and the reading ground, which arrives with the words rather than before them. At the top
   of the track it is barely there, so the opening frame is pure weather. */
.guar__scrim{position:absolute;inset:0;z-index:1;pointer-events:none;
  opacity:clamp(.06,calc(var(--sp,0) * 3.4),1);
  background:radial-gradient(78% 108% at 50% 50%,rgba(6,4,5,.97) 0%,rgba(6,4,5,.95) 54%,
                  rgba(6,4,5,.62) 80%,rgba(6,4,5,.1) 100%)}`);

rep('  .guar__sky{opacity:1;-webkit-mask-image:none;mask-image:none}',
    '  .guar__sky{opacity:1;-webkit-mask-image:none;mask-image:none}\n  .guar__scrim{opacity:1}');

fs.writeFileSync(p, s);
console.log('scrim split from veil, plate lifted; net ' + (s.length - t0) + ' bytes');
