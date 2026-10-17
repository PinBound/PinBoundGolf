import {randomStream,pathInfo,pointAlong,distance} from './engine.mjs';
import {organicOutline,smoothRoute} from './landforms.mjs';
export const CURRENT_RULES='courses-2';
// Reference men's club/Masters pars; the short courses use the reference front nine.
export const REFERENCE_PARS={
 pines:[4,4,3,4,3,4,5,4,4,3,4,4,4,3,5,4,4,4],
 magnolia:[4,5,4,3,4,3,4,5,4,4,4,3,5,4,5,3,4,4],
 cypress:[4,5,3,4,5,5,3,4,4,5,4,4,4,4,3,3,4,4],
 heath:[4,3,4,4,5,4,3,4,4,4,3,4,4,4,4,5,3,4],
 iron:[4,4,4,5,4,3,4,3,5,4,4,5,3,4,4,3,4,4],
 atlantic:[4,4,5,4,3,4,4,3,5],crystal:[4,4,3,4,4,4,4,5,3],scioto:[4,4,4,3,5,4,5,3,4],
};
const ROUTES={
 'dogleg-left':[[0,0],[.08,.34],[-.8,.61],[-1.25,1]],
 'dogleg-right':[[0,0],[-.08,.34],[.8,.61],[1.25,1]],
 'double-dogleg':[[0,0],[.65,.29],[-.7,.64],[.22,1]],
 'sweep':[[0,0],[.7,.26],[1.05,.56],[.78,1]],
 'serpentine':[[0,0],[-.65,.26],[.65,.6],[0,1]],
 'cape':[[0,0],[-.8,.32],[-1.05,.67],[.2,1]],
 'split-fairway':[[0,0],[-.15,.28],[.15,.67],[.3,1]],
 'crossing':[[0,0],[.18,.3],[-.2,.7],[.3,1]],
 'island-green':[[0,0],[.28,.45],[-.1,1]],
};
export const ROUTE_TYPES=Object.keys(ROUTES);
export function designHole(base,index=0,parOverride){
 const r=randomStream('design-2|'+base.seed),par=parOverride??REFERENCE_PARS[base.courseId]?.[index]??base.par;
 const type=ROUTE_TYPES[(index+(['coast','dunes'].includes(base.theme)?5:base.theme==='heath'?3:0))%ROUTE_TYPES.length];
 const yards=par===base.par?base.yards:par===3?Math.round(145+r()*65):par===5?Math.round(515+r()*70):Math.round(360+r()*95);
 const amplitude=(par===3?22:par===5?100:78)*(r()<.5?-1:1),anchors=ROUTES[type].map(([x,y])=>({x:x*amplitude,y:y*yards}));
 let path=smoothRoute(anchors);const factor=yards/pathInfo(path.at(-1),path).total;path=path.map(p=>({x:p.x*factor,y:p.y*factor}));
 const green={...path.at(-1)},gr=base.greenRadius,seed=base.seed+'|design-2',water=[],bunkers=[];
 const title=base.courseId?base.title:({'dogleg-left':'Left Shoulder','dogleg-right':'Right Shoulder','double-dogleg':'Twin Turns',sweep:'Crescent Run',serpentine:'The Serpentine',cape:'Waters Edge','split-fairway':'Two Ways',crossing:'Creek Crossing','island-green':'Island Landing'})[type];
 const h={...base,title,seed,par,yards,path,green,pin:{x:green.x+(r()-.5)*gr*.55,y:green.y+(r()-.5)*gr*.55},routing:type,rules:CURRENT_RULES,water,bunkers};
 const station=t=>pointAlong(path,yards*t),shape=(p,rx,ry,rot=0)=>({...p,rx,ry,rot,points:organicOutline({...p,rx,ry,rot},r()*6.28)});
 for(const [i,t]of(par===3?[.91,1]:[.42,.65,.94,1]).entries()){const p=station(t),side=i%2?1:-1;bunkers.push(shape({x:p.x+side*(t>.85?gr+7:h.fairway+8),y:p.y},7+r()*5,9+r()*7,r()));}
 if(type==='cape'){const p=station(.57);water.push(shape({x:p.x-amplitude*.65,y:p.y},Math.abs(amplitude)*.66,par===3?20:yards*.15,-.2));}
 else if(type==='crossing'){const p=station(.56);water.push(shape(p,h.deep+9,par===3?9:13,.09));}
 else if(type==='island-green'){const p={x:green.x,y:green.y};water.push(shape(p,gr+10,gr+13,.2));h.islandGreen=true;}
 else if(index%3===0){const p=station(.6);water.push(shape({x:p.x+h.fairway+21,y:p.y},15,26,.4));}
 if(type==='split-fairway'){
   const start=station(.32),end=station(.64);h.fairwayIsland={...start,rx:7,ry:distance(start,end)/2};h.fairwayIsland.y=(start.y+end.y)/2;h.fairwayIsland.points=organicOutline(h.fairwayIsland,r()*6.28);
 }
 h.notes=({cape:'Choose the safer route around the inlet or challenge the water for a shorter approach.',crossing:'Lay up short of the creek or carry it cleanly. Ground beyond the crossing is playable.', 'island-green':'Find a comfortable carry to the island. The green is safe; water surrounds its collar.','split-fairway':'Choose either side of the central rough island. The wider line leaves a longer approach.','double-dogleg':'Plan two landing zones. The second turn rewards placement over raw distance.',serpentine:'The fairway changes direction twice. Choose your landing area before choosing a club.'})[type]||base.notes;
 return h;
}
export function courseStats(id,legacy,rules=CURRENT_RULES){const pars=rules===CURRENT_RULES?REFERENCE_PARS[id]:null;return{...legacy,...(pars?{par:pars.reduce((a,b)=>a+b,0),parThrees:pars.filter(p=>p===3).length,parFours:pars.filter(p=>p===4).length,parFives:pars.filter(p=>p===5).length}:{})};}
export function edgeCartPath(h,side=1){const total=pathInfo(h.green,h.path).total,out=[];for(let at=12;at<total-15;at+=5){const p=pointAlong(h.path,at),a=pointAlong(h.path,at-3),b=pointAlong(h.path,at+3),len=distance(a,b)||1,normal={x:(b.y-a.y)/len*side,y:-(b.x-a.x)/len*side};let q={x:p.x+normal.x*(h.rough+5),y:p.y+normal.y*(h.rough+5)};for(let n=0;n<15&&pathInfo(q,h.path).distance<h.rough+2;n++){q.x+=normal.x*2;q.y+=normal.y*2;}out.push(q);}return out;}
export function modernObstacles(h,index=0){
 const r=randomStream('features-2|'+h.seed),length=pathInfo(h.green,h.path).total,at=t=>pointAlong(h.path,length*t),side=r()<.5?-1:1;
 const kinds=['animal','cart','gust','portal','lava'],selected=[kinds[index%5],...(index%3===0?[kinds[(index+2)%5]]:[])];
 const features=selected.map((kind,i)=>{const p=at(.43+i*.22);
 if(kind==='cart')return{kind,path:edgeCartPath(h,side),width:3};
 if(kind==='gust'){const xs=h.path.map(p=>p.x),minX=Math.min(...xs)-h.deep-20,maxX=Math.max(...xs)+h.deep+20,half=19;return{kind,x:(minX+maxX)/2,y:p.y,rx:(maxX-minX)/2,ry:half,rot:0,angle:side*Math.PI/2,strength:28+r()*10,bar:true,points:[{x:minX,y:p.y-half},{x:maxX,y:p.y-half},{x:maxX,y:p.y+half},{x:minX,y:p.y+half}]};}
 if(kind==='portal'){const exit=at(.84);return{kind,...p,radius:8,exit:{x:exit.x+side*4,y:exit.y},exitRadius:4};}
 if(kind==='lava'){const e={kind,x:p.x+side*(h.fairway+7),y:p.y,rx:15,ry:25,rot:side*.5};return{...e,points:organicOutline(e,r()*6.28)};}
 const species=['dunes','garden'].includes(h.theme)?'gator':['coast','bluffs'].includes(h.theme)?'gull':'squirrel';return{kind,x:p.x+side*7,y:p.y,radius:8,species,den:{x:p.x-side*(h.fairway+8),y:p.y+10}};
 });return{...h,features};
}
