// 1. the shipping promise at twice the size of the rest of the bar, top and bottom
// 2. the payoff line of two headlines in brand red
// 3. the phone hero carries ALL FOUR hero messages, not just the first
// 4. every nav link reachable on a phone
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* ---------- 1. the two payoff lines go red ---------- */
rep('<h2 class="h">They bought it.<br>Then things got interesting.</h2>',
    '<h2 class="h">They bought it.<br><span class="hit">Then things got interesting.</span></h2>');
rep('<h2>You&#8217;ve read enough.<br>Now see what happens.</h2>',
    '<h2>You&#8217;ve read enough.<br><span class="hit">Now see what happens.</span></h2>');

/* ---------- 2. shipping at double weight ---------- */
rep(`.ship{display:inline-flex;align-items:center;gap:8px;margin:0;
  font-family:var(--mono);font-size:11px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--text-secondary);white-space:nowrap}
.ship b{color:var(--text-primary);font-weight:500}
.ship__i{width:19px;height:auto;flex:none;color:var(--accent)}`,
`/* the payoff line of a headline, in the brand's own red */
.hit{color:var(--accent)}

/* twice the size of everything else in the bar — it is the one fact in there that changes
   a decision, so it is not a footnote */
.ship{display:inline-flex;align-items:center;gap:10px;margin:0;
  font-family:var(--mono);font-weight:500;font-size:22px;letter-spacing:.1em;
  text-transform:uppercase;color:var(--text-primary);white-space:nowrap}
.ship b{color:var(--accent);font-weight:500}
.ship__i{width:32px;height:auto;flex:none;color:var(--accent)}`);
rep(`.ship--foot{color:var(--text-dim)}`, `.ship--foot{color:var(--text-primary)}`);
rep(`@media (max-width:900px){
  .ship{font-size:9px;letter-spacing:.04em;gap:5px}
  .ship__i{width:15px}`,
`@media (max-width:900px){
  .ship{font-size:17px;letter-spacing:.06em;gap:8px}
  .ship__i{width:25px}`);
rep(`  .ship{font-size:8.2px;letter-spacing:.02em;gap:4px}
  .ship__i{width:13px}`,
`  .ship{font-size:15px;letter-spacing:.04em;gap:7px}
  .ship__i{width:22px}`);
// at this size it cannot ride the nav row on a phone; it gets its own strip
rep('@media (min-width:641px) and (max-width:1099px){.nav .ship{display:none}}',
`@media (min-width:641px) and (max-width:1280px){.nav .ship{display:none}}
/* At double size the promise cannot share a phone's nav row with a logo, four links and a
   CTA — it takes a strip of its own directly above them, which is also what makes it the
   first thing read. */
@media (max-width:900px){
  .nav{flex-direction:column;align-items:stretch;gap:0;padding:0}
  .nav__ship{display:flex;align-items:center;justify-content:center;
    padding:9px 12px;background:var(--panel);border-bottom:1px solid var(--panel-line)}
  .nav__row{display:flex;align-items:center;justify-content:space-between;
    gap:10px;padding:9px 12px}
  .nav__right{flex-wrap:wrap;justify-content:flex-end;gap:9px 12px}
  .nav__link.hide-s{display:inline-block}
}`);

/* ---------- 3. nav restructured so a phone can show every link ---------- */
rep(`  <a href="#top" aria-label="Alpha Male home"><img class="nav__logo" src="assets/logo.png" alt="Alpha Male"></a>
  <div class="nav__right">
    <span class="ship">`,
`  <div class="nav__ship"><span class="ship">`);
rep(`</svg><span>Free shipping<i class="ship__over"> over</i> <b>$30</b></span></span>
    <a class="nav__link hide-s" href="#how">How it works</a>`,
`</svg><span>Free shipping<i class="ship__over"> over</i> <b>$30</b></span></span></div>
  <div class="nav__row">
    <a href="#top" aria-label="Alpha Male home"><img class="nav__logo" src="assets/logo.png" alt="Alpha Male"></a>
    <div class="nav__right">
    <a class="nav__link hide-s" href="#how">How it works</a>`);
rep(`    <a class="nav__link" href="#get" style="color:var(--accent)">Get a bottle</a>
  </div>
</nav>`,
`    <a class="nav__link" href="#get" style="color:var(--accent)">Get a bottle</a>
    </div>
  </div>
</nav>`);
/* desktop keeps one row: the strip and the row sit side by side */
rep('.nav{position:fixed;top:0;left:0;right:0;z-index:40;\n  display:flex;align-items:center;justify-content:space-between;gap:clamp(12px,2vw,26px);',
`.nav__ship{display:flex;align-items:center}
.nav__row{display:flex;align-items:center;justify-content:space-between;
  gap:clamp(12px,2vw,26px);flex:1;min-width:0}
.nav{position:fixed;top:0;left:0;right:0;z-index:40;
  display:flex;align-items:center;justify-content:space-between;gap:clamp(16px,2.4vw,34px);`);

/* ---------- 4. the phone hero carries the whole story ---------- */
rep(`      <p class="kicker" style="color:var(--accent)">Attraction cologne for men</p>
      <h1>Set the tone before you say a word.</h1>
      <p class="sub">The right presence never needs an introduction. A bold masculine fragrance made for men who carry themselves differently.</p>
      <a class="btn" href="#get">Get Alpha Male</a>`,
`      <p class="kicker" style="color:var(--accent)">Attraction cologne for men</p>
      <h1>Set the tone before you say a word.</h1>
      <p class="sub">The right presence never needs an introduction.</p>

      <div class="sh__beat">
        <h2>Walk in like you belong there.</h2>
        <p class="sub">A bold masculine fragrance made for men who carry themselves differently.</p>
      </div>
      <div class="sh__beat">
        <h2>Leave an impression after you leave.</h2>
        <p class="sub">Because confidence gets noticed. Presence gets remembered.</p>
      </div>
      <div class="sh__beat sh__beat--settle">
        <h2>Make your presence felt.</h2>
        <p class="sub">A bold pheromone cologne for men made to elevate your scent, confidence, and presence.</p>
        <ol class="sh__spec">
          <li><span>First</span>They notice the scent</li>
          <li><span>Then</span>They notice you</li>
          <li><span>After</span>They remember both</li>
        </ol>
      </div>

      <a class="btn" href="#get">Get Alpha Male</a>`);
rep(`  .static-hero>*{margin-inline:var(--gut)}
  .static-hero .kicker{margin-top:clamp(22px,6vw,34px)}`,
`  .static-hero>*{margin-inline:var(--gut)}
  .static-hero .kicker{margin-top:clamp(22px,6vw,34px)}
  /* the desktop hero tells four things across its scrub; the phone tells the same four
     down the page, so nothing in the story is lost to the smaller screen */
  .sh__beat{margin:clamp(30px,8vw,46px) var(--gut) 0;padding-top:clamp(22px,6vw,32px);
    border-top:1px solid var(--panel-line)}
  .sh__beat h2{font-family:var(--display);font-weight:400;margin:0;
    font-size:clamp(26px,7.2vw,34px);line-height:1.06;letter-spacing:-.02em}
  .sh__beat .sub{margin:12px 0 0;max-width:38ch}
  .sh__beat--settle{border-top-color:var(--accent)}
  .sh__spec{list-style:none;margin:22px 0 0;padding:0;display:grid;gap:11px}
  .sh__spec li{display:flex;gap:12px;align-items:baseline;
    font-size:15px;color:var(--text-primary)}
  .sh__spec span{font-family:var(--mono);font-size:10px;letter-spacing:.2em;
    text-transform:uppercase;color:var(--accent);min-width:44px}
  .static-hero .btn{margin-top:clamp(28px,7vw,40px)}`);

/* the bottle sits centred with room around it */
rep(`      url('assets/hero-portrait.jpg') 50% 22%/cover no-repeat}`,
    `      url('assets/hero-portrait.jpg') 50% 34%/cover no-repeat}`);

fs.writeFileSync(p, s);
console.log('shipping doubled, payoff lines red, phone hero complete; net ' + (s.length - t0) + ' bytes');
