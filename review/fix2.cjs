// Tidy the review row: bodies should start at one height, cards should end at one height,
// and only the opened card should grow.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 70)); process.exit(1); } s = s.replace(a, b); };

/* titles run one to three lines, which started every body at a different height */
rep('.rev__t{font-family:var(--display);font-size:15px;line-height:1.3;margin:0 0 12px;letter-spacing:-.005em}',
`/* two lines reserved: titles run one to three lines across the eight reviews, and without
   this every card started its body text at a different height */
.rev__t{font-family:var(--display);font-size:15px;line-height:1.3;margin:0 0 12px;
  letter-spacing:-.005em;min-height:2.6em}`);

/* one collapsed height for the whole row, measured rather than guessed */
rep(`.rev{scroll-snap-align:start;margin:0;padding:26px 24px;display:flex;flex-direction:column;
  height:auto;`,
`.rev{scroll-snap-align:start;margin:0;padding:26px 24px;display:flex;flex-direction:column;
  min-height:var(--rev-h,auto);`);

/* the byline sits on the floor of the card, wherever that floor ends up */
rep('.rev figcaption{margin:16px 0 0;font-family:var(--mono);font-size:10px;letter-spacing:.14em;',
    '.rev figcaption{margin:auto 0 0;padding-top:16px;font-family:var(--mono);font-size:10px;letter-spacing:.14em;');

/* let a touch more of the last line through before it fades */
rep('linear-gradient(180deg,#000 66%,rgba(0,0,0,0) 100%);\n          mask-image:linear-gradient(180deg,#000 66%,rgba(0,0,0,0) 100%)}',
    'linear-gradient(180deg,#000 74%,rgba(0,0,0,0) 100%);\n          mask-image:linear-gradient(180deg,#000 74%,rgba(0,0,0,0) 100%)}');

/* measure the tallest collapsed card and hold the row to it */
rep(`  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  else window.addEventListener('load', build);
  window.addEventListener('resize', function(){
    document.querySelectorAll('.rev.open').forEach(function(f){
      var q = f.querySelector('blockquote');
      if (q) f.style.setProperty('--full', q.scrollHeight + 'px');
    });
  });`,
`  /* One collapsed height for the row, taken from the tallest card once the controls are
     in place. Set in CSS it would have to be a guess; measured it is exact, and a card
     that opens still grows past it on its own. */
  function level(){
    var row = document.getElementById('revs');
    if (!row) return;
    row.style.removeProperty('--rev-h');
    var tallest = 0;
    row.querySelectorAll('.rev').forEach(function(f){
      if (f.classList.contains('open')) return;
      tallest = Math.max(tallest, f.getBoundingClientRect().height);
    });
    if (tallest) row.style.setProperty('--rev-h', Math.ceil(tallest) + 'px');
  }
  function boot(){ build(); level(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
  else window.addEventListener('load', boot);
  var t;
  window.addEventListener('resize', function(){
    clearTimeout(t);
    t = setTimeout(function(){
      document.querySelectorAll('.rev.open').forEach(function(f){
        var q = f.querySelector('blockquote');
        if (q) f.style.setProperty('--full', q.scrollHeight + 'px');
      });
      level();
    }, 140);
  });`);

fs.writeFileSync(p, s);
console.log('review row levelled; net ' + (s.length - t0) + ' bytes');
