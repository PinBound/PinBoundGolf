import {randomStream,distance,pathInfo,pointAlong,direction,puttRings,LIES,CLUBS} from './engine.mjs';
const TAU=Math.PI*2;
const PALETTES={
  forest:{ground:'#536e51',grain:['#526c4a','#5f7850','#637c54','#6b8258'],deep:'#74865c',rough:'#94a76d',fairway:['#bad096','#c7dca5'],trees:620},
  garden:{ground:'#5f825e',grain:['#638860','#709365','#6c8b5b','#789767'],deep:'#83a06a',rough:'#a5bb7b',fairway:['#bddb98','#d3e5af'],trees:430,flowers:true},
  coast:{ground:'#b5b695',grain:['#a7ae87','#b5b78b','#c3bd99','#acae89'],deep:'#8b9970',rough:'#b0bc80',fairway:['#bfd095','#d6dfaa'],trees:190,sea:true},
  heath:{ground:'#a9a477',grain:['#a2a173','#b2ac7b','#9c9b6d','#b9af82'],deep:'#b9b583',rough:'#b2ba7e',fairway:['#bacd8d','#d2dba3'],trees:30,grass:true},
  park:{ground:'#627958',grain:['#637854','#6e805c','#73875c','#5a7053'],deep:'#80905d',rough:'#a2af73',fairway:['#b5c88b','#c9d89e'],trees:140,furrows:true},
  dunes:{ground:'#c9c49c',grain:['#c3bd93','#cec59c','#babb8f','#d2caa5'],deep:'#c6c694',rough:'#b9c58a',fairway:['#c4d89c','#d9e5b2'],trees:110,sea:true,palms:true},
  bluffs:{ground:'#9ba582',grain:['#9baa86','#abb28e','#b2b596','#95a17d'],deep:'#b6b994',rough:'#a4b985',fairway:['#b5d29e','#cce2b2'],trees:220,sea:true},
  woodland:{ground:'#60805d',grain:['#66865d','#719162','#7c966b','#567653'],deep:'#789b6b',rough:'#a0b97f',fairway:['#bed69e','#d2e4b5'],trees:490,flowers:true},
};
export class CourseRenderer{
  constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.camera={x:0,y:200,scale:1};this.cache=document.createElement('canvas');this.cacheKey='';this.width=1;this.height=1;}
  resize(){const rect=this.canvas.getBoundingClientRect();this.width=rect.width;this.height=rect.height;const dpr=Math.min(2,window.devicePixelRatio||1);this.dpr=dpr;this.canvas.width=Math.round(rect.width*dpr);this.canvas.height=Math.round(rect.height*dpr);this.cacheKey='';}
  fit(h){const xs=h.path.map(p=>p.x),ys=h.path.map(p=>p.y);this.camera={x:(Math.min(...xs)+Math.max(...xs))/2,y:(Math.min(...ys)+Math.max(...ys))/2,scale:Math.min(this.width/(Math.max(...xs)-Math.min(...xs)+180),this.height/(Math.max(...ys)-Math.min(...ys)+110))};}
  screen(p){return{x:this.width/2+(p.x-this.camera.x)*this.camera.scale,y:this.height/2-(p.y-this.camera.y)*this.camera.scale};}
  world(p){return{x:this.camera.x+(p.x-this.width/2)/this.camera.scale,y:this.camera.y-(p.y-this.height/2)/this.camera.scale};}
  pan(dx,dy){this.camera.x-=dx/this.camera.scale;this.camera.y+=dy/this.camera.scale;}
  zoom(factor,at){const before=this.world(at);this.camera.scale=Math.min(12,Math.max(.4,this.camera.scale*factor));const after=this.world(at);this.camera.x+=before.x-after.x;this.camera.y+=before.y-after.y;}
  transform(c){c.setTransform(this.dpr,0,0,this.dpr,0,0);c.translate(this.width/2,this.height/2);c.scale(this.camera.scale,-this.camera.scale);c.translate(-this.camera.x,-this.camera.y);}
  scene(h){
    const key=[h.seed,this.width,this.height,this.camera.x,this.camera.y,this.camera.scale].join('|');if(key===this.cacheKey)return;
    this.cacheKey=key;this.cache.width=this.canvas.width;this.cache.height=this.canvas.height;const c=this.cache.getContext('2d'),palette=PALETTES[h.theme]||PALETTES.forest;c.fillStyle=palette.ground;c.fillRect(0,0,this.cache.width,this.cache.height);this.transform(c);
    const r=randomStream('scenery|'+h.seed),len=pathInfo(h.green,h.path).total;
    const circle=(x,y,rad,color)=>{c.beginPath();c.arc(x,y,rad,0,TAU);c.fillStyle=color;c.fill();};
    const stroke=(width,color)=>{c.beginPath();h.path.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.strokeStyle=color;c.stroke();};
    // Original layered forest canopy and turf; scenery never enters the model.
    for(let i=0;i<1000;i++){const x=(r()-.5)*700,y=r()*(len+240)-120;circle(x,y,2+r()*6,palette.grain[i%4]);}
    if(palette.sea){c.beginPath();c.moveTo(122,-300);for(let y=-300;y<len+300;y+=14)c.lineTo(116+Math.sin(y*.025)*8,y);c.lineTo(900,len+300);c.lineTo(900,-300);c.closePath();c.fillStyle=h.theme==='bluffs'?'#6a9caa':'#528e96';c.fill();c.lineWidth=2;c.strokeStyle='#d4dcc4';c.stroke();c.strokeStyle='#a3c2bd';c.lineWidth=.6;for(let i=0;i<70;i++){const x=140+r()*170,y=r()*(len+200)-100;c.beginPath();c.moveTo(x,y);c.lineTo(x+4+r()*12,y+1);c.stroke();}}
    stroke(h.deep*2,palette.deep);stroke(h.rough*2+5,palette.deep);stroke(h.rough*2,palette.rough);stroke(h.fairway*2+2.5,'#b3c78a');stroke(h.fairway*2,palette.fairway[0]);
    // Alternating mowing segments follow actual centerline geometry.
    for(let at=0;at<len;at+=13){const a=pointAlong(h.path,at),b=pointAlong(h.path,Math.min(len,at+11));c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.lineWidth=h.fairway*1.94;c.lineCap='butt';c.strokeStyle=palette.fairway[Math.floor(at/13)%2];c.stroke();}
    for(const e of h.water){c.save();c.translate(e.x,e.y);c.rotate(e.rot);c.beginPath();c.ellipse(0,0,e.rx+1.8,e.ry+1.8,0,0,TAU);c.fillStyle='#c2bd8c';c.fill();const gradient=c.createLinearGradient(-e.rx,0,e.rx,0);gradient.addColorStop(0,'#398d90');gradient.addColorStop(1,'#236271');c.beginPath();c.ellipse(0,0,e.rx,e.ry,0,0,TAU);c.fillStyle=gradient;c.fill();c.clip();c.lineWidth=.4;c.strokeStyle='#a6c7b7';c.globalAlpha=.45;for(let y=-e.ry;y<e.ry;y+=4){c.beginPath();c.moveTo(-e.rx,y);c.lineTo(e.rx,y+1);c.stroke();}c.restore();}
    for(const e of h.bunkers){c.save();c.translate(e.x,e.y);c.rotate(e.rot);c.beginPath();c.ellipse(.3,-.8,e.rx+1.6,e.ry+1.6,0,0,TAU);c.fillStyle='#71804f';c.fill();c.beginPath();c.ellipse(0,0,e.rx,e.ry,0,0,TAU);c.fillStyle='#e6d6ad';c.fill();c.clip();for(let i=0;i<160;i++){const x=(r()-.5)*e.rx*2,y=(r()-.5)*e.ry*2;circle(x,y,.16,'#bead86');}c.restore();}
    circle(h.green.x+.2,h.green.y-.7,h.greenRadius+1.6,'#6f8d51');circle(h.green.x,h.green.y,h.greenRadius+.6,'#cbdca5');const grad=c.createRadialGradient(h.green.x-4,h.green.y+5,1,h.green.x,h.green.y,h.greenRadius);grad.addColorStop(0,'#d2e3ae');grad.addColorStop(1,'#aac887');circle(h.green.x,h.green.y,h.greenRadius,grad);
    const rings=puttRings(h);for(const [radius,color,dash]of[[rings.two,'#f8f4d5',[1.8,1.8]],[rings.one,'#c6a455',[]]]){c.beginPath();c.arc(h.pin.x,h.pin.y,radius,0,TAU);c.lineWidth=.55;c.strokeStyle=color;c.setLineDash(dash);c.stroke();}c.setLineDash([]);
    const tee=h.path[0];c.fillStyle='#a1bc83';c.fillRect(tee.x-5,tee.y-4,10,8);circle(tee.x-4,tee.y, .65,'#e4e6da');circle(tee.x+4,tee.y,.65,'#e4e6da');
    if(palette.flowers)for(let i=0;i<130;i++){const at=r()*len,p=pointAlong(h.path,at),x=p.x+(h.rough+10+r()*12)*(i%2?1:-1);circle(x,p.y,.7+r(),['#d9b5ae','#e5d5c3','#bd6f7a','#eeead8'][i%4]);}
    if(palette.grass)for(let i=0;i<180;i++){const at=r()*len,p=pointAlong(h.path,at),x=p.x+(h.rough+6+r()*45)*(i%2?1:-1);c.strokeStyle='#85865d';c.lineWidth=.5;c.beginPath();c.moveTo(x,p.y);c.lineTo(x-1,p.y+3);c.moveTo(x,p.y);c.lineTo(x+2,p.y+4);c.stroke();}
    for(let i=0;i<palette.trees;i++){
      const x=(r()-.5)*510,y=r()*(len+140)-70,near=pathInfo({x,y},h.path);if(near.distance<h.rough+4||distance({x,y},h.green)<h.greenRadius+10||h.water.some(e=>distance({x,y},e)<Math.max(e.rx,e.ry)+6))continue;
      if(palette.sea&&x>105)continue;
      const radius=3+r()*6;c.save();c.globalAlpha=.17; c.fillStyle='#122d21';c.beginPath();c.ellipse(x+4,y-5,radius*1.3,radius*.7,-.6,0,TAU);c.fill();c.restore();
      if(palette.palms){c.strokeStyle='#82734e';c.lineWidth=1.4;c.beginPath();c.moveTo(x,y-4);c.quadraticCurveTo(x+2,y,x,y+4);c.stroke();for(let n=0;n<6;n++){const a=n/6*TAU;c.strokeStyle=n%2?'#547946':'#6e8e50';c.lineWidth=1.5;c.beginPath();c.moveTo(x,y+4);c.quadraticCurveTo(x+Math.cos(a)*radius*.8,y+4+Math.sin(a)*radius*.8,x+Math.cos(a)*radius,y+4+Math.sin(a)*radius-2);c.stroke();}continue;}
      const shades=['#304c36','#3d5c3d','#466b46','#365839'];circle(x,y,radius,shades[i%4]);for(let n=0;n<5;n++){const a=n/5*TAU;circle(x+Math.cos(a)*radius*.43,y+Math.sin(a)*radius*.43,radius*.55,n%2?'#4a7046':'#52784b');}circle(x-radius*.17,y+radius*.25,radius*.4,'#658752');
    }
    // Tiny slope strokes explain that the green has a direction without noise.
    c.strokeStyle='#729452';c.lineWidth=.35;c.globalAlpha=.4;for(let i=0;i<6;i++){const a=i/6*TAU,x=h.green.x+Math.cos(a)*h.greenRadius*.8,y=h.green.y+Math.sin(a)*h.greenRadius*.8;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.sin(h.slopeDirection)*2,y+Math.cos(h.slopeDirection)*2);c.stroke();}c.globalAlpha=1;
  }
  draw(h,state,ui,now){
    this.scene(h);const c=this.ctx;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,this.canvas.width,this.canvas.height);c.drawImage(this.cache,0,0);c.setTransform(this.dpr,0,0,this.dpr,0,0);
    // Yardage labels are screen-upright, independent of world transforms.
    c.font='10px ui-monospace, monospace';c.textAlign='center';for(const at of [100,200,300,400]){if(at>h.yards-25)continue;const p=pointAlong(h.path,at),s=this.screen({x:p.x+h.rough+7,y:p.y});c.fillStyle='rgba(242,240,215,.65)';c.fillText(String(at),s.x,s.y);}
    const pin=this.screen(h.pin);c.strokeStyle='#f8f4df';c.lineWidth=1.8;c.beginPath();c.moveTo(pin.x,pin.y);c.lineTo(pin.x,pin.y-23);c.stroke();c.fillStyle='#bf7856';c.beginPath();c.moveTo(pin.x+1,pin.y-23);c.lineTo(pin.x+14,pin.y-18);c.lineTo(pin.x+1,pin.y-14);c.closePath();c.fill();c.fillStyle='#294734';c.beginPath();c.ellipse(pin.x,pin.y+1,3,1.5,0,0,TAU);c.fill();
    let ball=state.ball,height=0;
    if(ui.animation){
      const a=ui.animation,elapsed=ui.animation.elapsed||0,t=Math.min(1,elapsed/a.flightTime),roll=Math.max(0,Math.min(1,(elapsed-a.flightTime)/a.rollTime));
      if(elapsed<a.flightTime){const e=t;ball={x:a.result.from.x+(a.result.land.x-a.result.from.x)*e,y:a.result.from.y+(a.result.land.y-a.result.from.y)*e};height=Math.sin(t*Math.PI)*Math.min(85,22+a.result.carry*.17);}
      else {const path=a.result.path,i=Math.min(path.length-1,Math.floor(roll*(path.length-1)));ball=path[i]||a.result.land;}
      const from=this.screen(a.result.from),to=this.screen(ball);c.beginPath();c.moveTo(from.x,from.y);c.quadraticCurveTo((from.x+to.x)/2,(from.y+to.y)/2-height*.7,to.x,to.y-height);c.strokeStyle='rgba(255,249,214,.6)';c.lineWidth=1.5;c.stroke();
    }else if(ui.putting){const a=ui.putting,t=Math.min(1,a.elapsed/a.duration),ease=1-(1-t)**2.4;ball={x:a.from.x+(h.pin.x-a.from.x)*ease,y:a.from.y+(h.pin.y-a.from.y)*ease};}
    else if(ui.phase==='aim'||ui.phase==='power'){
      const club=CLUBS[ui.club],reach=club.carry*(LIES[state.lie]?.distance||1),d=direction(ui.angle),target={x:ball.x+d.x*reach,y:ball.y+d.y*reach},a=this.screen(ball),b=this.screen(target);
      c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.setLineDash([4,6]);c.strokeStyle='rgba(255,251,219,.78)';c.lineWidth=1.1;c.stroke();c.setLineDash([]);c.beginPath();c.arc(b.x,b.y,8,0,TAU);c.strokeStyle='#f8edbc';c.stroke();c.beginPath();c.moveTo(b.x-12,b.y);c.lineTo(b.x+12,b.y);c.moveTo(b.x,b.y-12);c.lineTo(b.x,b.y+12);c.stroke();
      const text=Math.round(reach)+' yd carry',width=c.measureText(text).width+16;c.fillStyle='#f5f1dd';c.fillRect(b.x-width/2,b.y-32,width,19);c.fillStyle='#334b3c';c.fillText(text,b.x,b.y-19);
    }
    if(state.complete&&!ui.animation&&!ui.putting&&(state.putts>0||distance(state.ball,h.pin)<.36))ball=h.pin;
    const b=this.screen(ball);c.fillStyle='rgba(16,35,26,.25)';c.beginPath();c.ellipse(b.x+2,b.y+2,4+height*.03,2+height*.01,0,0,TAU);c.fill();c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=5;c.fillStyle='#fffdf0';c.beginPath();c.arc(b.x,b.y-height,3.6,0,TAU);c.fill();c.shadowBlur=0;c.strokeStyle='rgba(255,255,240,.55)';c.beginPath();c.arc(b.x,b.y,9+(now/1000%1)*4,0,TAU);if(!ui.animation&&!ui.putting&&!state.complete)c.stroke();
  }
}
