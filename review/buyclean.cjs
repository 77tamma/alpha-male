const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };
const all = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS(all): ' + a.slice(0, 80)); process.exit(1); } s = s.split(a).join(b); };

/* .cta-row is gone from the markup; its rules and its share of three grouped selectors
   would otherwise sit in the file forever */
/* this substring also sits inside the two ".slam,..." collapse rules, so one pass fixes all three */
all('.pin__copy .lede,.pin__copy .price,.pin__copy .cta-row{', '.pin__copy .lede,.pin__copy .price{');
rep('.pin__copy .cta-row{--s:clamp(0,(var(--t,0) - .44)*4,1)}\n', '');
rep('.cta-row{display:flex;gap:14px;margin:30px 0 0;flex-wrap:wrap;align-items:center}\n', '');

/* the observer still watched .tier, which no longer exists */
all(`document.querySelectorAll('.stg,.rise,.rev,.tier,.guar').forEach(function(el){io.observe(el);});`,
    `document.querySelectorAll('.stg,.rise,.rev,.guar,.close .buy').forEach(function(el){io.observe(el);});`);
all(`document.querySelectorAll('.stg,.rise,.rev,.tier').forEach(function(el){el.classList.add('in');});`,
    `document.querySelectorAll('.stg,.rise,.rev,.close .buy').forEach(function(el){el.classList.add('in');});`);

/* the closing offer arrives rather than simply being there, on the page's own stagger */
rep('.close .buy{max-width:1040px;margin:clamp(34px,4vw,52px) auto 0}',
`.close .buy{max-width:1040px;margin:clamp(34px,4vw,52px) auto 0;
  opacity:0;transform:translateY(20px);
  transition:opacity .8s var(--ease),transform .9s cubic-bezier(.22,.61,.36,1);
  transition-delay:.12s}
.close .buy.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.close .buy{opacity:1;transform:none;transition:none}}`);

fs.writeFileSync(p, s);
console.log('cleaned; net ' + (s.length - t0) + ' bytes');
