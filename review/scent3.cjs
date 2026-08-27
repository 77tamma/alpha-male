// The Scent, rebuilt to the hero's settle-band grammar: copy flanking the product on
// both sides, mono accent labels over hairlines, everything arriving off the same scroll
// that unscrews the cap. Frame height brought down to match the modules above.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- markup ---------- */
const S = s.indexOf('<section class="track track--scent" id="scent">');
const E = s.indexOf('\n</section>', S) + '\n</section>'.length;
if (S < 0 || E < 0) { console.error('scent anchors not found'); process.exit(1); }

const SECTION = `<section class="track track--scent" id="scent">
  <div class="pin pin--scent">
    <video class="scent__vid" id="scentScrub" poster="assets/scent-poster.jpg"
           muted playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
    <div class="scent__veil" aria-hidden="true"></div>

    <div class="scent__ui">
      <p class="eyebrow scent__brow"><svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true"><path d="M1 1l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>The scent</p>
      <h2 class="h scent__head">What does confidence smell like?</h2>

      <div class="scent__cols">
        <ol class="sn sn--l">
          <li><span class="sn__k">Opening &#8212; the first impression</span><span class="sn__v">Bergamot + Pepper</span><span class="sn__d">Fresh. Sharp. Immediately noticeable.</span></li>
          <li><span class="sn__k">Heart &#8212; the attraction</span><span class="sn__v">Lavender + Vetiver + Patchouli</span><span class="sn__d">Warm. Masculine. Sophisticated.</span></li>
          <li><span class="sn__k">Base &#8212; what lingers</span><span class="sn__v">Ambroxan + Cedar + Labdanum</span><span class="sn__d">Deep. Smooth. Hard to forget.</span></li>
        </ol>

        <ol class="sn sn--r">
          <li><span class="sn__k">Roll it on</span><span class="sn__d">A few smooth passes across your pulse points are all it takes.</span></li>
          <li><span class="sn__k">Hit the right spots</span><span class="sn__d">Wrists. Neck. Behind the ears. Where warmth helps your scent come alive.</span></li>
          <li><span class="sn__k">Go make an impression</span><span class="sn__d">Walk out smelling sharp, feeling confident, and ready to be remembered.</span></li>
        </ol>
      </div>
    </div>
  </div>
</section>`;

s = s.slice(0, S) + SECTION + s.slice(E);

/* ---------- css ---------- */
const C0 = s.indexOf('/* ------------------------------------------------- the scent film');
const C1 = s.indexOf('.notes{', C0);
if (C0 < 0 || C1 < 0) { console.error('css anchors not found'); process.exit(1); }

const CSS = `/* ------------------------------------------------- the scent film
   The hero's settle band, applied to a scrubbed film: copy flanks the product on both
   sides, the centre lane stays clear for the bottle, and every line arrives off the same
   scroll that unscrews the cap. Frame height matches the modules above rather than
   claiming a full viewport. */
.track--scent{--warm-deep:#070405;--fh:min(clamp(500px,44vw,940px),78vh);
  position:relative;height:250vh;background:var(--warm-deep)}
.pin--scent{position:sticky;top:calc((100vh - var(--fh)) / 2);height:var(--fh);
  overflow:hidden;background:#000}
.scent__vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:50% 40%}
/* two-sided scrim, as on the settle band: both flanks are seated, the centre lane where
   the bottle stands is left alone */
.scent__veil{position:absolute;inset:0;pointer-events:none;background:
  linear-gradient(90deg,rgba(7,4,5,.88) 0%,rgba(7,4,5,.60) 22%,rgba(7,4,5,0) 40%),
  linear-gradient(270deg,rgba(7,4,5,.88) 0%,rgba(7,4,5,.60) 22%,rgba(7,4,5,0) 40%),
  linear-gradient(180deg,rgba(7,4,5,.80) 0%,rgba(7,4,5,.20) 22%,rgba(7,4,5,0) 46%,
                  rgba(7,4,5,.34) 84%,rgba(7,4,5,.62) 100%)}

.scent__ui{position:absolute;inset:0;z-index:2;max-width:1800px;margin-inline:auto;
  padding:clamp(58px,7vh,86px) var(--gut) clamp(24px,3.4vh,46px);
  display:flex;flex-direction:column}
.scent__brow{margin:0;color:var(--accent);text-shadow:0 1px 12px rgba(0,0,0,.9)}
.scent__head{margin:0;max-width:22ch;font-size:clamp(22px,2.5vw,40px);line-height:1.06;
  letter-spacing:-.015em;text-shadow:0 2px 30px rgba(0,0,0,.94),0 1px 4px rgba(0,0,0,.85);
  --hs:clamp(0,var(--sp,0)*7,1);
  opacity:var(--hs);transform:translate3d(0,calc((1 - var(--hs)) * 14px),0)}

/* the centre column is empty on purpose: it is the bottle's lane */
.scent__cols{flex:1;display:grid;grid-template-columns:1fr .82fr 1fr;
  gap:clamp(20px,3vw,56px);align-items:center;margin-top:clamp(14px,2.2vh,30px)}
.sn{list-style:none;margin:0;padding:0;display:grid;gap:clamp(14px,2.2vh,30px)}
.sn--l{grid-column:1}
.sn--r{grid-column:3}
.sn li{position:relative;padding-top:13px;border-top:1px solid rgba(244,239,235,.24);
  --sd:0;
  --sv:clamp(0,(var(--sp,0) - .16 - var(--sd)*.15)*7,1);
  opacity:var(--sv)}
.sn--l li{transform:translate3d(calc((1 - var(--sv)) * -20px),0,0)}
.sn--r li{transform:translate3d(calc((1 - var(--sv)) * 20px),0,0)}
.sn--r li{--sd:0.5}
.sn li:nth-child(2){--sd:1}
.sn--r li:nth-child(2){--sd:1.5}
.sn li:nth-child(3){--sd:2}
.sn--r li:nth-child(3){--sd:2.5}
.sn li:first-child{border-top-color:var(--accent)}

.sn__k{display:block;font-family:var(--mono);font-size:clamp(9.5px,.82vw,11.5px);
  letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:7px;
  text-shadow:0 1px 12px rgba(0,0,0,.92)}
.sn__v{display:block;font-family:var(--display);font-weight:400;
  font-size:clamp(14px,1.22vw,19px);line-height:1.2;color:var(--text-primary);
  margin-bottom:5px;text-shadow:0 2px 20px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.88)}
.sn__d{display:block;font-size:clamp(12.5px,1.02vw,15px);line-height:1.45;color:#E4DBDD;
  text-shadow:0 2px 18px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.88)}
.sn--r .sn__k{color:var(--accent)}

@media (max-width:900px){
  .track--scent{height:auto;--fh:auto}
  .pin--scent{position:static;height:auto;aspect-ratio:3/4}
  .scent__ui{position:absolute;padding:clamp(44px,11vw,70px) var(--gut) clamp(20px,5vw,34px)}
  .scent__head{font-size:clamp(20px,5.4vw,28px);max-width:none}
  .scent__cols{grid-template-columns:1fr;gap:0;align-content:end;margin-top:14px}
  .sn{gap:0}
  .sn--l,.sn--r{grid-column:1}
  .sn--r{margin-top:10px}
  .sn li{padding:9px 0;opacity:1;transform:none}
  .sn__v{font-size:14px;margin-bottom:3px}
  .sn__d{font-size:12px}
  .scent__veil{background:linear-gradient(180deg,rgba(7,4,5,.86) 0%,rgba(7,4,5,.34) 26%,
    rgba(7,4,5,.34) 54%,rgba(7,4,5,.88) 100%)}
}
@media (prefers-reduced-motion:reduce){
  .sn li,.scent__head{opacity:1;transform:none}
}
`;

s = s.slice(0, C0) + CSS + s.slice(C1);

fs.writeFileSync(p, s);
console.log('scent rebuilt: flanking copy, hero grammar, shorter frame');
