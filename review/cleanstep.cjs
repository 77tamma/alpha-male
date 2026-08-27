// Remove the .step card CSS the mechanism layout replaced, and repoint the entrance
// observers at the new element. Run from the project root.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const before = s.length;

const startAnchor = '.step{position:relative;padding:32px 26px 30px;background:var(--panel);';
const endAnchor   = '.step:hover::after{opacity:1}';
const start = s.indexOf(startAnchor);
const end   = s.indexOf(endAnchor);
if (start < 0 || end < 0) { console.error('anchors not found'); process.exit(1); }
s = s.slice(0, start) + s.slice(end + endAnchor.length);

// the icon draw-in override in the reduced-motion block is dead with the icons gone
s = s.replace(/\n\s*\.step__icon \.dr\{stroke-dashoffset:0 !important\}/, '');

// entrance observers
s = s.split("'.stg,.rise,.step,.rev,.tier,.mols li'").join("'.stg,.rise,.mech__item,.rev,.tier,.mols li'");
s = s.split("'.stg,.rise,.step'").join("'.stg,.rise,.mech__item'");

fs.writeFileSync(p, s);
console.log('removed ' + (before - s.length) + ' bytes of orphaned .step css');
console.log('remaining .step refs: ' + (s.match(/\.step[_.\b{:]/g) || []).length);
