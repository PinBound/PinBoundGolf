// Isolated browser QA backups. Import only on the separate localhost:4181 origin.
import {mkdir,writeFile} from 'node:fs/promises';
import {newState,applyShot} from '../src/engine.mjs';
import {createRound,holesFor,recordHole,newSeason} from '../src/competition.mjs';
import {blankStore} from '../src/storage.mjs';
const profile={id:'qa-player',name:'QA Golfer',initials:'QAT'},db=blankStore();db.profiles=[profile];db.activeProfile=profile.id;db.seasons[profile.id]=newSeason(profile.id,'qa-season');
for(const spec of [{mode:'course',courseId:'pines'},{mode:'daily',day:'2026-10-16'},{mode:'season',courseId:'atlantic',seasonId:'qa-season',eventIndex:0}]){
  spec.profileId=profile.id;let round=createRound(spec,'qa-'+spec.mode);const holes=holesFor(spec);
  for(let i=0;i<holes.length-1;i++){let s=newState(holes[i]);while(!s.complete)s=applyShot(s,{club:8,aim:0,power:.02}).state;round=recordHole(round,s);}
  let last=newState(holes.at(-1));for(let i=0;i<9;i++)last=applyShot(last,{club:8,aim:0,power:.02}).state;
  round.currentShots=last.shots;const key=spec.mode==='course'?'course|pines':spec.mode==='daily'?'daily|2026-10-16':'season|qa-player|qa-season|0';db.rounds[key]=round;
}
db.lastRoundKey='course|pines';await mkdir(new URL('../.qa/',import.meta.url),{recursive:true});await writeFile(new URL('../.qa/rounds.json',import.meta.url),JSON.stringify(db));console.log('Prepared isolated QA backup: .qa/rounds.json');
