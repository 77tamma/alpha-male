// The product photograph changed, so the inspection points have to move with it, and the
// compact buy box's small type needs to come back up to a readable size.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* ---------- 1. inspection points, re-aimed at the new composition ----------
   The old coordinates were tuned to a different photograph at a different aspect ratio
   (860x1382 vs 1000x1250), so all three were pointing at empty frame. */
rep('style="--sx:72.1%;--sy:11.2%"', 'style="--sx:66.5%;--sy:22.5%"');   // the roller dome
rep('style="--sx:38.8%;--sy:43.9%"', 'style="--sx:35%;--sy:47%"');       // the box
rep('style="--sx:72.1%;--sy:77.5%"', 'style="--sx:64%;--sy:80%"');       // 0.34oz / 10ml

/* ---------- 2. the compact cards were shrunk past readable ---------- */
rep(`.buy--compact .opt__q{font-size:10px;letter-spacing:.14em}
.buy--compact .opt__each{font-size:9.5px;letter-spacing:.08em}
.buy--compact .opt__u{font-size:10.5px}
.buy--compact .opt--best .opt__u{font-size:11.5px}
.buy--compact .opt__tag{font-size:9px;letter-spacing:.12em;margin-top:4px}
.buy--compact .opt__tag--rib{padding:4px 7px;letter-spacing:.06em}`,
`/* these had been squeezed to 9–10.5px to fit the column and stopped being readable */
.buy--compact .opt__q{font-size:11.5px;letter-spacing:.16em}
.buy--compact .opt__each{font-size:11px;letter-spacing:.1em}
.buy--compact .opt__u{font-size:12.5px}
.buy--compact .opt--best .opt__u{font-size:14px}
.buy--compact .opt__tag{font-size:11px;letter-spacing:.14em;margin-top:5px}
.buy--compact .opt__tag--rib{padding:5px 9px;letter-spacing:.07em;font-size:10.5px}`);

/* a little more room now the type is bigger */
rep('.buy--compact .opt{padding:24px 10px 13px;gap:3px}',
    '.buy--compact .opt{padding:25px 11px 15px;gap:4px}');

fs.writeFileSync(p, s);
console.log('hotspots re-aimed, compact type enlarged; net ' + (s.length - t0) + ' bytes');
