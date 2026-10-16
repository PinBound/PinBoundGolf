import {COURSES,courseById,CONTENT_VERSION} from './courses.mjs';
import {newSeason,settleEvent,createRound,holesFor,recordHole,validRecords,roundMaximum,roundSlot,ROUND_VERSION,SCHEDULE} from './competition.mjs';
import {replay} from './engine.mjs';
export const STORE_KEY='pinbound/full-game/v1';
export function blankStore(){return{version:1,profiles:[],activeProfile:null,boards:{},rounds:{},seasons:{},daily:{},lastRoundKey:null,completed:{}};}
export function cleanProfile(p){return p&&typeof p.id==='string'&&/^[\w-]{1,80}$/.test(p.id)&&!['__proto__','prototype','constructor'].includes(p.id)&&typeof p.name==='string'&&p.name.trim().length>=2&&p.name.length<=24&&/^[A-Z]{3}$/.test(p.initials)?{id:p.id,name:p.name.trim(),initials:p.initials}:null;}
export function validateRound(value){
  try{
    if(!value||value.version!==ROUND_VERSION||value.contentVersion!==CONTENT_VERSION||typeof value.id!=='string'||value.id.length>100||!Array.isArray(value.cards)||value.cards.length>18||!Array.isArray(value.currentShots)||value.currentShots.length>30)return null;
    const s=value.spec;if(!s||!['course','daily','practice','season'].includes(s.mode)||s.rules!==undefined&&s.rules!=='hazards-1')return null;
    if(s.mode==='season'&&(!Number.isInteger(s.eventIndex)||s.eventIndex<0||s.eventIndex>7||SCHEDULE[s.eventIndex].courseId!==s.courseId||typeof s.seasonId!=='string'||!/^[\w-]{1,100}$/.test(s.seasonId)))return null;
    if(s.courseId)courseById(s.courseId);if(s.mode==='practice'&&s.courseId&&(!Number.isInteger(s.holeIndex)||s.holeIndex<0||s.holeIndex>=courseById(s.courseId).count))return null;
    if(s.mode==='practice'&&!s.courseId&&!s.day&&(typeof s.seed!=='string'||s.seed.length>80||!/^[\w-]+$/.test(s.seed)))return null;
    let round=createRound(s,value.id),holes=holesFor(s);
    for(const c of value.cards){if(!Array.isArray(c.shots)||c.shots.length>30)return null;const st=replay(holes[round.index],c.shots);round=recordHole(round,st);}
    if(value.awaitingNext&&(!round.cards.length||value.currentShots.length))return null;
    if(!round.complete)replay(holes[round.index],value.currentShots);else if(value.currentShots.length)return null;
    return{...round,currentShots:round.complete?[]:value.currentShots,awaitingNext:!!value.awaitingNext,accounted:!!value.accounted};
  }catch{return null;}
}
export function sanitizeStore(raw){
  const out=blankStore();if(!raw||raw.version!==1)return out;
  out.profiles=(Array.isArray(raw.profiles)?raw.profiles:[]).map(cleanProfile).filter(Boolean).filter((p,i,a)=>a.findIndex(q=>q.id===p.id)===i).slice(0,20);
  out.activeProfile=out.profiles.some(p=>p.id===raw.activeProfile)?raw.activeProfile:out.profiles[0]?.id||null;
  for(const c of COURSES)for(const key of [c.id,c.id+':hazards-1'])out.boards[key]=validRecords(raw.boards?.[key],c.par,roundMaximum({mode:'course',courseId:c.id}));
  for(const value of Object.values(raw.rounds||{}).slice(-200)){const round=validateRound(value);if(round&&out.profiles.some(p=>p.id===round.spec.profileId))out.rounds[roundSlot(round.spec)]=round;}
  for(const p of out.profiles){const v=raw.seasons?.[p.id];if(!v||typeof v.id!=='string'||v.id.length>100||!Array.isArray(v.history)||v.history.length>8)continue;try{let s=newSeason(p.id,v.id);for(const event of v.history){const card=event.entries?.find(e=>e.id==='player')?.scores??null;s=settleEvent(s,p,card);s.history.at(-1).roundId=event.roundId;}out.seasons[p.id]=s;}catch{/* Ignore incompatible or corrupt career progress. */}}
  for(const value of Object.values(raw.daily||{}).slice(-90)){const round=validateRound(value);if(round?.complete&&round.spec.mode==='daily'&&out.profiles.some(p=>p.id===round.spec.profileId))out.daily[roundSlot(round.spec)]=round;}
  for(const [id,entry]of Object.entries(raw.completed||{}).slice(-500))if(/^[\w-]{1,100}$/.test(id)&&entry&&out.profiles.some(p=>p.id===entry.profileId)&&Number.isInteger(entry.strokes)&&entry.strokes>0&&entry.strokes<=200&&Number.isInteger(entry.par)&&entry.par>0&&entry.par<=100)out.completed[id]={profileId:entry.profileId,strokes:entry.strokes,par:entry.par,courseId:entry.courseId||null};
  out.lastRoundKey=Object.keys(out.rounds).find(key=>out.rounds[key].id===raw.rounds?.[raw.lastRoundKey]?.id)||null;return out;
}
export function mergeBackups(current,incoming){
  const other=sanitizeStore(incoming),combined={...current,lastRoundKey:current.lastRoundKey||other.lastRoundKey,profiles:[...current.profiles,...other.profiles.filter(p=>!current.profiles.some(q=>q.id===p.id))].slice(0,20),boards:{...current.boards},rounds:{...other.rounds,...current.rounds},seasons:{...other.seasons,...current.seasons},daily:{...other.daily,...current.daily},completed:{...other.completed,...current.completed}};
  for(const c of COURSES)for(const key of [c.id,c.id+':hazards-1']){const entries=[...(current.boards[key]||[]),...(other.boards[key]||[])],unique=entries.filter((r,i)=>entries.findIndex(q=>q.attemptId===r.attemptId)===i);combined.boards[key]=validRecords(unique,c.par,roundMaximum({mode:'course',courseId:c.id}));}
  for(const p of combined.profiles){const a=current.seasons[p.id],b=other.seasons[p.id];if(a&&b&&a.id===b.id&&b.history.length>a.history.length)combined.seasons[p.id]=b;}
  return sanitizeStore(combined);
}
