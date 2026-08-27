// Rebuild #how around the Kling clip: a pinned full-bleed loop with the copy over it,
// in a warm colour break from the black page. Run from the project root.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- markup ---------- */
const S = s.indexOf('<section class="sec sec--bedded" id="how">');
const E = s.indexOf('\n</section>', S) + '\n</section>'.length;
if (S < 0 || E < 0) { console.error('section anchors not found'); process.exit(1); }

const SECTION = `<section class="track track--loud" id="how">
  <div class="pin pin--loud">
    <video class="fill" id="coupleLoop" src="assets/couple-loop.mp4" poster="assets/couple-poster.jpg"
           muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
    <div class="fill__veil" aria-hidden="true"></div>

    <div class="loud">
      <div class="loud__head">
        <p class="eyebrow"><svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true"><path d="M1 1l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>Why Alpha Male?</p>
        <h2 class="h">So what makes Alpha Male different?</h2>
        <p class="formula">
          <span>Premium fragrance</span><i aria-hidden="true">+</i><span>Pheromones</span><i aria-hidden="true">+</i><span>Roll-on application</span>
        </p>
      </div>

      <ol class="beats">
        <li class="beat"><span class="beat__n">01</span><h3>Premium Masculine Scent</h3><p>Smells sophisticated enough to wear anywhere.</p></li>
        <li class="beat"><span class="beat__n">02</span><h3>Premium Masculine Scent</h3><p>Smells sophisticated enough to wear anywhere.</p></li>
        <li class="beat"><span class="beat__n">03</span><h3>Roll-On Control</h3><p>Apply exactly where you want it. No cloud. No wasted spray.</p></li>
      </ol>
    </div>
  </div>
</section>`;

s = s.slice(0, S) + SECTION + s.slice(E);

/* ---------- css: replace everything from the bed block down to the mech n rule ---------- */
const C0 = s.indexOf('/* The loop carried into this section, so the two share one continuous ground.');
const CEND = '  font-variant-numeric:tabular-nums}';
const C1 = s.indexOf(CEND, C0) + CEND.length;
if (C0 < 0 || C1 < 0) { console.error('css anchors not found'); process.exit(1); }

const CSS = `/* =============================== THE LOUD SECTION (colour break) ===============
   The one place the page leaves black. Everything above is cold near-black; this runs
   warm, because the footage is warm and because a page this dark needs one moment that
   changes temperature or it reads as a single undifferentiated slab.
   Architecture is the same held-frame idea as the product module: a tall track, a
   sticky pin, a full-bleed loop underneath, copy over it. */
.track--loud{--warm:#150C09;--warm-deep:#0D0705;position:relative;height:240vh}
.pin--loud{position:sticky;top:0;height:100vh;overflow:hidden;background:var(--warm-deep)}
.fill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  transform:scale(calc(1.02 + var(--p,0) * .05));transform-origin:52% 42%}
/* Legibility comes from a floor that rises under the copy, not from dimming the whole
   frame — the faces stay clean and only the lower half is scrimmed. */
.fill__veil{position:absolute;inset:0;pointer-events:none;background:
  linear-gradient(180deg,var(--warm-deep) 0%,rgba(13,7,5,.30) 14%,rgba(13,7,5,0) 34%,
                  rgba(13,7,5,.72) 62%,rgba(13,7,5,.94) 82%,var(--warm-deep) 100%)}

.loud{position:relative;z-index:2;height:100%;max-width:1800px;margin-inline:auto;
  padding:0 var(--gut) clamp(38px,5vh,68px);
  display:flex;flex-direction:column;justify-content:flex-end;gap:clamp(24px,3.4vh,44px)}
.loud__head{max-width:44ch}
.loud .h{font-size:clamp(26px,3.3vw,46px)}
.loud .eyebrow{color:var(--accent)}

/* the formula terms arrive in sequence — the section's opening beat */
.formula{display:flex;flex-wrap:wrap;align-items:baseline;gap:10px 14px;margin:22px 0 0;
  font-family:var(--mono);font-size:clamp(11px,1.05vw,14px);letter-spacing:.16em;
  text-transform:uppercase;color:var(--text-primary)}
.formula span,.formula i{--fd:0;
  --f:clamp(0,(var(--p,0) - .18 - var(--fd)*.035)*10,1);
  opacity:var(--f);transform:translateY(calc((1 - var(--f)) * 8px));display:inline-block}
.formula i{font-style:normal;color:var(--accent);font-size:1.25em;line-height:1}
.formula>:nth-child(2){--fd:1}.formula>:nth-child(3){--fd:2}
.formula>:nth-child(4){--fd:3}.formula>:nth-child(5){--fd:4}

/* three beats along the foot of the frame, unequal tracks so it is not a grid of cards */
.beats{list-style:none;margin:0;padding:0;display:grid;
  grid-template-columns:1.04fr 1fr 1.18fr;gap:clamp(20px,3vw,52px)}
.beat{position:relative;padding-top:18px;border-top:1px solid rgba(244,239,235,.20);
  --bd:0;
  --b:clamp(0,(var(--p,0) - .30 - var(--bd)*.06)*8,1);
  opacity:var(--b);transform:translate3d(0,calc((1 - var(--b)) * 16px),0)}
.beat:nth-child(2){--bd:1}
.beat:nth-child(3){--bd:2}
.beat:first-child{border-top-color:var(--accent)}
.beat__n{position:absolute;top:18px;left:0;font-family:var(--mono);font-size:11px;
  letter-spacing:.2em;color:var(--accent);font-variant-numeric:tabular-nums}
.beat h3{margin:0 0 8px;padding-left:38px;font-family:var(--display);font-weight:400;
  font-size:clamp(15px,1.35vw,19px);line-height:1.22;letter-spacing:-.005em;
  text-shadow:0 2px 18px rgba(0,0,0,.85)}
.beat p{margin:0;padding-left:38px;color:var(--text-secondary);
  font-size:clamp(13px,1.05vw,15px);line-height:1.55;
  text-shadow:0 2px 16px rgba(0,0,0,.85)}

@media (max-width:900px){
  .track--loud{height:auto}
  .pin--loud{position:static;height:auto;min-height:0}
  .fill{position:relative;height:58vw;max-height:420px;transform:none}
  .fill__veil{display:none}
  .loud{height:auto;padding:clamp(34px,7vw,52px) var(--gut) clamp(46px,9vw,72px);
    background:var(--warm-deep)}
  .beats{grid-template-columns:1fr;gap:0}
  .beat{padding:20px 0;--b:1;opacity:1;transform:none}
  .beat__n{top:20px}
  .beat:last-child{border-bottom:1px solid rgba(244,239,235,.20)}
  .formula span,.formula i{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){
  .fill{transform:none}
  .formula span,.formula i,.beat{opacity:1;transform:none}
}`;

s = s.slice(0, C0) + CSS + s.slice(C1);

/* ---------- js: swap the smoke bed for the couple loop ---------- */
s = s.replace(/var bed2=document\.getElementById\('smokeBed2'\);/, "var bed2=document.getElementById('coupleLoop');");

fs.writeFileSync(p, s);
console.log('loud section rebuilt');
