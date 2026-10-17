import {randomStream,pointAlong,pathInfo,distance,inEllipse} from './engine.mjs';
import {polygonContains} from './landforms.mjs';
export const OBSTACLE_RULES='hazards-1';
export const FEATURE_NAMES={animal:'Wildlife',lava:'Lava',cart:'Cart path',gust:'Wind draft',portal:'Portal'};
// Separate seed stream: adding obstacles never rerolls the original terrain.
export function withObstacles(h,index=0){
  const r=randomStream('obstacles-1|'+h.seed),length=pathInfo(h.green,h.path).total;
  const at=t=>pointAlong(h.path,length*t),side=r()<.5?-1:1;
  const animalKind=['dunes','garden'].includes(h.theme)?'gator':['coast','bluffs'].includes(h.theme)?'gull':'squirrel';
  const kinds=['animal','cart','gust','portal','lava'],primary=kinds[index%5];
  const selected=[primary,...(index%3===0?[kinds[(index+2)%5]]:[])];
  const features=selected.map((kind,i)=>{
    const p=at(h.par===3?.52+i*.16:.48+i*.22);
    if(kind==='cart'){const a=at(.24),b=at(.84);return{kind,path:[{x:a.x-h.rough-5,y:a.y},{x:p.x,y:p.y},{x:b.x+h.rough+5,y:b.y}],width:3};}
    if(kind==='gust')return{kind,...p,rx:15,ry:24,rot:0,angle:r()*Math.PI*2,strength:10+r()*8};
    if(kind==='portal'){const exit=at(.86);return{kind,...p,radius:8,exit:{x:exit.x+side*5,y:exit.y},exitRadius:4};}
    if(kind==='lava')return{kind,x:p.x+side*(h.fairway+3),y:p.y,rx:11,ry:22,rot:side*.35};
    return{kind,x:p.x+side*7,y:p.y,radius:7,species:animalKind,den:{x:p.x-side*(h.fairway+8),y:p.y+10}};
  });
  return{...h,features,rules:OBSTACLE_RULES};
}
export const containsHazard=(p,f)=>f.points?polygonContains(p,f.points):inEllipse(p,f);
export function featureAt(h,p,kind){return(h.features||[]).find(f=>f.kind===kind&&(kind==='cart'?pathInfo(p,f.path).distance<=f.width/2:kind==='lava'||kind==='gust'?containsHazard(p,f):distance(p,f)<=f.radius));}
export function crossedZone(a,b,f){const steps=Math.max(1,Math.ceil(distance(a,b)/3));for(let i=0;i<=steps;i++){const t=i/steps;if(containsHazard({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t},f))return true;}return false;}
