const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
const [,,html,outdir,seedArg]=process.argv;fs.mkdirSync(outdir,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:540,height:960},deviceScaleFactor:2});
p.on('pageerror',e=>console.log('PAGEERR',e.message));
await p.goto('file://'+html);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
await p.evaluate(()=>window.__boot());
const FPS=30;let i=0,doneAt=-1;
while(true){
  const r=await p.evaluate(dt=>{window.__frame(dt);return [document.getElementById('c').toDataURL('image/jpeg',0.92),window.__done||0];},1/FPS);
  fs.writeFileSync(path.join(outdir,'f'+String(i).padStart(5,'0')+'.jpg'),Buffer.from(r[0].split(',')[1],'base64'));
  if(r[1]>=1&&doneAt<0)doneAt=i;
  i++;
  if(doneAt>=0&&i-doneAt>FPS*3.8)break;
  if(i>FPS*150)break;
}
const wav=await p.evaluate(()=>window.__wav());fs.writeFileSync(path.join(outdir,'audio.wav'),Buffer.from(wav,'base64'));
console.log('frames',i,'secs',(i/FPS).toFixed(1));await b.close();})();
