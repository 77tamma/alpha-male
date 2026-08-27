// One pass over the batch: brighten the scent, drop the pheromone section, rebuild the
// reviews as a single scrolling row, restyle the pricing, and update the hotspot copy.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;

/* ---------- 1. brighten the scent film ---------- */
s = s.replace('.scent__vid{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;\n  object-position:50% 50%;background:#000}',
              '.scent__vid{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;\n  object-position:50% 50%;background:#000;\n  /* lifted to sit with the two modules above, which are graded brighter */\n  filter:brightness(1.28) saturate(1.06)}');
// the flanks can ease off now the picture is brighter, so long as the red labels hold
s = s.split('rgba(7,4,5,.975) 0%,rgba(7,4,5,.92) 22%,rgba(7,4,5,.60) 36%,rgba(7,4,5,.14) 48%,rgba(7,4,5,0) 58%')
     .join('rgba(7,4,5,.97) 0%,rgba(7,4,5,.90) 22%,rgba(7,4,5,.56) 36%,rgba(7,4,5,.12) 48%,rgba(7,4,5,0) 58%');
s = s.replace('  linear-gradient(180deg,rgba(7,4,5,.92) 0%,rgba(7,4,5,.52) 18%,rgba(7,4,5,.10) 40%,\n                  rgba(7,4,5,.30) 80%,rgba(7,4,5,.60) 100%)}',
              '  linear-gradient(180deg,rgba(7,4,5,.88) 0%,rgba(7,4,5,.42) 18%,rgba(7,4,5,0) 40%,\n                  rgba(7,4,5,.22) 80%,rgba(7,4,5,.52) 100%)}');

/* ---------- 2. remove the four-pheromones section ---------- */
const i0 = s.indexOf('<section class="sec" id="inside">');
const i1 = s.indexOf('<!-- ====================================================== PROOF ===== -->');
if (i0 < 0 || i1 < 0) { console.error('inside anchors not found'); process.exit(1); }
s = s.slice(0, i0) + s.slice(i1);

/* ---------- 3. reviews: new head + one scrolling row + three more ---------- */
s = s.replace('      <h2 class="h">Their words, not ours.</h2>\n      <p class="lede">Left on Amazon by people who paid for it. Copied here exactly as written, typos and all, because tidying them up would only make them look invented.</p>',
              '      <h2 class="h">They bought it. Then things got interesting.</h2>\n      <p class="lede">The attention. The compliments. The unexpected reactions. Don&#8217;t take our word for it &#8212; read theirs.</p>');

// wrap the row and add the controls
s = s.replace('    <div class="revs">', `    <div class="revs__bar">
      <p class="revs__count"><b>8</b> verified reviews</p>
      <div class="revs__nav">
        <button class="revs__btn" type="button" data-rev="-1" aria-label="Previous reviews">&#8592;</button>
        <button class="revs__btn" type="button" data-rev="1" aria-label="More reviews">&#8594;</button>
      </div>
    </div>
    <div class="revs" id="revs" tabindex="0" role="region" aria-label="Customer reviews, scrollable">`);

// three more, from the Amazon listing
const NEW = `
      <figure class="rev">
        <div class="rev__stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <h3 class="rev__t">She loves the scent</h3>
        <blockquote><p>She loves the scent when I wear it. It lasts quite a while. It is very versatile and rolls on easily. It is effective and makes me feel much more confident when I wear it.</p></blockquote>
        <figcaption>Butterfliesin.space <span>Verified Purchase</span></figcaption>
      </figure>

      <figure class="rev">
        <div class="rev__stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <h3 class="rev__t">Long-lasting, masculine scent that boosts confidence</h3>
        <blockquote><p>Really impressed with this cologne. It has a strong, masculine scent that lasts for hours without being overwhelming. The roll-on format is super convenient for travel. It definitely adds confidence and presence. Great quality.</p></blockquote>
        <figcaption>Nataliia <span>Verified Purchase</span></figcaption>
      </figure>

      <figure class="rev">
        <div class="rev__stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <h3 class="rev__t">Lady&#8217;s love this stuff</h3>
        <blockquote><p>This is certainly effective&#8230; my girl can&#8217;t keep her head off my chest. She knows somethings up, just not exactly what! Lol&#8230;</p></blockquote>
        <figcaption>Doug <span>Verified Purchase</span></figcaption>
      </figure>
    </div>`;
const revEnd = s.indexOf("        <figcaption>Tom O'Conner <span>Verified Purchase</span></figcaption>\n      </figure>\n    </div>");
if (revEnd < 0) { console.error('review tail not found'); process.exit(1); }
s = s.replace("        <figcaption>Tom O'Conner <span>Verified Purchase</span></figcaption>\n      </figure>\n    </div>",
              "        <figcaption>Tom O'Conner <span>Verified Purchase</span></figcaption>\n      </figure>\n" + NEW);

/* reviews css: masonry columns -> one snapping row */
s = s.replace('.revs{columns:3 300px;column-gap:clamp(14px,2vw,24px);margin:52px 0 0}',
`/* One row that scrolls, rather than a masonry block. Eight reviews will not fit across
   a viewport, so the row snaps and the controls page through it. */
.revs__bar{display:flex;align-items:baseline;justify-content:space-between;gap:16px;
  margin:44px 0 16px}
.revs__count{margin:0;font-family:var(--mono);font-size:11px;letter-spacing:.18em;
  text-transform:uppercase;color:var(--text-secondary)}
.revs__count b{color:var(--accent);font-weight:500}
.revs__nav{display:flex;gap:8px}
.revs__btn{width:40px;height:40px;border:1px solid var(--panel-line);background:transparent;
  color:var(--text-primary);font-size:16px;line-height:1;border-radius:3px;cursor:pointer;
  transition:border-color .25s var(--ease),background .25s var(--ease),color .25s var(--ease)}
.revs__btn:hover{border-color:var(--accent);color:var(--accent)}
.revs__btn:focus-visible{outline:2px solid var(--text-primary);outline-offset:2px}
.revs__btn[disabled]{opacity:.34;cursor:default;border-color:var(--panel-line);color:var(--text-secondary)}
.revs{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(288px,1fr);
  gap:clamp(14px,1.6vw,22px);overflow-x:auto;scroll-snap-type:x mandatory;
  scroll-behavior:smooth;padding-bottom:6px;
  scrollbar-width:thin;scrollbar-color:var(--panel-line) transparent}
.revs::-webkit-scrollbar{height:6px}
.revs::-webkit-scrollbar-thumb{background:var(--panel-line);border-radius:3px}
.revs:focus-visible{outline:2px solid var(--accent);outline-offset:4px}`);

s = s.replace('.rev{break-inside:avoid;margin:0 0 clamp(14px,2vw,24px);padding:26px 24px;',
              '.rev{scroll-snap-align:start;margin:0;padding:26px 24px;display:flex;flex-direction:column;');

/* ---------- 4. pricing ---------- */
s = s.split('$55.99').join('$54.99');
s = s.split('Save $13.98').join('Save $14.98');

/* ---------- 5. hotspot copy ---------- */
s = s.replace('<b>Steel roller</b>A ball applicator, not a spray. You place it exactly where you want it.',
              '<b>Precision roller</b>Apply to wrists, neck and behind ears. No mess. No waste.');
s = s.replace('<b>10 mL / 0.34 oz</b>Concentrated oil. One drop per point, two points, and that is the dose.',
              '<b>Concentrated oil</b>Four pheromones: androstenol, androsterone, androstenone and androstadienone.');

/* ---------- 6. hotspots more visible ---------- */
s = s.replace('.spot__dot{width:11px;height:11px;border-radius:50%;background:var(--accent);\n  box-shadow:0 0 0 1px rgba(237,28,36,.55);',
              '.spot__dot{width:15px;height:15px;border-radius:50%;background:var(--accent);\n  box-shadow:0 0 0 2px rgba(237,28,36,.42),0 0 16px 3px rgba(237,28,36,.55);');
s = s.replace('.spot__dot::after{content:"";position:absolute;inset:9px;border-radius:50%;\n  border:1px solid var(--accent);opacity:.55;animation:spotRing 2.8s ease-out infinite}',
              '/* the previous ring was one thin pulse every 2.8s and read as noise; this is a\n   heavier double ring on a shorter cycle so the marker asks to be touched */\n.spot__dot::after{content:"";position:absolute;inset:7px;border-radius:50%;\n  border:2px solid var(--accent);opacity:.8;animation:spotRing 1.9s ease-out infinite}\n.spot__dot::before{content:"";position:absolute;inset:7px;border-radius:50%;\n  border:2px solid var(--accent);opacity:.6;animation:spotRing 1.9s ease-out infinite;\n  animation-delay:-.95s}');
s = s.replace('@keyframes spotRing{0%{transform:scale(.6);opacity:.6}70%{transform:scale(1.5);opacity:0}100%{opacity:0}}',
              '@keyframes spotRing{0%{transform:scale(.55);opacity:.85}70%{transform:scale(2.1);opacity:0}100%{opacity:0}}');

fs.writeFileSync(p, s);
console.log('batch applied; net ' + (s.length - t0) + ' bytes');
