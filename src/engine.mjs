// Original implementation calibrated to the researched timing-golf mechanics.
// The pure engine has no DOM, network, wall-clock or storage dependencies.
export const VERSION = 'pinbound-0.1';
export const CLUBS = [
  ['DR','Driver',278,26,1.17,11,2.05,1.32],['3W','3 Wood',243,20,1.07,10.2,2.10,1.38],
  ['5W','5 Wood',221,16,.97,9.6,2.15,1.43],['4i','4 Iron',199,13,.90,9,2.20,1.47],
  ['6i','6 Iron',179,10,.80,8.5,2.25,1.51],['8i','8 Iron',156,7,.70,8,2.32,1.55],
  ['PW','Pitching wedge',131,5,.63,7.4,2.38,1.60],['SW','Sand wedge',97,3,.57,6.9,2.44,1.66],
  ['LW','Lob wedge',63,2,.50,6.3,2.50,1.72],
].map(([id,name,carry,roll,disp,fan,sweep,climb])=>({id,name,carry,roll,disp,fan,sweep,climb}));
export const LIES={tee:{distance:1,error:1,roll:1},fairway:{distance:1,error:1,roll:1},green:{distance:1,error:1,roll:1},rough:{distance:.84,error:1.75,roll:.8},deep:{distance:.62,error:2.45,roll:.6},bunker:{distance:.70,error:1.90,roll:.5}};
const ROLL={tee:1.25,fairway:1.45,rough:.30,deep:.14,bunker:.07};
export const radians=degrees=>degrees*Math.PI/180;
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const direction=angle=>({x:Math.sin(angle),y:Math.cos(angle)});
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const quantize=p=>({x:Math.round(p.x*1e4)/1e4,y:Math.round(p.y*1e4)/1e4});
export function randomStream(seed){
  let state=2166136261;
  for(const char of String(seed)) state=Math.imul(state^char.charCodeAt(0),16777619)>>>0;
  return ()=>{state=(state+0x6d2b79f5)>>>0;let x=Math.imul(state^(state>>>15),state|1);x^=x+Math.imul(x^(x>>>7),x|61);return((x^(x>>>14))>>>0)/4294967296;};
}
export function pathInfo(point,path){
  let closest={distance:Infinity,along:0,point:path[0],total:0},walked=0;
  for(let i=1;i<path.length;i++){
    const a=path[i-1],b=path[i],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
    const t=clamp(((point.x-a.x)*dx+(point.y-a.y)*dy)/(len*len||1),0,1);
    const q={x:a.x+dx*t,y:a.y+dy*t},d=distance(point,q);
    if(d<closest.distance)closest={distance:d,along:walked+t*len,point:q,total:0};
    walked+=len;
  }
  closest.total=walked;return closest;
}
export function pointAlong(path,at){
  for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],len=distance(a,b);if(at<=len)return{x:a.x+(b.x-a.x)*Math.max(0,at)/len,y:a.y+(b.y-a.y)*Math.max(0,at)/len};at-=len;}
  return {...path.at(-1)};
}
export function inEllipse(p,e){const c=Math.cos(e.rot||0),s=Math.sin(e.rot||0),dx=p.x-e.x,dy=p.y-e.y;return((dx*c+dy*s)/e.rx)**2+((-dx*s+dy*c)/e.ry)**2<=1;}
export function surfaceAt(h,p){
  if(distance(p,h.green)<=h.greenRadius)return 'green';
  if(h.water.some(e=>inEllipse(p,e)))return 'water';
  if(h.bunkers.some(e=>inEllipse(p,e)))return 'bunker';
  const near=pathInfo(p,h.path);
  if(p.y< -9||near.along>near.total-1&&distance(p,h.green)>h.deep)return 'ob';
  if(near.distance<=h.fairway)return near.along<9?'tee':'fairway';
  if(near.distance<=h.rough)return 'rough';
  return near.distance<=h.deep?'deep':'ob';
}
export function puttRings(h){const scale=Math.max(.62,1-h.slope*3.5);return{one:h.greenRadius*.32*scale,two:h.greenRadius*.78*scale};}
export function puttsAt(h,p){const d=distance(p,h.pin),r=puttRings(h);return d<=r.one?1:d<=r.two?2:3;}
export function carryFactor(power){const p=clamp(power,.02,1.15);const bonus=1+.08*clamp((p-.945)/.055,0,1);return(Math.min(p,1)+Math.max(0,p-1)*.35)*bonus;}
export function powerFor(fraction){let low=.02,high=1.15;for(let i=0;i<35;i++){const m=(low+high)/2;if(carryFactor(m)<fraction)low=m;else high=m;}return(low+high)/2;}
export function strokeCap(h){return Math.max(10,h.par+4);}
export function cupCapture(from,to,pin,remainingRun){
  const dx=to.x-from.x,dy=to.y-from.y,length=dx*dx+dy*dy;
  const t=length?clamp(((pin.x-from.x)*dx+(pin.y-from.y)*dy)/length,0,1):0;
  const closest={x:from.x+dx*t,y:from.y+dy*t};
  return distance(closest,pin)<.36&&remainingRun+distance(closest,to)<1.6;
}
export function openingHole(){return{
  id:'pine-barrens-01',seed:'pine-barrens-01-v1',name:'Pine Barrens',title:'The Needle',location:'Pine Valley, New Jersey',par:4,yards:412,
  path:[{x:0,y:0},{x:14,y:165},{x:-21,y:302},{x:-10,y:408}],fairway:16,rough:32,deep:57,
  green:{x:-10,y:408},greenRadius:15,pin:{x:-14,y:410},slope:.025,slopeDirection:.7,windDirection:1.05,windSpeed:7,
  bunkers:[{x:31,y:218,rx:12,ry:22,rot:-.35},{x:-44,y:305,rx:12,ry:17,rot:.4},{x:-31,y:400,rx:8,ry:12,rot:-.4},{x:10,y:422,rx:9,ry:7,rot:.3}],
  water:[{x:42,y:136,rx:15,ry:28,rot:-.3}],practice:false,
};}
export function generatePractice(seed){
  const r=randomStream('layout|'+seed),par=[3,4,5][Math.floor(r()*3)],length=par===3?140+r()*65:par===4?325+r()*105:475+r()*75;
  const bend=(r()-.5)*75,path=par===3?[{x:0,y:0},{x:bend*.25,y:length}]:[{x:0,y:0},{x:bend,y:length*.52},{x:bend*.4,y:length}];
  const green={...path.at(-1)},gr=12+r()*4,bunkers=[];
  for(let i=0;i<3;i++){const p=pointAlong(path,length*(i===2?.99:.45+r()*.4));bunkers.push({x:p.x+(i%2?1:-1)*(23+r()*9),y:p.y,rx:6+r()*7,ry:8+r()*10,rot:r()*Math.PI});}
  return{id:'practice-'+seed,seed,name:'Open Country',title:['Pine Reach','The Clearing','Sandy Turn'][Math.floor(r()*3)],location:'Generated practice',par,yards:Math.round(length),path,fairway:14+r()*4,rough:34,deep:57,green,greenRadius:gr,pin:{x:green.x+(r()-.5)*gr,y:green.y+(r()-.5)*gr},slope:.01+r()*.034,slopeDirection:r()*Math.PI*2,windDirection:r()*Math.PI*2,windSpeed:3+r()*12,bunkers,water:r()<.55?[{x:pointAlong(path,length*.6).x+34,y:length*.6,rx:12,ry:22,rot:.4}]:[],practice:true};
}
export function newState(h){return{version:VERSION,hole:h,ball:{...h.path[0]},lie:'tee',strokes:0,shots:[],complete:false,putts:0};}
export function autoClub(h,ball,lie){const d=distance(ball,h.pin),factor=(LIES[lie]||LIES.fairway).distance;for(let i=CLUBS.length-1;i>=0;i--)if((lie!=='bunker'||CLUBS[i].carry<=160)&&CLUBS[i].carry*factor+CLUBS[i].roll*.55>=d*.99)return i;return lie==='bunker'?5:0;}
export function resolveShot(h,ball,lie,clubIndex,aim,power,shotIndex){
  if(!Number.isInteger(clubIndex)||!CLUBS[clubIndex]||!Number.isFinite(aim)||!Number.isFinite(power)||power<.02||power>1.15||!Number.isInteger(shotIndex)||shotIndex<0)throw new Error('Invalid shot input');
  const c=CLUBS[clubIndex],l=LIES[lie]||LIES.fairway,r=randomStream(`${h.seed}|${shotIndex}`),noise=()=> (r()+r()+r()-1.5)*2;
  const pure=power>=.945&&power<=1,over=Math.max(0,power-1),factor=carryFactor(power);
  const angle=aim+radians(noise()*c.disp*l.error*(pure?.62:1)+(over?(r()<.5?-1:1)*over*75*(.45+r()*.55):0));
  const forward=direction(angle),right={x:forward.y,y:-forward.x},wind=direction(h.windDirection);
  const tail=(wind.x*forward.x+wind.y*forward.y)*h.windSpeed,cross=(wind.x*right.x+wind.y*right.y)*h.windSpeed;
  let carry=c.carry*l.distance*factor*(1+tail*.0042);if(lie==='bunker')carry=Math.min(160,carry);
  const near=lie==='tee'?1:Math.min(1,carry/80),error=2.2*l.error*(pure?.72:1),weight=Math.max(2.2*(pure?.72:1)*l.error**.4,error*(.4+.6*near));
  const along=Math.max(-carry*.5,noise()*weight),side=clamp(noise()*weight*(.6+.4*near),-(carry*.3+1.5),carry*.3+1.5)+cross*carry*.0032;
  const land={x:ball.x+forward.x*(carry+along)+right.x*side,y:ball.y+forward.y*(carry+along)+right.y*side};
  let budget=Math.max(0,c.roll*l.roll*(.7+factor*.4)*(1+tail*.006)),rest={...land},path=[{...land}],surface=surfaceAt(h,land),holed=false;
  if(surface!=='water'&&surface!=='ob')for(let i=0;i<300;i++){
    const step=1.5,q={x:rest.x+forward.x*step,y:rest.y+forward.y*step},next=surfaceAt(h,q);
    const resistance=next==='green'?.85+1.55*Math.min(1,budget/26)**.75:ROLL[next]||1;
    // Sweep the complete segment: a 1.5 yd rollout step must not jump the cup.
    // Keep fast balls from dropping merely because their line crosses the pin.
    const actualStep=Math.min(step,budget*resistance);
    const end={x:rest.x+forward.x*actualStep,y:rest.y+forward.y*actualStep};
    const endSurface=surfaceAt(h,end);
    if(endSurface==='water'||endSurface==='ob'){rest=end;surface=endSurface;path.push({...end});break;}
    budget=Math.max(0,budget-actualStep/resistance);
    if(cupCapture(rest,end,h.pin,budget*resistance)){
      rest={...h.pin};surface='green';holed=true;path.push({...rest});break;
    }
    rest=end;surface=surfaceAt(h,rest);path.push({...rest});
    if(actualStep<step)break;
  }
  surface=surfaceAt(h,rest);const penalty=surface==='water'||surface==='ob'?1:0,note=surface==='water'?'Water · one penalty stroke':surface==='ob'?'Out of bounds · one penalty stroke':'';
  if(surface==='ob')rest={...ball};
  if(surface==='water'){
    const length=distance(land,ball);let drop={...ball};
    for(let d=2;d<length;d+=2){const t=Math.min(1,(d+2)/length),q={x:land.x+(ball.x-land.x)*t,y:land.y+(ball.y-land.y)*t},sf=surfaceAt(h,q);if(sf!=='water'&&sf!=='ob'){drop=q;break;}}
    rest=drop;
  }
  const restLie=surfaceAt(h,rest);
  return{from:{...ball},land:quantize(land),rest:quantize(rest),path,lie:penalty&&restLie==='ob'?lie:restLie,penalty,note,holed:!penalty&&(holed||distance(rest,h.pin)<.36),pure,quality:over>.005?'Overswing':pure?'Pure strike':power>=.72?'Solid strike':'Controlled',carry:distance(ball,land),travel:distance(ball,rest)};
}
export function applyShot(state,input){
  if(state.complete)throw new Error('Hole already complete');
  const aim=Math.round(input.aim*1e6)/1e6,power=Math.round(input.power*1e6)/1e6;
  const result=resolveShot(state.hole,state.ball,state.lie,input.club,aim,power,state.shots.length);
  let strokes=state.strokes+1+result.penalty,putts=0;
  if(!result.holed&&!result.penalty&&result.lie==='green')putts=puttsAt(state.hole,result.rest);
  strokes=Math.min(strokeCap(state.hole),strokes+putts);
  const complete=result.holed||putts>0||strokes>=strokeCap(state.hole);
  return{result,state:{...state,ball:result.rest,lie:result.lie,strokes,putts,complete,shots:[...state.shots,{club:input.club,aim,power}]}};
}
export function replay(hole,shots){let state=newState(hole);for(const input of shots)state=applyShot(state,input).state;return state;}
export function scoreLabel(strokes,par){const n=strokes-par;return n===0?'E':n>0?'+'+n:'−'+Math.abs(n);}
