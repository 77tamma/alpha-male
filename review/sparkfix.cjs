// Put the copy first (text left, image right — matching the product module), and
// re-seed the spark field so it actually sits in the gap between their faces and is
// bright enough to read against a dark, already-red photograph.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- reorder: list before figure ---------- */
const fs0 = s.indexOf('      <figure class="fig">');
const fs1 = s.indexOf('      </figure>', fs0) + '      </figure>'.length;
const ls0 = s.indexOf('      <div class="mech__list">');
const ls1 = s.indexOf('\n      </div>', ls0) + '\n      </div>'.length;
if (fs0 < 0 || ls0 < 0 || fs1 < 0 || ls1 < 0) { console.error('block anchors not found'); process.exit(1); }
if (!(fs1 <= ls0)) { console.error('unexpected block order'); process.exit(1); }

const figBlock  = s.slice(fs0, fs1);
const between   = s.slice(fs1, ls0);
const listBlock = s.slice(ls0, ls1);
s = s.slice(0, fs0) + listBlock + between + figBlock + s.slice(ls1);

/* ---------- re-seed the sparks ---------- */
const sp0 = s.indexOf('        <span class="fig__sparks" aria-hidden="true">');
const sp1 = s.indexOf('</span>', s.indexOf('\n', sp0));
const spEnd = s.indexOf('        </span>', sp0);
if (sp0 < 0 || spEnd < 0) { console.error('spark anchors not found'); process.exit(1); }

// Measured off the render: their faces sit either side of a gap running roughly
// x 32–48%, y 20–56% of the frame. The field is seeded inside that, not across the
// whole picture, so the sparks read as passing BETWEEN them.
const RNG = (seed => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)(77712);
let out = '';
for (let i = 0; i < 22; i++) {
  const x  = (31 + RNG() * 18).toFixed(1);
  const y  = (20 + RNG() * 38).toFixed(1);
  const sz = (2.6 + RNG() * 4.4).toFixed(1);
  const dx = (RNG() * 30 - 15).toFixed(0);
  const dy = (-46 - RNG() * 62).toFixed(0);
  const du = (6 + RNG() * 6).toFixed(1);
  const de = (RNG() * 8).toFixed(1);
  out += `          <i style="--x:${x}%;--y:${y}%;--s:${sz}px;--dx:${dx}px;--dy:${dy}px;--du:${du}s;--de:-${de}s"></i>\n`;
}
s = s.slice(0, s.indexOf('\n', sp0) + 1) + out + s.slice(spEnd);

fs.writeFileSync(p, s);
console.log('copy moved left, 22 sparks re-seeded into the gap');
