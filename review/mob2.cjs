// Mobile: stop overlaying copy on film, and add the shipping bar top and bottom.
//
// Both the scent and the mechanism keep their desktop composition on a phone — an absolutely
// positioned copy layer sitting on top of the video. At 390px there is no room for text and
// picture to share a frame, so the words land on the bottle and on the couple's faces, and
// the film gets cropped to a slot. On a phone they stack: the film gets its own frame with
// nothing over it, and the copy sits below it on the page's own black.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

const TRUCK = '<svg class="ship__i" viewBox="0 0 26 16" fill="none" aria-hidden="true"><path d="M1 2.2h13.4v9.4H1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M14.4 5.6h4.2l3.6 3.6v2.4h-7.8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="6" cy="13" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="18.2" cy="13" r="2" stroke="currentColor" stroke-width="1.5"/></svg>';

/* ---------- 1. the shipping bar, top and bottom ---------- */
rep('<nav class="nav" id="nav">',
`<p class="ship ship--top">${TRUCK}<span>Free shipping over <b>$30</b></span></p>

<nav class="nav" id="nav">`);
rep('  <p class="fine">',
`  <p class="ship ship--foot">${TRUCK}<span>Free shipping over <b>$30</b></span></p>
  <p class="fine">`);

rep('.nav{position:fixed;top:0;left:0;right:0;z-index:40;',
`/* one promise, stated where it changes a decision: on arrival and again at the foot */
.ship{display:flex;align-items:center;justify-content:center;gap:9px;margin:0;
  padding:9px var(--gut);background:var(--panel);
  border-bottom:1px solid var(--panel-line);
  font-family:var(--mono);font-size:clamp(10px,.92vw,12px);letter-spacing:.16em;
  text-transform:uppercase;color:var(--text-secondary)}
.ship b{color:var(--text-primary);font-weight:500}
.ship__i{width:20px;height:auto;flex:none;color:var(--accent)}
.ship--top{position:fixed;top:0;left:0;right:0;z-index:41}
.ship--foot{border-bottom:0;border-top:1px solid var(--panel-line);
  background:transparent;margin:34px 0 0}
@media (max-width:520px){
  .ship{gap:7px;padding:8px 12px;font-size:10px;letter-spacing:.1em}
  .ship__i{width:17px}
}

.nav{position:fixed;top:var(--shipH,37px);left:0;right:0;z-index:40;`);
/* the page starts below the bar */
rep('.hero{position:relative;z-index:2;height:calc(var(--hero-vh) * 1vh)}',
    '.hero{position:relative;z-index:2;height:calc(var(--hero-vh) * 1vh);padding-top:var(--shipH,37px)}');

/* ---------- 2. the scent stacks on a phone ---------- */
rep(`@media (max-width:900px){
  .track--scent{height:auto;--fh:auto}
  .pin--scent{position:static;height:auto;aspect-ratio:3/4}
  .scent__ui{position:absolute;padding:clamp(44px,11vw,70px) var(--gut) clamp(20px,5vw,34px)}`,
`@media (max-width:900px){
  /* film first, at its own size and with nothing on top of it, then the copy underneath on
     the page's own black. contain rather than cover, because a cropped bottle is worse than
     letterboxing on a product shot. */
  .track--scent{height:auto;--fh:auto}
  .pin--scent{position:static;height:auto;display:block;background:var(--canvas)}
  .scent__vid{position:relative;inset:auto;width:100%;height:auto;aspect-ratio:4/5;
    object-fit:contain;object-position:50% 50%;background:#000}
  .scent__veil{height:auto;bottom:auto;aspect-ratio:4/5;
    background:linear-gradient(180deg,rgba(7,4,5,.5) 0%,rgba(7,4,5,0) 26%,
               rgba(7,4,5,0) 74%,rgba(7,4,5,.62) 100%)}
  .scent__ui{position:static;inset:auto;padding:clamp(24px,6vw,38px) var(--gut) clamp(30px,7vw,44px)}`);
rep(`  .scent__cols{grid-template-columns:1fr;gap:0;align-content:end;margin-top:14px}`,
    `  .scent__cols{grid-template-columns:1fr;gap:0;align-content:start;margin-top:18px}`);

/* ---------- 3. the mechanism stacks on a phone ---------- */
rep(`@media (max-width:900px){
  .loud-sec{height:auto}
  .loud__film{position:static;height:auto;aspect-ratio:3/4}
  .fill{opacity:1;object-position:54% 26%}
  .loud__foot{height:58%}
  .loud{position:absolute;padding-bottom:clamp(22px,5vw,36px)}
  .loud__copy{position:static;max-width:none;margin-top:auto;margin-bottom:clamp(16px,3vw,26px)}`,
`@media (max-width:900px){
  /* the couple gets a frame of their own — at 3/4 with copy over it the shot was cropped to
     a slot and the faces were under the headline */
  .loud-sec{height:auto;padding:0 0 clamp(30px,7vw,46px)}
  .loud__film{position:static;height:auto;aspect-ratio:auto;display:block;
    background:var(--warm-deep)}
  .fill{opacity:1;position:relative;width:100%;height:auto;aspect-ratio:4/3;
    object-fit:cover;object-position:50% 24%}
  .loud__foot{position:absolute;top:0;left:0;right:0;height:0;
    aspect-ratio:4/3;
    background:linear-gradient(180deg,rgba(13,7,5,.42) 0%,rgba(13,7,5,0) 30%,
               rgba(13,7,5,0) 66%,rgba(13,7,5,.9) 100%)}
  .loud{position:static;inset:auto;padding:clamp(22px,6vw,34px) var(--gut) 0}
  .loud__copy{position:static;max-width:none;margin:0 0 clamp(16px,3vw,26px)}`);

fs.writeFileSync(p, s);
console.log('mobile stacking + shipping bar; net ' + (s.length - t0) + ' bytes');
