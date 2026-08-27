// The plate was sent right and the copy was sent right with it. Give the smoke the right
// third of the frame to itself, and hold the copy to a measure that does not run into it.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* the orphan caption sat between the figure rule and the first list rule, over the
   brightest smoke, in the dimmest colour on the page. It becomes the figure's own gloss,
   which is the pattern the two items below it already use. */
rep(`      <div class="guar__fig">
        <b class="guar__n">365</b>
        <span class="guar__unit">Days to<br>change your mind</span>
      </div>
      <p class="guar__cap">Take your time.</p>
      <ul class="guar__list">`,
`      <div class="guar__fig">
        <b class="guar__n">365</b>
        <span class="guar__unit"><b>Days</b><span>Take your time.</span></span>
      </div>
      <ul class="guar__list">`);

rep(`.guar__in{position:relative;z-index:2;display:grid;
  grid-template-columns:minmax(0,1.02fr) minmax(0,.86fr);
  gap:clamp(30px,5vw,88px);align-items:center}`,
`/* Held to the left of the wrap, not centred in it: the left edge still lines up with every
   other section, and the right third of the frame belongs to the smoke rather than to a
   hairline running through it. */
.guar__in{position:relative;z-index:2;display:grid;
  grid-template-columns:minmax(0,1fr) minmax(0,.62fr);
  gap:clamp(28px,3.6vw,64px);align-items:center;
  max-width:1080px;margin-left:0;margin-right:auto}`);

/* the plate now peaks beyond the copy instead of underneath it */
rep(`  -webkit-mask-image:radial-gradient(88% 104% at 79% 50%,#000 0%,#000 34%,rgba(0,0,0,.55) 62%,rgba(0,0,0,0) 88%);
          mask-image:radial-gradient(88% 104% at 79% 50%,#000 0%,#000 34%,rgba(0,0,0,.55) 62%,rgba(0,0,0,0) 88%)}
.guar__vid.on{opacity:.62}`,
`  -webkit-mask-image:radial-gradient(64% 116% at 84% 50%,#000 0%,#000 30%,rgba(0,0,0,.42) 64%,rgba(0,0,0,0) 92%);
          mask-image:radial-gradient(64% 116% at 84% 50%,#000 0%,#000 30%,rgba(0,0,0,.42) 64%,rgba(0,0,0,0) 92%)}
.guar__vid.on{opacity:.66}`);

rep(`.guar__veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:
  linear-gradient(90deg,rgba(10,7,8,.94) 0%,rgba(10,7,8,.72) 26%,rgba(10,7,8,.16) 54%,rgba(10,7,8,0) 76%),
  linear-gradient(180deg,var(--canvas) 0%,rgba(10,7,8,0) 16%,rgba(10,7,8,0) 84%,var(--canvas) 100%)}`,
`.guar__veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:
  linear-gradient(90deg,rgba(10,7,8,.96) 0%,rgba(10,7,8,.9) 34%,rgba(10,7,8,.62) 56%,rgba(10,7,8,.12) 74%,rgba(10,7,8,0) 86%),
  linear-gradient(180deg,var(--canvas) 0%,rgba(10,7,8,0) 18%,rgba(10,7,8,0) 82%,var(--canvas) 100%)}`);

/* the figure's gloss adopts the list's label-over-gloss pattern */
rep(`.guar__unit{font-family:var(--mono);font-size:clamp(10px,.86vw,12.5px);letter-spacing:.22em;
  text-transform:uppercase;color:var(--text-secondary);line-height:1.5}
.guar__cap{margin:12px 0 0;font-family:var(--mono);font-size:clamp(10px,.84vw,12px);
  letter-spacing:.2em;text-transform:uppercase;color:var(--text-dim)}`,
`.guar__unit{display:block;padding-bottom:2px}
.guar__unit>b{display:block;font-family:var(--mono);font-weight:500;
  font-size:clamp(10.5px,.9vw,13px);letter-spacing:.24em;text-transform:uppercase;
  color:var(--text-primary);margin-bottom:5px}
.guar__unit>span{display:block;font-size:clamp(13px,1.05vw,15.5px);line-height:1.4;
  color:var(--text-secondary)}`);

/* the rules stop at the copy, not at the column */
rep(`.guar__list{list-style:none;margin:clamp(20px,2.4vw,32px) 0 0;padding:0;display:grid;
  gap:clamp(13px,1.5vw,20px)}`,
`.guar__list{list-style:none;margin:clamp(18px,2.2vw,28px) 0 0;padding:0;display:grid;
  gap:clamp(12px,1.4vw,18px);max-width:400px}`);
rep(`.guar__fig{display:flex;align-items:baseline;gap:clamp(12px,1.4vw,22px);width:max-content;
  max-width:100%;padding-bottom:14px;border-bottom:1px solid var(--accent)}`,
`.guar__fig{display:flex;align-items:baseline;gap:clamp(12px,1.4vw,22px);width:max-content;
  max-width:100%;padding-bottom:13px;border-bottom:1px solid var(--accent)}`);

rep('.guar.in .guar__cap{transition-delay:.1s}\n', '');

fs.writeFileSync(p, s);
console.log('guarantee re-balanced; net ' + (s.length - t0) + ' bytes');
