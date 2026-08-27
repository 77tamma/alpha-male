// Three fixes:
//  1. the phone hero puts its copy on top of the bottle — stack it, like every other module
//  2. the shipping promise joins the nav row instead of sitting on a strip of its own
//  3. "See what they're saying" becomes a real heading: display face, accent, centred
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

const TRUCK = '<svg class="ship__i" viewBox="0 0 26 16" fill="none" aria-hidden="true"><path d="M1 2.2h13.4v9.4H1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M14.4 5.6h4.2l3.6 3.6v2.4h-7.8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="6" cy="13" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="18.2" cy="13" r="2" stroke="currentColor" stroke-width="1.5"/></svg>';

/* ---------- 1. the shipping line joins the nav row ---------- */
rep(`<p class="ship ship--top">${TRUCK}<span>Free shipping over <b>$30</b></span></p>\n\n`, '');
rep('  <div class="nav__right">\n    <a class="nav__link hide-s" href="#how">How it works</a>',
`  <div class="nav__right">
    <span class="ship">${TRUCK}<span>Free shipping over <b>$30</b></span></span>
    <a class="nav__link hide-s" href="#how">How it works</a>`);
/* and the footer one shares the footer's own row */
rep(`  <p class="ship ship--foot">${TRUCK}<span>Free shipping over <b>$30</b></span></p>\n`, '');
rep('    <div class="foot__links">\n      <a href="#how">How it works</a>',
`    <div class="foot__links">
      <span class="ship ship--foot">${TRUCK}<span>Free shipping over <b>$30</b></span></span>
      <a href="#how">How it works</a>`);

rep(`/* one promise, stated where it changes a decision: on arrival and again at the foot */
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
`,
`/* the promise rides the nav row rather than a strip of its own — it is a nav item that
   happens to be a fact rather than a link */
.ship{display:inline-flex;align-items:center;gap:8px;margin:0;
  font-family:var(--mono);font-size:11px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--text-secondary);white-space:nowrap}
.ship b{color:var(--text-primary);font-weight:500}
.ship__i{width:19px;height:auto;flex:none;color:var(--accent)}
.ship--foot{color:var(--text-dim)}
@media (max-width:900px){
  .ship{font-size:9.5px;letter-spacing:.08em;gap:6px}
  .ship__i{width:16px}
}
@media (max-width:360px){.ship span{display:none}}
`);
/* the fixed strip is gone, so nothing needs to be offset for it any more */
rep('.nav{position:fixed;top:var(--shipH,37px);left:0;right:0;z-index:40;',
    '.nav{position:fixed;top:0;left:0;right:0;z-index:40;');
rep('.hero{position:relative;z-index:2;height:calc(var(--hero-vh) * 1vh);padding-top:var(--shipH,37px)}',
    '.hero{position:relative;z-index:2;height:calc(var(--hero-vh) * 1vh)}');
rep('section[id]{scroll-margin-top:calc(var(--shipH,37px) + 58px)}',
    'section[id]{scroll-margin-top:74px}');

/* ---------- 2. the phone hero stacks ---------- */
rep(`  .static-hero{display:block;position:relative;z-index:2;width:100%;
    padding:min(58vh,470px) var(--gut) 56px;
    background:
      linear-gradient(180deg,rgba(6,4,5,.30) 0%,rgba(6,4,5,.10) 30%,rgba(6,4,5,.78) 58%,rgba(6,4,5,.97) 78%,var(--canvas) 100%),
      url('assets/hero-portrait.jpg') center top/cover no-repeat}`,
`  /* the product gets a frame of its own and the words sit under it. Padding the copy down
     over a background image meant the bottle was always behind the headline. */
  .static-hero{display:block;position:relative;z-index:2;width:100%;
    padding:0 0 clamp(34px,9vw,54px);background:var(--canvas)}
  .static-hero::before{content:"";display:block;width:100%;aspect-ratio:3/4;
    background:
      linear-gradient(180deg,rgba(6,4,5,.34) 0%,rgba(6,4,5,0) 26%,
                     rgba(6,4,5,0) 62%,rgba(6,4,5,.86) 92%,var(--canvas) 100%),
      url('assets/hero-portrait.jpg') 50% 22%/cover no-repeat}
  .static-hero>*{margin-inline:var(--gut)}
  .static-hero .kicker{margin-top:clamp(22px,6vw,34px)}`);

/* ---------- 3. the reviews label becomes a heading ---------- */
rep(`.revs__bar{display:flex;align-items:baseline;justify-content:space-between;gap:16px;
  margin:44px 0 16px}`,
`/* three tracks so the label can sit dead centre with the controls still on the right */
.revs__bar{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;
  margin:44px 0 18px}
.revs__bar>:first-child{grid-column:2;justify-self:center}
.revs__nav{grid-column:3;justify-self:end}
@media (max-width:640px){
  .revs__bar{grid-template-columns:1fr;gap:14px;justify-items:center}
  .revs__bar>:first-child,.revs__nav{grid-column:1;justify-self:center}
}`);
rep(`.revs__count{margin:0;font-family:var(--mono);font-size:clamp(11px,1vw,13.5px);letter-spacing:.18em;
  text-transform:uppercase;color:var(--text-secondary)}`,
`/* a heading in the page's display face, not a caption — scaled under the h2 above it */
.revs__count{margin:0;font-family:var(--display);font-weight:400;
  font-size:clamp(17px,1.9vw,27px);line-height:1.1;letter-spacing:-.01em;
  text-transform:none;color:var(--accent);text-align:center}`);
rep('.revs__count{color:var(--text-primary)}', '');

fs.writeFileSync(p, s);
console.log('nav shipping, stacked phone hero, reviews heading; net ' + (s.length - t0) + ' bytes');
