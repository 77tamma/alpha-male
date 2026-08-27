// Back to the full-bleed film with the copy inside the frame, but at roughly a third of
// the height it had, and with the type rebuilt for reading against moving footage.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- markup ---------- */
const S = s.indexOf('<section class="sec loud-sec" id="how">');
const E = s.indexOf('\n</section>', S) + '\n</section>'.length;
if (S < 0 || E < 0) { console.error('section anchors not found'); process.exit(1); }

const SECTION = `<section class="track track--loud" id="how">
  <div class="pin pin--loud">
    <video class="fill" id="coupleLoop" src="assets/couple-loop.mp4" poster="assets/couple-poster.jpg"
           muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
    <div class="fill__veil" aria-hidden="true"></div>

    <div class="loud">
      <div class="loud__copy">
        <p class="eyebrow"><svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true"><path d="M1 1l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>Why Alpha Male?</p>
        <h2 class="h">So what makes Alpha Male different?</h2>
        <p class="formula">
          <span>Premium fragrance</span><i aria-hidden="true">+</i><span>Pheromones</span><i aria-hidden="true">+</i><span>Roll-on application</span>
        </p>
      </div>

      <ol class="beats">
        <li class="beat"><span class="beat__n">01</span><h3>Premium Masculine Scent</h3><p>Smells sophisticated enough to wear anywhere.</p></li>
        <li class="beat"><span class="beat__n">02</span><h3>Premium Masculine Scent</h3><p>Smells sophisticated enough to wear anywhere.</p></li>
        <li class="beat"><span class="beat__n">03</span><h3>Roll-On Control</h3><p>Apply exactly where you want it. No cloud, no wasted spray.</p></li>
      </ol>
    </div>
  </div>
</section>`;

s = s.slice(0, S) + SECTION + s.slice(E);

/* ---------- css ---------- */
const C0 = s.indexOf('/* =============================== THE LOUD SECTION (colour break) ===============');
const CEND = '@media (prefers-reduced-motion:reduce){\n  .fill{transform:none;opacity:1}\n  .formula span,.formula i,.beat{opacity:1;transform:none}\n}';
const C1 = s.indexOf(CEND, C0) + CEND.length;
if (C0 < 0 || C1 < 0) { console.error('css anchors not found'); process.exit(1); }

const CSS = `/* =============================== THE LOUD SECTION (colour break) ===============
   The one place the page leaves black, and the only one where copy sits inside moving
   footage. Everything above is cold near-black; this runs warm, because a page this dark
   needs one change of temperature or it reads as a single slab.
   The frame is deliberately shorter than the viewport: a full-height pin held the screen
   hostage for too long, and 68vh still reads as cinematic without claiming the scroll. */
.track--loud{--warm-deep:#0D0705;position:relative;height:150vh}
.pin--loud{position:sticky;top:calc((100vh - var(--filmH)) / 2);--filmH:min(68vh,620px);
  height:var(--filmH);overflow:hidden;background:var(--warm-deep)}
.fill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:52% 26%;
  transform:scale(calc(1.02 + var(--p,0) * .05));transform-origin:52% 34%}

/* Reading over film needs a floor, not a dimmer: the faces stay clean at the top and the
   scrim only builds where the type actually sits. Measured against the brightest frame
   of the loop, not the poster. */
.fill__veil{position:absolute;inset:0;pointer-events:none;background:
  linear-gradient(180deg,rgba(13,7,5,.55) 0%,rgba(13,7,5,.12) 16%,rgba(13,7,5,.30) 38%,
                  rgba(13,7,5,.86) 62%,rgba(13,7,5,.96) 84%,rgba(13,7,5,.98) 100%),
  linear-gradient(90deg,rgba(13,7,5,.72) 0%,rgba(13,7,5,.30) 34%,rgba(13,7,5,0) 62%)}

.loud{position:relative;z-index:2;height:100%;max-width:1800px;margin-inline:auto;
  padding:0 var(--gut) clamp(26px,3.4vh,44px);
  display:flex;flex-direction:column;justify-content:flex-end;gap:clamp(16px,2.2vh,28px)}
.loud__copy{max-width:38ch}
/* heavier and tighter than the page's other headings: thin type over a moving picture
   loses its edges, so this one carries more weight and a shadow that tracks it */
.loud .h{font-size:clamp(24px,2.8vw,38px);line-height:1.06;
  text-shadow:0 2px 30px rgba(0,0,0,.92),0 1px 4px rgba(0,0,0,.8)}
.loud .eyebrow{color:var(--accent);text-shadow:0 1px 12px rgba(0,0,0,.9)}

.formula{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 12px;margin:16px 0 0;
  font-family:var(--mono);font-size:clamp(10px,.92vw,12.5px);letter-spacing:.18em;
  text-transform:uppercase;color:var(--text-primary);
  text-shadow:0 1px 14px rgba(0,0,0,.92)}
.formula span,.formula i{--fd:0;
  --f:clamp(0,(var(--p,0) - .16 - var(--fd)*.035)*10,1);
  opacity:var(--f);transform:translateY(calc((1 - var(--f)) * 8px));display:inline-block}
.formula i{font-style:normal;color:var(--accent);font-size:1.3em;line-height:1}
.formula>:nth-child(2){--fd:1}.formula>:nth-child(3){--fd:2}
.formula>:nth-child(4){--fd:3}.formula>:nth-child(5){--fd:4}

.beats{list-style:none;margin:0;padding:0;display:grid;
  grid-template-columns:1.04fr 1fr 1.16fr;gap:clamp(18px,2.6vw,44px)}
.beat{position:relative;padding-top:14px;border-top:1px solid rgba(244,239,235,.26);
  --bd:0;
  --b:clamp(0,(var(--p,0) - .28 - var(--bd)*.055)*8,1);
  opacity:var(--b);transform:translate3d(0,calc((1 - var(--b)) * 14px),0)}
.beat:nth-child(2){--bd:1}
.beat:nth-child(3){--bd:2}
.beat:first-child{border-top-color:var(--accent)}
.beat__n{position:absolute;top:14px;left:0;font-family:var(--mono);font-size:10.5px;
  letter-spacing:.2em;color:var(--accent);font-variant-numeric:tabular-nums;
  text-shadow:0 1px 10px rgba(0,0,0,.9)}
.beat h3{margin:0 0 5px;padding-left:34px;font-family:var(--display);font-weight:400;
  font-size:clamp(14px,1.18vw,17px);line-height:1.2;letter-spacing:-.005em;
  text-shadow:0 2px 20px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.85)}
/* lifted off --text-secondary: grey body copy that reads fine on a flat panel goes soft
   the moment it sits on film */
.beat p{margin:0;padding-left:34px;color:#DED4D6;
  font-size:clamp(12.5px,.98vw,14px);line-height:1.5;
  text-shadow:0 2px 18px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.85)}

@media (max-width:900px){
  .track--loud{height:auto}
  .pin--loud{position:static;height:auto;--filmH:auto}
  .fill{position:relative;height:64vw;max-height:360px;transform:none;object-position:52% 24%}
  .fill__veil{display:none}
  .loud{height:auto;padding:clamp(28px,6vw,42px) var(--gut) clamp(40px,8vw,60px);
    background:var(--warm-deep);gap:26px}
  .loud__copy{max-width:none}
  .beats{grid-template-columns:1fr;gap:0}
  .beat{padding:18px 0;opacity:1;transform:none}
  .beat__n{top:18px}
  .beat:last-child{border-bottom:1px solid rgba(244,239,235,.26)}
  .formula span,.formula i{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){
  .fill{transform:none}
  .formula span,.formula i,.beat{opacity:1;transform:none}
}`;

s = s.slice(0, C0) + CSS + s.slice(C1);

fs.writeFileSync(p, s);
console.log('full-bleed restored at 68vh, copy inside the frame');
