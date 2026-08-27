// Lock the film the way the hero and product module lock, and stage the reveal across
// the held scroll: rule first, then its line, then the rule moves on.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- the section becomes a track; the film sticks inside it ---------- */
s = s.replace(
'.loud-sec{--warm-deep:#0D0705;position:relative;padding:0;background:var(--warm-deep)}\n.loud__film{position:relative;margin:0;overflow:hidden;background:#000;\n  width:100vw;margin-inline:calc(50% - 50vw);\n  height:clamp(520px,46vw,1080px);max-height:82vh}',
`/* The frame locks while the scroll runs past it, exactly like the hero and the product
   module. This costs scroll LENGTH, not frame height — the film is the same size it was;
   there is simply enough travel now for the three lines to arrive one at a time instead
   of the whole set landing in a fifth of a screen. */
.loud-sec{--warm-deep:#0D0705;--fh:min(clamp(520px,44vw,1000px),80vh);
  position:relative;padding:0;background:var(--warm-deep);height:230vh}
.loud__film{position:sticky;top:calc((100vh - var(--fh)) / 2);
  margin:0;overflow:hidden;background:#000;
  width:100vw;margin-inline:calc(50% - 50vw);height:var(--fh)}`);

/* ---------- slightly smaller heading ---------- */
s = s.replace('.loud .h{font-size:clamp(30px,4.4vw,72px);line-height:1.02;max-width:13ch;',
              '.loud .h{font-size:clamp(28px,3.85vw,62px);line-height:1.04;max-width:13ch;');
s = s.replace('  .loud .h{font-size:clamp(26px,3.5vw,50px)}', '  .loud .h{font-size:clamp(25px,3.1vw,44px)}');

/* ---------- staging: rule lands, then its line, then the rule moves on ---------- */
s = s.replace('  --slot:clamp(0,(var(--p,0) - .26) / .14,2);',
              '  --slot:clamp(0,(var(--p,0) - .06) / .26,2);');
s = s.replace('  opacity:clamp(0,(var(--p,0) - .24)*14,1);',
              '  opacity:clamp(0,(var(--p,0) - .03)*20,1);');
s = s.replace('  --b:clamp(0,(var(--p,0) - .26 - var(--bd)*.14)*9,1);',
              '  --b:clamp(0,(var(--p,0) - .14 - var(--bd)*.26)*7,1);');
/* the headline and formula settle early, before the beats start arriving */
s = s.replace('  --f:clamp(0,(var(--p,0) - .10 - var(--fd)*.035)*10,1);',
              '  --f:clamp(0,(var(--p,0) - .02 - var(--fd)*.022)*16,1);');
s = s.replace('  opacity:clamp(0,(var(--p,0) - .04)*6,1)}',
              '  opacity:clamp(0,var(--p,0)*14,1)}');

/* ---------- mobile: no lock ---------- */
s = s.replace('@media (max-width:900px){\n  .loud__film{height:auto;aspect-ratio:3/4}',
              '@media (max-width:900px){\n  .loud-sec{height:auto}\n  .loud__film{position:static;height:auto;aspect-ratio:3/4}');

/* ---------- progress now measures travel through the track, not the viewport ---------- */
s = s.replace(
`      var r=how.getBoundingClientRect();
      /* 0 as it enters the bottom of the viewport, 1 as it leaves the top — one
         continuous value, so the parallax never jumps when the section is re-entered */
      var p=(window.innerHeight-r.top)/(window.innerHeight+r.height);`,
`      var r=how.getBoundingClientRect();
      var film=how.querySelector('.loud__film');
      var fh=film?film.getBoundingClientRect().height:0;
      /* Progress through the PINNED stretch: 0 the moment the frame locks, 1 when it
         releases. Measuring against the viewport instead would run the whole reveal off
         before the frame had even settled. */
      var stick=(window.innerHeight-fh)/2;
      var span=Math.max(1,how.offsetHeight-fh);
      var p=(stick-r.top)/span;`);

fs.writeFileSync(p, s);
console.log('film locked, reveal staged across the hold');
