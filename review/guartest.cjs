// Measure the inverted guarantee: type sizes, contrast against the red actually behind
// each element, and horizontal overflow across the range.
const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';

const PROBE = `(()=>{
  const lum=c=>{const [r,g,b]=c.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});
    return .2126*r+.7152*g+.0722*b};
  const px=(x,y)=>{const cv=document.createElement('canvas');return null};
  const parse=s=>s.match(/[\\d.]+/g).slice(0,3).map(Number);
  const ratio=(a,b)=>{const A=lum(a),B=lum(b);return ((Math.max(A,B)+.05)/(Math.min(A,B)+.05))};
  const sec=document.getElementById('guarantee');
  const bg=parse(getComputedStyle(sec).backgroundColor.startsWith('rgba(0, 0, 0, 0)')
      ? 'rgb(185,15,23)' : getComputedStyle(sec).backgroundColor);
  // the field is a gradient, so sample the two extremes of the ramp we authored
  const stops={bright:[212,20,28],mid:[185,15,23],dark:[142,10,17]};
  const out={};
  for(const [k,sel] of Object.entries({kick:'.guar__kick',h:'.guar__h',p:'.guar__p',
                                       b:'.guar__row b',span:'.guar__row span'})){
    const e=document.querySelector(sel); if(!e){out[k]='MISSING';continue}
    const cs=getComputedStyle(e);
    const col=parse(cs.color);
    const op=parseFloat(cs.opacity);
    // composite the element's own opacity over the brightest stop = worst case
    const eff=col.map((c,i)=>c*op+stops.bright[i]*(1-op));
    out[k]={size:Math.round(parseFloat(cs.fontSize)*10)/10, opacity:op,
            vsBright:Math.round(ratio(eff,stops.bright)*100)/100,
            vsDark:Math.round(ratio(eff,stops.dark)*100)/100};
  }
  out.num=(()=>{const e=document.querySelector('.guar__num');const cs=getComputedStyle(e);
    return {size:Math.round(parseFloat(cs.fontSize)), opacity:cs.opacity,
            w:Math.round(e.getBoundingClientRect().width)}})();
  out.anims=document.getAnimations().filter(a=>{try{return a.effect.target.closest('.guar')}catch(e){return 0}}).length;
  out.tick=getComputedStyle(document.querySelector('.gd--tick')).strokeDashoffset;
  out.inClass=sec.classList.contains('in');
  out.secH=Math.round(sec.getBoundingClientRect().height);
  out.overflowX=document.documentElement.scrollWidth-document.documentElement.clientWidth;
  // does anything inside the section stick out sideways?
  out.wide=[...sec.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();
    return r.width>0 && (r.left<-2||r.right>innerWidth+2)}).map(e=>e.className||e.tagName).slice(0,6);
  return out;})()`;

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length = 0;

  for (const w of [1280, 1440, 1920, 2560, 3440, 820, 390]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',
      { width: w, height: w < 500 ? 844 : 900, deviceScaleFactor: 1, mobile: w < 500 });
    if (w === 1280) { await cdp.send('Page.navigate', { url: 'http://localhost:8899/' }); await sleep(5500); }
    await evaluate(cdp, `document.getElementById('guarantee').scrollIntoView({behavior:'instant',block:'center'})`);
    await sleep(1800);
    const r = await evaluate(cdp, PROBE);
    console.log('--- ' + w + 'px');
    console.log(JSON.stringify(r));
    if (w === 1440 || w === 390) await shot(cdp, `${OUT}/guar-${w}.png`);
  }

  const errs = cdp.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
  console.log('errors:', errs.length ? errs.map(e => e.params.entry.text.slice(0, 110)) : 'none');
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
