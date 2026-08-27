const fs=require('fs');
function scan(file,w,h,label){
  const b=fs.readFileSync(file);
  const counts=new Map();
  for(let i=0;i+2<b.length;i+=3){
    const r=b[i],g=b[i+1],bl=b[i+2];
    if(r>120 && r-Math.max(g,bl)>60){          // clearly red
      const key=`${r},${g},${bl}`;
      counts.set(key,(counts.get(key)||0)+1);
    }
  }
  const top=[...counts.entries()].sort((a,c)=>c[1]-a[1]).slice(0,4);
  console.log(label);
  for(const [k,n] of top){
    const [r,g,bl]=k.split(',').map(Number);
    const hex='#'+[r,g,bl].map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase();
    console.log(`   ${hex}   rgb(${k})   ${n} px`);
  }
}
scan(process.argv[2],0,0,process.argv[3]);
