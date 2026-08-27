// The header, rebuilt as one row at every width.
//
// Desktop: logo left, the shipping promise centred, links right — the promise stops being
// stranded on the far left with a gap the width of the page next to it.
// Phone: logo, promise, and a menu button on ONE row. Five links plus a logo plus a
// double-size promise cannot share a phone's row, so the links move into a panel that drops
// from under the bar — which is what a shop does, rather than wrapping into three rows.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };

/* ---------- markup: three children on one row, plus a menu button ---------- */
rep('  <div class="nav__ship"><span class="ship">', '  <span class="ship">');
rep(`<b>$30</b></span></span></div>
  <div class="nav__row">
    <a href="#top" aria-label="Alpha Male home"><img class="nav__logo" src="assets/logo.png" alt="Alpha Male"></a>
    <div class="nav__right">`,
`<b>$30</b></span></span>
    <div class="nav__right" id="navMenu">`);
rep(`    <a class="nav__link" href="#get" style="color:var(--accent)">Get a bottle</a>
    </div>
  </div>
</nav>`,
`    <a class="nav__link" href="#get" style="color:var(--accent)">Get a bottle</a>
    </div>
  <button class="nav__burger" id="navBurger" type="button"
          aria-expanded="false" aria-controls="navMenu" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>`);
// the logo anchor moves back to being a direct child, first in the row
rep('<nav class="nav" id="nav">\n  <span class="ship">',
    '<nav class="nav" id="nav">\n  <a href="#top" class="nav__brand" aria-label="Alpha Male home"><img class="nav__logo" src="assets/logo.png" alt="Alpha Male"></a>\n  <span class="ship">');

/* ---------- css ---------- */
rep(`.nav__ship{display:flex;align-items:center}
.nav__row{display:flex;align-items:center;justify-content:space-between;
  gap:clamp(12px,2vw,26px);flex:1;min-width:0}
.nav{position:fixed;top:0;left:0;right:0;z-index:40;
  display:flex;align-items:center;justify-content:space-between;gap:clamp(16px,2.4vw,34px);`,
`/* three children, so the promise lands in the middle instead of beside the logo */
.nav__brand{flex:none;display:flex}
.nav__burger{display:none;flex:none;width:38px;height:38px;padding:9px 7px;
  background:none;border:0;cursor:pointer;flex-direction:column;justify-content:space-between}
.nav__burger span{display:block;height:2px;background:var(--text-primary);border-radius:2px;
  transition:transform .3s var(--ease),opacity .2s var(--ease)}
.nav.open .nav__burger span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.nav.open .nav__burger span:nth-child(2){opacity:0}
.nav.open .nav__burger span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.nav{position:fixed;top:0;left:0;right:0;z-index:40;
  display:flex;align-items:center;justify-content:space-between;gap:clamp(16px,2.4vw,34px);`);
rep('.nav>a,.nav__row>a{flex:none;display:flex;min-width:0}',
    '.nav>a{flex:none;display:flex;min-width:0}');
rep('.nav__logo{height:30px;width:auto;flex:none}',
    '.nav__logo{height:30px;width:auto;flex:none}\n.nav .ship{margin-inline:auto}');

/* ---------- the phone header ---------- */
rep(`@media (max-width:900px){
  nav.nav{flex-direction:column;align-items:stretch;gap:0;padding:0}
  nav.nav .nav__ship{display:flex;width:100%;align-items:center;justify-content:center;
    padding:10px 12px;background:var(--panel);border-bottom:1px solid var(--panel-line)}
  nav.nav .nav__row{display:flex;width:100%;align-items:center;justify-content:space-between;
    gap:10px;padding:9px 12px}
  .nav__right{flex-wrap:wrap;justify-content:flex-end;gap:9px 12px}
  .nav__row .nav__link.hide-s{display:inline-block}
}`,
`@media (max-width:900px){
  /* one row: mark, promise, menu. The links live in a panel under it. */
  nav.nav{flex-direction:row;align-items:center;gap:10px;padding:10px 13px;
    background:linear-gradient(180deg,rgba(6,4,5,.97),rgba(6,4,5,.88))}
  .nav__burger{display:flex}
  nav.nav .ship{margin-inline:auto}

  nav.nav .nav__right{position:absolute;top:100%;left:0;right:0;z-index:1;
    display:flex;flex-direction:column;align-items:stretch;gap:0;
    background:var(--panel);border-top:1px solid var(--panel-line);
    max-height:0;overflow:hidden;visibility:hidden;
    transition:max-height .4s var(--ease),visibility 0s linear .4s}
  nav.nav.open .nav__right{max-height:70vh;visibility:visible;transition-delay:0s}
  nav.nav .nav__right .nav__link{display:block;padding:15px 18px;font-size:12.5px;
    letter-spacing:.16em;border-bottom:1px solid var(--panel-line)}
  nav.nav .nav__right .nav__link.hide-s{display:block}
  nav.nav .nav__right .nav__link:last-child{border-bottom:0}
}`);

/* ---------- the footer row ---------- */
rep(`    <div class="foot__links">
      <span class="ship ship--foot">`,
`    <div class="foot__links foot__links--with-ship">
      <span class="ship ship--foot">`);
rep('.ship--foot{color:var(--text-primary)}',
`.ship--foot{color:var(--text-primary)}
/* the footer row centres as one line and wraps as a block rather than orphaning a link */
.foot__links--with-ship{display:flex;flex-wrap:wrap;align-items:center;
  justify-content:center;gap:14px clamp(16px,2vw,28px)}
@media (max-width:900px){
  .foot__links--with-ship{gap:12px 18px}
  .ship--foot{flex-basis:100%;justify-content:center}
}`);

/* ---------- the toggle ---------- */
rep(`/* ------------------------------------------------- environment layer */`,
`/* ------------------------------------------------------------ the menu
   Five links, a logo and a double-size shipping promise do not share a phone's header row,
   so below 900px the links live in a panel. Closes on choosing a link, on Escape, and on a
   tap outside — a menu that can only be closed by the button it was opened with is a trap. */
(function navMenu(){
  var nav = document.getElementById('nav'), btn = document.getElementById('navBurger'),
      menu = document.getElementById('navMenu');
  if (!nav || !btn || !menu) return;
  function setOpen(v){
    nav.classList.toggle('open', v);
    btn.setAttribute('aria-expanded', v ? 'true' : 'false');
  }
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    setOpen(!nav.classList.contains('open'));
  });
  menu.addEventListener('click', function(e){ if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('click', function(e){
    if (nav.classList.contains('open') && !nav.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && nav.classList.contains('open')){ setOpen(false); btn.focus(); }
  });
  window.matchMedia('(min-width:901px)').addEventListener('change', function(m){
    if (m.matches) setOpen(false);
  });
})();

/* ------------------------------------------------- environment layer */`);

fs.writeFileSync(p, s);
console.log('header rebuilt as one row; net ' + (s.length - t0) + ' bytes');
