// Batch fix from the full 390px walk:
//  1. hero — the whole photograph, below the header instead of underneath it
//  2. shipping strips say "over $30" again ("FREE SHIPPING $30" read as a $30 charge)
//  3. guarantee — the 78vh void goes; the section is as tall as its promise
//  4. scent film — 16/9 like the footage, no letterbox bars
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* 1 — the hero photo is exactly 9:16 (900x1600). A 3:4 crop was chopping the cap and the
   reflection, and the fixed header sat over what was left. Full frame, seated below the
   header, nothing chopped. */
rep(`  .static-hero::before{content:"";display:block;width:100%;aspect-ratio:3/4;
    background:
      linear-gradient(180deg,rgba(6,4,5,.34) 0%,rgba(6,4,5,0) 26%,
                     rgba(6,4,5,0) 62%,rgba(6,4,5,.86) 92%,var(--canvas) 100%),
      url('assets/hero-portrait.jpg') 50% 34%/cover no-repeat}`,
`  /* the photo is 900x1600 — a 9/16 frame shows all of it, cap to reflection */
  .static-hero{padding-top:94px}
  .static-hero::before{content:"";display:block;width:100%;aspect-ratio:9/16;
    background:
      linear-gradient(180deg,rgba(6,4,5,.2) 0%,rgba(6,4,5,0) 18%,
                     rgba(6,4,5,0) 66%,rgba(6,4,5,.85) 92%,var(--canvas) 100%),
      url('assets/hero-portrait.jpg') 50% 50%/cover no-repeat}`);

/* 2 — "FREE SHIPPING $30" without the "over" reads as a shipping charge. The strip has the
   whole row to itself now, so the full sentence fits at every width. */
rep('@media (max-width:480px){.ship__over{display:none}}\n', '');

/* 3 — the guarantee sat in a 78vh flex-centred box: 60px of void above and below the
   promise, and the next section's padding on top of that. Content height, page rhythm. */
rep('  .pin--guar{position:relative;height:auto;aspect-ratio:auto;min-height:78vh;display:flex;align-items:center}',
    '  .pin--guar{position:relative;height:auto;aspect-ratio:auto;min-height:0;display:flex;align-items:center}');

/* 4 — the clips are 16:9; a 16/11 contain box letterboxed them and the bars read as broken
   spacing between sections */
rep('  .scent__vid{position:relative;inset:auto;width:100%;height:auto;aspect-ratio:16/11;',
    '  .scent__vid{position:relative;inset:auto;width:100%;height:auto;aspect-ratio:16/9;');
rep('  .scent__veil{height:auto;bottom:auto;aspect-ratio:16/11;',
    '  .scent__veil{height:auto;bottom:auto;aspect-ratio:16/9;');

fs.writeFileSync(p, s);
console.log('mob5 applied; net ' + (s.length - t0) + ' bytes');
