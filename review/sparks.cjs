// Replace the drawn-bottle figure with the graded couple + the drifting spark field.
// Run from the project root.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- markup: swap the whole <figure class="cut"> ---------- */
const figStart = s.indexOf('      <figure class="cut" aria-hidden="true">');
const figEnd   = s.indexOf('</figure>', figStart);
if (figStart < 0 || figEnd < 0) { console.error('figure anchors not found'); process.exit(1); }

// 15 sparks: position, size, drift, duration and delay all varied so no two share a path
const RNG = (seed => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)(20260816);
let sparks = '';
for (let i = 0; i < 15; i++) {
  const x  = (30 + RNG() * 26).toFixed(1);          // clustered in the gap between them
  const y  = (26 + RNG() * 44).toFixed(1);
  const sz = (2 + RNG() * 3.6).toFixed(1);
  const dx = (RNG() * 34 - 17).toFixed(0);
  const dy = (-52 - RNG() * 58).toFixed(0);
  const du = (7 + RNG() * 7).toFixed(1);
  const de = (RNG() * 9).toFixed(1);
  sparks += `          <i style="--x:${x}%;--y:${y}%;--s:${sz}px;--dx:${dx}px;--dy:${dy}px;--du:${du}s;--de:-${de}s"></i>\n`;
}

const FIG =
`      <figure class="fig">
        <img class="fig__img" src="assets/couple.webp" width="900" height="718"
             loading="lazy" decoding="async"
             alt="A couple standing close, holding each other's gaze">
        <!-- The signal itself. Pheromones are the one thing in this product nobody can
             see, so the section shows them as the thing passing between two people. -->
        <span class="fig__sparks" aria-hidden="true">
${sparks}        </span>
        <span class="fig__glow" aria-hidden="true"></span>
      </figure>`;

s = s.slice(0, figStart) + FIG + s.slice(figEnd + '</figure>'.length);

/* ---------- css: drop the whole .cut block, add the figure block ---------- */
const cssStart = s.indexOf('/* ---- the cross-section ---- */');
const cssEnd   = s.indexOf('@media (max-width:820px){\n  .cut{margin:0 0 34px}');
if (cssStart < 0 || cssEnd < 0) { console.error('css anchors not found'); process.exit(1); }

const CSS =
`/* ---- the couple, and the signal between them ---- */
.fig{position:relative;margin:0}
.fig__img{display:block;width:100%;height:auto;
  --f:clamp(0,(var(--p,0) - .10)*5,1);
  opacity:var(--f);transform:scale(calc(1.04 - .04 * var(--f)));
  transform-origin:60% 40%}

/* a slow warm bloom in the space between them, breathing on its own cycle */
.fig__glow{position:absolute;left:38%;top:36%;width:34%;aspect-ratio:1;pointer-events:none;
  transform:translate(-50%,-50%);border-radius:50%;
  background:radial-gradient(circle,rgba(237,28,36,.30) 0%,rgba(237,28,36,.10) 44%,transparent 72%);
  opacity:calc(clamp(0,(var(--p,0) - .16)*5,1) * 1);
  animation:figGlow 6.5s ease-in-out infinite;mix-blend-mode:screen}
@keyframes figGlow{0%,100%{transform:translate(-50%,-50%) scale(.86);opacity:.55}
                   50%{transform:translate(-50%,-50%) scale(1.1);opacity:1}}

.fig__sparks{position:absolute;inset:0;pointer-events:none;overflow:hidden;
  opacity:clamp(0,(var(--p,0) - .16)*5,1)}
.fig__sparks i{position:absolute;left:var(--x);top:var(--y);
  width:var(--s);height:var(--s);border-radius:50%;
  background:radial-gradient(circle,#FFF1E8 0%,var(--accent) 42%,rgba(237,28,36,0) 72%);
  /* each ember runs its own duration and starts mid-cycle, so the field never pulses
     in unison the way a single shared animation would */
  animation:figSpark var(--du) linear infinite;animation-delay:var(--de);
  will-change:transform,opacity}
@keyframes figSpark{
  0%   {opacity:0;   transform:translate3d(0,0,0) scale(.5)}
  14%  {opacity:.95; transform:translate3d(calc(var(--dx) * .18),calc(var(--dy) * .18),0) scale(1)}
  62%  {opacity:.75; transform:translate3d(calc(var(--dx) * .62),calc(var(--dy) * .62),0) scale(.9)}
  100% {opacity:0;   transform:translate3d(var(--dx),var(--dy),0) scale(.35)}
}

`;

s = s.slice(0, cssStart) + CSS + s.slice(cssEnd);

// the responsive + reduced-motion blocks referenced .cut
s = s.replace('@media (max-width:820px){\n  .cut{margin:0 0 34px}\n  .cut svg{max-width:210px}\n  .mech__item{transform:none}\n}',
              '@media (max-width:820px){\n  .fig{margin:0 0 34px}\n  .mech__item{transform:none}\n}');

fs.writeFileSync(p, s);
console.log('figure swapped, ' + 15 + ' sparks');
