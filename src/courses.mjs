import {openingHole,generatePractice,randomStream,pointAlong,pathInfo} from './engine.mjs';
export const CONTENT_VERSION='courses-1';
// Fixed, authored hole briefs. Length, par, routing bend and name never reroll.
// Deterministic detailing fills bunkers, pin offsets, wind and scenery.
const briefs={
  pines:[['The Needle',4,412,14],['Sand Lantern',4,376,-42],['Pine Window',3,173,6],['Longleaf',5,544,51],['The Divide',4,438,-36],['Pitch Pine',3,154,-9],['Timber Bend',4,401,58],['Cinder Trail',5,567,-48],['Homeward Sand',4,426,24],['Quiet Hollow',4,365,-28],['The Cathedral',5,553,43],['Sandy Shelf',3,191,11],['Lost Creek',4,447,-54],['Pine Echo',4,389,32],['The Carry',3,208,-12],['Needle Thread',4,459,49],['Long Way Home',5,581,-38],['Founders Walk',4,432,27]],
  magnolia:[['Morning Dew',4,394,-24],['Golden Bellflower',5,526,43],['Garden Gate',4,351,-35],['Creekside',3,177,8],['The Terrace',4,429,39],['Dogwood Rise',3,160,-9],['Azalea Turn',4,407,-46],['Red Clay',5,558,32],['Veranda',4,436,-22],['Magnolia Bend',4,453,-51],['Stillwater',4,411,35],['The Footbridge',3,151,0],['Orchard Run',5,510,48],['Green Chapel',4,397,-34],['Last Light',5,539,27],['Reflection',3,183,-7],['Peach Hollow',4,419,38],['Southern Home',4,444,-29]],
  cypress:[['Coastal Welcome',4,386,24],['Monterey Pines',5,532,-43],['Fog Line',3,167,5],['Cypress Gate',4,423,44],['The Headland',4,408,-37],['Sea Glass',3,194,-10],['Dune Walk',4,373,33],['Pacific Reach',5,566,-51],['Whitecaps',4,447,29],['The Lookout',4,411,-41],['Salt Air',5,541,46],['Bird Rock',3,182,9],['Whalers Turn',4,434,-52],['Cypress Shadow',4,391,28],['The Channel',3,213,-6],['Ocean Window',4,459,39],['Far Horizon',5,579,-45],['Sunset Point',4,426,34]],
  heath:[['Open Country',4,409,-28],['Windmill Rise',4,438,46],['Marram',3,186,9],['Long Island',5,554,-39],['Sandy Knoll',4,381,33],['Heath Hollow',3,166,-5],['The Shoulder',4,447,-52],['Atlantic Walk',5,578,41],['Clubhouse Ridge',4,413,-24],['The Expanse',4,441,36],['Gorse Line',5,547,-48],['Short Ridge',3,157,8],['Crosswind',4,463,43],['Fescue Turn',4,398,-32],['The Summit',3,203,-10],['Windward',4,452,49],['Heathland Run',5,565,-34],['Last Ridge',4,439,29]],
  iron:[['Steel Welcome',4,422,21],['The Furrow',4,449,-43],['Rail Cut',3,192,5],['Long Haul',5,581,38],['The Anvil',4,433,-35],['Short Steel',3,168,-8],['Foundry Bend',4,461,44],['Furnace Run',5,556,-42],['The Approach',4,409,27],['Iron Gate',4,452,-31],['Hammer Line',5,570,47],['Plateau',3,214,-5],['Crosscut',4,438,-48],['The Rivet',4,383,26],['The Shelf',3,178,7],['Rolling Steel',4,470,-40],['Last Shift',5,589,37],['Iron Crown',4,455,-24]],
  atlantic:[['Sea Breeze',4,369,26],['Palmetto',3,156,-5],['Dune Passage',5,510,-37],['Juno Rise',4,391,35],['The Inlet',3,182,7],['Sand Sail',4,414,-41],['Palm Shadow',4,377,28],['Atlantic Run',5,538,-32],['Home on the Dunes',4,403,21]],
  crystal:[['Orchard Bluff',4,387,-29],['Blue Horizon',3,174,8],['The Saddle',4,421,41],['Dune Country',5,529,-45],['Crystal Window',3,193,-7],['North Wind',4,438,36],['Apple Turn',4,398,-32],['Lakeward',5,551,44],['Bluff House',4,416,-26]],
  scioto:[['Garden Walk',4,375,24],['Buckeye',3,151,-5],['Creek Hollow',5,521,-36],['Stone Crossing',4,402,33],['The Glade',3,178,8],['Meadow Bend',4,426,-39],['Woodland Gate',4,389,29],['Scioto Run',5,546,-34],['The Pavilion',4,413,22]],
};
export const COURSES=[
  {id:'pines',name:'Pine Barrens',location:'Pine Valley, NJ',inspiration:'Pine Valley GC',theme:'forest',difficulty:'Championship',rating:4,fw:16,gr:14,wind:7,description:'Pine corridors, expansive sand and precise approaches. The season ends here.',notes:'Stay in the corridor. Sand guards the corners; soft approaches earn the gold ring.'},
  {id:'magnolia',name:'Magnolia Grove',location:'Augusta, GA',inspiration:'Augusta National GC',theme:'garden',difficulty:'Strategic',rating:3,fw:19,gr:15,wind:5,description:'Lush garden fairways, bright flowers and greens that reward thoughtful placement.',notes:'Choose your angle into the green. The inviting fairway does not make the approach automatic.'},
  {id:'cypress',name:'Pacific Cypress',location:'Pebble Beach, CA',inspiration:'Cypress Point Club',theme:'coast',difficulty:'Championship',rating:4,fw:17,gr:13,wind:13,description:'Coastal dunes, cypress groves and steady Pacific wind.',notes:'Read the crosswind before locking your line. Leave room for release on the green.'},
  {id:'heath',name:'Windward Heath',location:'Southampton, NY',inspiration:'Shinnecock Hills GC',theme:'heath',difficulty:'Demanding',rating:4,fw:16,gr:13,wind:14,description:'Open heathland, fescue edges and exposed wind across every shot.',notes:'The wind has the last word. Club up into it and favor the wider side of the landing area.'},
  {id:'iron',name:'Iron Ridge',location:'Oakmont, PA',inspiration:'Oakmont CC',theme:'park',difficulty:'Expert',rating:5,fw:14,gr:12,wind:9,description:'Narrow landing zones, closely placed sand and demanding putting rings.',notes:'Placement beats distance. Narrow fairways and tight rings ask for your most controlled swing.'},
  {id:'atlantic',name:'Atlantic Dunes',location:'Juno Beach, FL',inspiration:'Seminole GC',theme:'dunes',difficulty:'Welcoming',rating:2,fw:21,gr:16,wind:9,description:'Nine sunlit holes through palms, sandy dunes and Atlantic breezes.',notes:'There is room to find your rhythm. Watch the breeze when the hole opens toward the sea.'},
  {id:'crystal',name:'Crystal Bluff',location:'Frankfort, MI',inspiration:'Crystal Downs CC',theme:'bluffs',difficulty:'Strategic',rating:3,fw:18,gr:14,wind:10,description:'Lake-country bluffs, orchard textures and turning fairways.',notes:'Follow the bends rather than forcing a straight line. Keep your approach below full power.'},
  {id:'scioto',name:'Scioto Gardens',location:'Dublin, OH',inspiration:'Muirfield Village GC',theme:'woodland',difficulty:'Welcoming',rating:2,fw:22,gr:16,wind:5,description:'A parkland nine with creekside holes, generous fairways and woodland greens.',notes:'Pick a comfortable number for your approach. The wider fairway rewards a patient layup.'},
].map(c=>({...c,count:briefs[c.id].length,par:briefs[c.id].reduce((n,b)=>n+b[1],0),yards:briefs[c.id].reduce((n,b)=>n+b[2],0)}));
export function courseById(id){const c=COURSES.find(c=>c.id===id);if(!c)throw Error('Unknown course');return c;}
export function courseHole(id,index){
  const c=courseById(id),brief=briefs[id][index];if(!brief)throw Error('Unknown hole');
  if(id==='pines'&&index===0)return{...openingHole(),courseId:id,number:1,theme:c.theme,notes:c.notes};
  const [title,par,yards,bend]=brief,r=randomStream(`${CONTENT_VERSION}|${id}|${index}`);
  const path=par===3?[{x:0,y:0},{x:bend,y:yards}]:[{x:0,y:0},{x:bend*.35,y:yards*.32},{x:bend,y:yards*.63},{x:bend*.48,y:yards}];
  const green={...path.at(-1)},gr=c.gr+(index%3-1)*.6,fw=c.fw+(index%4===0?1:0),bunkers=[];
  const stations=par===3?[.98,1.02]:[.5,.72,.99,1.02];
  for(const [i,t]of stations.entries()){const p=pointAlong(path,Math.min(yards,yards*t)),side=i%2?-1:1;const offset=t>.9?gr+7:fw+8;bunkers.push({x:p.x+offset*side,y:p.y+(i%2?5:-6),rx:6+r()*5+(id==='iron'?2:0),ry:7+r()*8,rot:r()*Math.PI});}
  const water=[];if((['magnolia','scioto'].includes(id)&&index%3===1)||(['cypress','atlantic','crystal'].includes(id)&&index%4===2)||index===12){const p=pointAlong(path,yards*.56);water.push({x:p.x+(index%2?1:-1)*(fw+22),y:p.y,rx:13+r()*7,ry:19+r()*13,rot:r()*.6});}
  return{id:`${id}-${index+1}`,courseId:id,number:index+1,seed:`${CONTENT_VERSION}|${id}|${index}`,name:c.name,title,location:c.location,par,yards,path,fairway:fw,rough:fw+17,deep:fw+42,green,greenRadius:gr,pin:{x:green.x+(r()-.5)*gr*.65,y:green.y+(r()-.5)*gr*.65},slope:.012+c.rating*.004+r()*.009,slopeDirection:r()*Math.PI*2,windDirection:r()*Math.PI*2,windSpeed:c.wind+(r()-.5)*4,bunkers,water,practice:false,theme:c.theme,notes:c.notes};
}
export function courseHoles(id){return Array.from({length:courseById(id).count},(_,i)=>courseHole(id,i));}
export function dailyKey(date=new Date()){return date.toISOString().slice(0,10);}
export function dailyHoles(day){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Number.isFinite(Date.parse(day+'T00:00:00Z'))||new Date(day+'T00:00:00Z').toISOString().slice(0,10)!==day)throw Error('Invalid daily date');
  const r=randomStream('daily|'+day),theme=COURSES[Math.floor(r()*COURSES.length)].theme;
  const mixes=[[3,3,4,4,4,4,4,5,5],[3,3,4,4,4,4,4,4,5],[3,4,4,4,4,4,4,5,5]],pars=mixes[Math.floor(r()*mixes.length)].slice();
  for(let i=pars.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[pars[i],pars[j]]=[pars[j],pars[i]];}
  return pars.map((par,i)=>({...generatePractice(`daily-v1|${day}|${i}`,par),id:`daily-${day}-${i}`,number:i+1,name:'The Daily Nine',location:day+' · UTC',theme,practice:false,notes:'One date. One shared layout. Read each landing zone before committing to your line.'}));
}
export function practiceHole(seed){return{...generatePractice(seed),number:1,theme:COURSES[Math.floor(randomStream('theme|'+seed)()*8)].theme};}
export function validateCourse(h){return h.path.length>=2&&h.yards>100&&h.par>=3&&h.par<=5&&Number.isFinite(pathInfo(h.pin,h.path).total);}
