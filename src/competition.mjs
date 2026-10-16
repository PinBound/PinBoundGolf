import {randomStream,strokeCap,scoreLabel} from './engine.mjs';
import {COURSES,courseHoles,dailyHoles,practiceHole,courseHole,CONTENT_VERSION} from './courses.mjs';
export const ROUND_VERSION='rounds-1';
export function roundSlot(s){const player=s.profileId||'guest';return s.mode==='daily'?`daily|${player}|${s.day}`:s.mode==='season'?`season|${player}|${s.seasonId}|${s.eventIndex}`:s.mode==='course'?`course|${player}|${s.courseId}`:`practice|${player}`;}
export function holesFor(spec){
  if(spec.mode==='daily')return dailyHoles(spec.day);
  if(spec.mode==='practice')return spec.day?dailyHoles(spec.day).map(h=>({...h,practice:true})):spec.courseId?[{...courseHole(spec.courseId,spec.holeIndex),practice:true}]:[practiceHole(spec.seed)];
  if(spec.mode==='course'||spec.mode==='season')return courseHoles(spec.courseId);
  throw Error('Unknown game mode');
}
export function createRound(spec,id){const holes=holesFor(spec);return{version:ROUND_VERSION,contentVersion:CONTENT_VERSION,id,spec:{...spec},index:0,cards:[],currentShots:[],complete:false,par:holes.reduce((n,h)=>n+h.par,0)};}
export function recordHole(round,holeState){
  if(round.complete||!holeState.complete)throw Error('Hole is not ready to advance');
  const holes=holesFor(round.spec),h=holes[round.index];if(!h||h.seed!==holeState.hole.seed)throw Error('Hole identity mismatch');
  const card={number:round.index+1,par:h.par,strokes:holeState.strokes,putts:holeState.putts,shots:holeState.shots};
  const cards=[...round.cards,card];return{...round,cards,index:cards.length,currentShots:[],complete:cards.length===holes.length};
}
export const totalScore=round=>round.cards.reduce((n,c)=>n+c.strokes,0);
export function validRecords(records,par,max){return(Array.isArray(records)?records:[]).filter(r=>r&&/^[A-Z]{3}$/.test(r.initials)&&Number.isInteger(r.strokes)&&r.strokes>=Math.ceil(max/10)&&r.strokes<=max&&Number.isFinite(r.time)&&r.par===par&&typeof r.attemptId==='string').sort((a,b)=>a.strokes-b.strokes||a.time-b.time).slice(0,10);}
export function enterRecord(records,entry,par,max){if(!/^[A-Z]{3}$/.test(entry.initials)||entry.par!==par||!Number.isInteger(entry.strokes)||entry.strokes<Math.ceil(max/10)||entry.strokes>max||!Number.isFinite(entry.time)||typeof entry.attemptId!=='string')throw Error('Invalid leaderboard entry');const list=validRecords(records,par,max);if(list.some(r=>r.attemptId===entry.attemptId))return list;return validRecords([...list,entry],par,max);}
export const roundMaximum=spec=>holesFor(spec).reduce((n,h)=>n+strokeCap(h),0);
export const SCHEDULE=[
  {courseId:'atlantic',name:'Atlantic Invitational'}, {courseId:'crystal',name:'Crystal Bluff Classic'},
  {courseId:'scioto',name:'Scioto Garden Open'}, {courseId:'magnolia',name:'Magnolia Masters Cup'},
  {courseId:'cypress',name:'Pacific Championship'}, {courseId:'heath',name:'Windward Open'},
  {courseId:'iron',name:'Iron Ridge Challenge'}, {courseId:'pines',name:'Pine Barrens Championship'},
];
const NAMES=['Adrian Vale','Miles Mercer','Theo Bennett','Julian Cross','Elliot Hayes','Nolan Reed','Owen Sinclair','Caleb Stone','Jasper Wells','Felix Archer','Dylan Hart','Silas Brooks','Evan Cole','Lucas Ward','Marco Lane','Finn Ellis','Leo Grant','Rowan Blake','Hugo Quinn','Wyatt Chase','Noah Burke','Isaac Rhodes','Arlo West'];
export function newSeason(profileId,id){return{id,profileId,eventIndex:0,history:[],complete:false,champion:false,qualified:null,pros:NAMES.map((name,i)=>({id:'pro-'+i,name,skill:.54+(i%8)*.055,points:0})),playerPoints:0};}
export function seasonStandings(s,profile){return[...s.pros,{id:'player',name:profile.name,points:s.playerPoints}].map(e=>({...e,strokes:s.history.filter(h=>h.eventIndex<7).reduce((n,h)=>n+(h.entries.find(q=>q.id===e.id)?.total||0),0)})).sort((a,b)=>b.points-a.points||a.strokes-b.strokes||a.name.localeCompare(b.name));}
export function eventField(s,profile){if(s.eventIndex!==7)return['player',...s.pros.map(p=>p.id)];return seasonStandings(s,profile).slice(0,12).map(p=>p.id);}
export function aiCard(s,eventIndex,pro){
  const course=COURSES.find(c=>c.id===SCHEDULE[eventIndex].courseId),holes=courseHoles(course.id),r=randomStream(`${s.id}|event-${eventIndex}|${pro.id}`);
  return holes.map(h=>{const x=r(),eagle=h.par===5?.012+pro.skill*.012:h.par===4?.002:.0003,birdie=eagle+pro.skill*.32*(1-(course.rating-2)*.1),par=.80+pro.skill*.09-(course.rating-2)*.02;
    const offset=x<eagle?-2:x<birdie?-1:x<par?0:x<.97?1:x<.997?2:3;return Math.max(1,Math.min(strokeCap(h),h.par+offset));});
}
export function settleEvent(s,profile,playerCard){
  if(s.complete||s.profileId!==profile.id)throw Error('Season is unavailable');
  const index=s.eventIndex,holes=courseHoles(SCHEDULE[index].courseId),field=eventField(s,profile),playing=field.includes('player');
  if(playing&&(!Array.isArray(playerCard)||playerCard.length!==holes.length||playerCard.some((n,i)=>!Number.isInteger(n)||n<1||n>strokeCap(holes[i]))))throw Error('Incomplete tournament card');
  if(!playing&&playerCard!==null)throw Error('Player did not qualify');
  const entries=s.pros.filter(p=>field.includes(p.id)).map(p=>({id:p.id,name:p.name,scores:aiCard(s,index,p)}));
  if(playing)entries.push({id:'player',name:profile.name,scores:playerCard});
  for(const e of entries)e.total=e.scores.reduce((a,b)=>a+b,0);
  entries.sort((a,b)=>a.total-b.total||a.name.localeCompare(b.name));
  for(const e of entries){e.place=1+entries.filter(other=>other.total<e.total).length;e.points=index===7?0:Math.max(5,110-(e.place-1)*5);e.toPar=scoreLabel(e.total,holes.reduce((n,h)=>n+h.par,0));}
  const history=[...s.history,{eventIndex:index,name:SCHEDULE[index].name,courseId:SCHEDULE[index].courseId,entries,roundId:null}];
  const next={...s,history,eventIndex:index+1,pros:s.pros.map(p=>({...p,points:p.points+(entries.find(e=>e.id===p.id)?.points||0)})),playerPoints:s.playerPoints+(entries.find(e=>e.id==='player')?.points||0),complete:index===7,champion:index===7&&entries.some(e=>e.id==='player'&&e.place===1)};
  if(index===6)next.qualified=eventField({...next,eventIndex:7},profile).includes('player');
  return next;
}
export function courseSummary(id){const c=COURSES.find(c=>c.id===id);return c?`${c.count} holes · Par ${c.par} · ${c.difficulty}`:'';}
