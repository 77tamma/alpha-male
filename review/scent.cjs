// Replace the press-and-hold drop with the cap-off film, notes beside it.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

const S = s.indexOf('<section class="sec" id="scent">');
const E = s.indexOf('\n</section>', S) + '\n</section>'.length;
if (S < 0 || E < 0) { console.error('scent anchors not found'); process.exit(1); }

const SECTION = `<section class="sec" id="scent">
  <div class="wrap scent">
    <div class="stg scent__copy">
      <p class="eyebrow"><svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true"><path d="M1 1l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>The scent</p>
      <h2 class="h">Open it and it opens.</h2>
      <p class="lede">Bergamot and pepper first, then the heart comes through on skin heat. One drop per point, two points, and that is the dose.</p>
      <ul class="notes">
        <li><span class="lab">Opening</span><span class="val">Bergamot, Pepper</span></li>
        <li><span class="lab">Heart</span><span class="val">Sichuan Pepper, Lavender, Vetiver, Patchouli, Geranium, Elemi</span></li>
        <li><span class="lab">Base</span><span class="val">Ambroxan, Cedar, Labdanum</span></li>
      </ul>
    </div>

    <figure class="scent__film">
      <video class="scent__vid" id="scentLoop" src="assets/scent-loop.mp4" poster="assets/scent-poster.jpg"
             muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
    </figure>
  </div>
</section>`;

s = s.slice(0, S) + SECTION + s.slice(E);

/* ---------- css: drop the dropbox block, add the film ---------- */
const C0 = s.indexOf('/* ------------------------------------------------------- the drop */');
let C1 = -1;
if (C0 >= 0) {
  // the drop block ends where the notes list styling begins
  C1 = s.indexOf('.notes{', C0);
}
const CSS = `/* ------------------------------------------------- the scent film */
.scent{display:grid;grid-template-columns:.86fr 1.14fr;gap:clamp(30px,4.4vw,72px);align-items:center;
  --bleed:max(0px,(min(1800px,100vw - var(--gut)*2) - 100%) / 2);
  margin-inline:calc(-1 * var(--bleed))}
.scent__copy{max-width:46ch}
.scent__film{position:relative;margin:0;overflow:hidden;border-radius:3px;background:#000;
  aspect-ratio:1440/804;box-shadow:0 0 0 1px rgba(244,239,235,.08)}
.scent__vid{display:block;width:100%;height:100%;object-fit:cover}
@media (max-width:900px){
  .scent{grid-template-columns:1fr;gap:28px;margin-inline:0}
  .scent__copy{max-width:none}
  .scent__film{order:-1}
}
`;

if (C0 >= 0 && C1 > C0) {
  s = s.slice(0, C0) + CSS + s.slice(C1);
} else {
  // fall back: append before the notes rule
  const n = s.indexOf('.notes{');
  if (n < 0) { console.error('cannot place css'); process.exit(1); }
  s = s.slice(0, n) + CSS + s.slice(n);
}

fs.writeFileSync(p, s);
console.log('scent section rebuilt around the film');
