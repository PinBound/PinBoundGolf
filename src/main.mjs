import {VERSION,CLUBS,LIES,openingHole,generatePractice,newState,applyShot,replay,distance,autoClub,direction,radians,pointAlong,pathInfo,powerFor,scoreLabel,clamp} from './engine.mjs';
import {CourseRenderer} from './render.mjs';
import {Sound} from './audio.mjs';
const $=id=>document.getElementById(id),SAVE='pinbound/prototype/save-v1',PREFS='pinbound/preferences-v1',BOARD='pinbound/pine-barrens-01/records-v1';
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{toast('Storage unavailable · progress stays in this tab');return false;}}
const storedPrefs=read(PREFS,{}),prefs={music:clamp(Number(storedPrefs.music??.3),0,1),effects:clamp(Number(storedPrefs.effects??.65),0,1),muted:!!storedPrefs.muted};
const audio=new Sound(prefs,message=>{$('audio-warning').textContent=message;});
let state={...newState(openingHole()),attemptId:crypto.randomUUID()},recorded=false,toastUntil=0,boardReturn='menu';
const ui={phase:'menu',club:0,center:0,angle:0,power:0,started:0,animation:null,putting:null};
const renderer=new CourseRenderer($('course'));
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function toast(message){$('shot-toast').textContent=message;$('shot-toast').classList.add('visible');toastUntil=performance.now()+3400;}
function save(){write(SAVE,{version:VERSION,practice:state.hole.practice,seed:state.hole.seed,shots:state.shots,attemptId:state.attemptId});}
function restore(){
  const s=read(SAVE,null);if(!s||s.version!==VERSION||!Array.isArray(s.shots)||s.shots.length>30)return null;
  try{const h=s.practice?generatePractice(String(s.seed).slice(0,100)):openingHole();return{...replay(h,s.shots),attemptId:typeof s.attemptId==='string'?s.attemptId:crypto.randomUUID()};}catch{return null;}
}
function closeSheets(){for(const d of document.querySelectorAll('dialog[open]'))d.close();}
function show(id){closeSheets();$(id).showModal();}
function getRecords(){const a=read(BOARD,[]);return Array.isArray(a)?a.filter(r=>/^[A-Z]{3}$/.test(r.initials)&&Number.isInteger(r.strokes)&&r.strokes>=1&&r.strokes<=10&&Number.isFinite(r.time)).sort((a,b)=>a.strokes-b.strokes||a.time-b.time).slice(0,10):[];}
function renderRecords(){const body=$('records-body');body.replaceChildren();const list=getRecords();for(let i=0;i<10;i++){const tr=document.createElement('tr'),r=list[i];for(const text of [String(i+1).padStart(2,'0'),r?.initials||'—',r?String(r.strokes):'—',r?scoreLabel(r.strokes,4):'—']){const td=document.createElement('td');td.textContent=text;tr.append(td);}body.append(tr);}}
function decorate(){
  const h=state.hole;$('course-name').innerHTML=h.practice?'Open<br>Country<span>.</span>':'Pine<br>Barrens<span>.</span>';
  $('description').textContent=h.practice?'A new line through familiar country. Read the wind, choose your club, and make this hole your own.':'A line through the pines. Sand at the edges. A green that asks you to land softly.';
  $('par').textContent=h.par;$('yards').textContent=h.yards;$('map-name').textContent=h.title.toUpperCase();$('map-caption').textContent=h.practice?'UNRANKED PRACTICE':'PINE VALLEY, NJ';$('play-mode').textContent=h.practice?'GENERATED PRACTICE':'OPENING HOLE';
  $('wind').textContent=Math.round(h.windSpeed)+' MPH';$('wind-arrow').style.transform=`rotate(${h.windDirection*180/Math.PI}deg)`;$('wind-arrow').textContent='↑';
  $('field-notes').textContent=h.practice?'Seed: '+h.seed+'. This layout and its wind are repeatable. Restarting uses the same shot sequence; generate another hole for a fresh challenge.':'Favor the left half of the landing area. The green releases more than the fairway; leave room for the ball to run.';
  renderer.fit(h);hud();
}
function hud(){
  const h=state.hole;$('lie').textContent=state.complete?'HOLE COMPLETE':state.lie.toUpperCase().replace('DEEP','DEEP ROUGH')+' · SHOT '+(state.shots.length+1);
  const d=distance(state.ball,h.pin);$('distance').textContent=d<12?Math.round(d*3):Math.round(d);document.querySelector('.unit').textContent=d<12?'FT TO PIN':'YDS TO PIN';
  $('strokes').textContent=ui.animation?ui.animation.beforeStrokes+1:state.strokes;
  $('status-label').textContent=ui.phase==='aim'?'CHOOSE YOUR LINE':ui.phase==='power'?'TIME YOUR STRIKE':ui.phase==='flight'?'BALL IN FLIGHT':ui.phase==='putting'?'ON THE GREEN':state.complete?'THE CARD IS IN':'READY AT THE TEE';
  const action=$('action');action.disabled=!['aim','power'].includes(ui.phase);action.replaceChildren(document.createTextNode(ui.phase==='power'?'Swing':ui.phase==='aim'?'Lock the line':ui.phase==='putting'?'Reading the green…':ui.phase==='flight'?'Watch it fly…':'At the clubhouse'));
  const hint=document.createElement('span');hint.textContent='SPACE ↵';action.append(hint);$('undo-aim').hidden=ui.phase!=='power';
  $('instruction').textContent=ui.phase==='power'?'STOP THE METER AT THE GOLD BAND':ui.phase==='aim'?'TAP TO AIM · DRAG TO PAN · PINCH OR SCROLL TO ZOOM':'YOUR SHOT IS ALREADY SAVED';
  for(const b of $('clubs').children){b.disabled=!['aim','power'].includes(ui.phase)||(state.lie==='bunker'&&CLUBS[Number(b.dataset.club)].carry>160);b.setAttribute('aria-pressed',String(Number(b.dataset.club)===ui.club));}
}
function setupAim(keepCenter=false){
  ui.animation=null;ui.putting=null;ui.phase='aim';ui.power=0;const h=state.hole,c=CLUBS[ui.club],factor=(LIES[state.lie]||LIES.fairway).distance;
  if(!keepCenter){const near=pathInfo(state.ball,h.path),target=distance(state.ball,h.pin)<=c.carry*factor*1.06?h.pin:pointAlong(h.path,near.along+c.carry*factor);ui.center=Math.atan2(target.x-state.ball.x,target.y-state.ball.y);}
  ui.angle=ui.center;ui.started=performance.now();const full=c.carry*factor,need=Math.max(2,distance(state.ball,h.pin)-c.roll*.5);
  const approach=need<full*1.05,lo=approach?powerFor(need*.96/full)/1.15:.945/1.15,hi=approach?powerFor(need*1.04/full)/1.15:1/1.15;
  $('target-band').style.left=lo*100+'%';$('target-band').style.width=(hi-lo)*100+'%';$('meter-target').textContent=approach?'PIN DISTANCE':'PURE STRIKE';hud();
}
function start(h){audio.unlock();audio.music('');state={...newState(h),attemptId:crypto.randomUUID()};recorded=false;closeSheets();ui.club=autoClub(h,state.ball,state.lie);decorate();setupAim();save();$('course').focus({preventScroll:true});}
function resume(){const restored=restore();if(!restored)return start(openingHole());state=restored;closeSheets();recorded=false;decorate();audio.unlock();audio.music('');if(state.complete)finish();else{ui.club=autoClub(state.hole,state.ball,state.lie);setupAim();}}
function openMenu(){ui.phase='menu';ui.animation=null;ui.putting=null;hud();$('resume').hidden=!restore();show('clubhouse');audio.music('menu');}
function sample(now){const c=CLUBS[ui.club];if(ui.phase==='aim')ui.angle=ui.center+radians(c.fan)*Math.sin((now-ui.started)/1000*2*Math.PI/c.sweep);if(ui.phase==='power'){const cycle=((now-ui.started)/1000/(c.climb*2))%1;ui.power=(cycle<.5?cycle*2:2-cycle*2)*1.15;}}
function act(){
  if(document.querySelector('dialog[open]'))return;audio.unlock();const now=performance.now();sample(now);
  if(ui.phase==='aim'){ui.phase='power';ui.started=now;ui.power=0;hud();return;}
  if(ui.phase!=='power')return;
  const beforeStrokes=state.strokes,{result,state:next}=applyShot(state,{club:ui.club,aim:ui.angle,power:Math.max(.02,ui.power)});state=next;save();
  ui.phase='flight';ui.animation={result,beforeStrokes,elapsed:0,last:now,flightTime:(reducedMotion?.5:1)*Math.min(1700,620+result.carry*3.2),rollTime:(reducedMotion?.5:1)*Math.min(1500,420+distance(result.land,result.rest)*7)};
  audio.effect('swing-swish',ui.club<3?.75:ui.club<6?1:1.25);toast(result.quality+' · '+Math.round(result.carry)+' yd carry');hud();
}
function landing(){
  const a=ui.animation;ui.animation=null;if(a.result.penalty){toast(a.result.note);impact('water');}else impact(a.result.lie);
  if(state.putts>0){ui.phase='putting';ui.putting={from:{...state.ball},elapsed:0,duration:state.putts*(reducedMotion?550:950),putts:state.putts,sounded:0};toast(state.putts+' automatic '+(state.putts===1?'putt':'putts')+' · '+(state.putts===1?'gold ring':state.putts===2?'pale ring':'outside rings'));hud();}
  else if(state.complete){if(a.result.holed)audio.effect('ball-cup');finish();}
  else{ui.club=autoClub(state.hole,state.ball,state.lie);setupAim();}
}
function impact(surface){
  // Supplemental synthesized terrain contact; supplied effects handle swings/cups.
  if(prefs.muted||!prefs.effects)return;try{const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;impact.context??=new Context();const ctx=impact.context;if(ctx.state==='suspended')ctx.resume();const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(surface==='water'?180:surface==='bunker'?70:110,ctx.currentTime);oscillator.frequency.exponentialRampToValueAtTime(40,ctx.currentTime+.12);gain.gain.setValueAtTime(prefs.effects*.07,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.14);oscillator.connect(gain).connect(ctx.destination);oscillator.start();oscillator.stop(ctx.currentTime+.15);}catch{/* Contact sound must never interrupt play. */}
}
function finish(){
  ui.phase='done';ui.animation=null;ui.putting=null;hud();const h=state.hole,n=state.strokes-h.par;
  $('result-title').textContent=state.strokes===1?'Hole in one.':n<=-2?'Something special.':n===-1?'A birdie to keep.':n===0?'Right on the number.':n===1?'One to build on.':'Another round awaits.';
  $('result-strokes').textContent=state.strokes;$('result-par').textContent=n===0?'EVEN PAR':scoreLabel(state.strokes,h.par)+' TO PAR';$('result-summary').textContent=h.name+' · '+h.title+' · Par '+h.par+' · '+state.shots.length+' '+(state.shots.length===1?'shot':'shots')+(state.putts?' + '+state.putts+' automatic '+(state.putts===1?'putt':'putts'):'')+(state.strokes===10?' · Stroke limit reached.':'.');
  const board=getRecords();recorded=board.some(r=>r.attemptId===state.attemptId);const qualifies=!h.practice&&(board.length<10||state.strokes<board.at(-1).strokes);$('entry-form').hidden=!qualifies;$('save-record').disabled=recorded;$('initials').value='';$('entry-message').textContent=recorded?'Score already posted.':'Opening-hole records are saved on this device.';show('result');audio.music('scorecard');save();
}
for(const [i,c]of CLUBS.entries()){const b=document.createElement('button');b.type='button';b.dataset.club=i;b.title=c.name+' · '+c.carry+' yd carry';b.setAttribute('aria-label',b.title);b.innerHTML=`<strong>${c.id}</strong><small>${c.carry}</small>`;b.addEventListener('click',()=>{if(!['aim','power'].includes(ui.phase))return;ui.club=i;setupAim(true);});$('clubs').append(b);}
$('action').onclick=act;$('undo-aim').onclick=()=>setupAim(true);$('fit-button').onclick=()=>renderer.fit(state.hole);
$('start').onclick=()=>start(openingHole());$('resume').onclick=resume;$('random-practice').onclick=()=>start(generatePractice(crypto.randomUUID().slice(0,8)));
$('menu-button').onclick=openMenu;$('nav-menu').onclick=openMenu;$('result-menu').onclick=openMenu;$('play-again').onclick=()=>start(state.hole);
function settings(){audio.unlock();show('settings');if(ui.phase==='menu')audio.music('menu');}
$('settings-button').onclick=settings;$('menu-help').onclick=settings;
for(const b of document.querySelectorAll('[data-close]'))b.onclick=()=>{const id=b.dataset.close;$(id).close();if(id==='records'){if(boardReturn==='menu')openMenu();else show('result');}if(id==='settings'){if(ui.phase==='menu')openMenu();else if(ui.phase==='power')setupAim(true);}};
$('records-button').onclick=()=>{boardReturn='menu';renderRecords();show('records');};
$('save-record').onclick=()=>{
  const initials=$('initials').value.trim().toUpperCase();if(!/^[A-Z]{3}$/.test(initials)){$('entry-message').textContent='Enter exactly three letters (A–Z).';$('initials').focus();return;}
  if(recorded||state.hole.practice||!state.complete)return;
  if(write(BOARD,[...getRecords(),{initials,strokes:state.strokes,time:Date.now(),attemptId:state.attemptId}].sort((a,b)=>a.strokes-b.strokes||a.time-b.time).slice(0,10))){recorded=true;$('save-record').disabled=true;$('entry-message').textContent='Your initials are on the board.';audio.effect('trophy');renderRecords();boardReturn='result';show('records');}
};
for(const [id,key]of [['music-volume','music'],['effects-volume','effects']]){$(id).value=prefs[key];$(id).oninput=()=>{audio.unlock();prefs[key]=Number($(id).value);audio.volume();write(PREFS,prefs);};}
$('mute').checked=prefs.muted;$('mute').onchange=()=>{prefs.muted=$('mute').checked;audio.volume();write(PREFS,prefs);};
// Pointer capture makes drag, aim and two-finger zoom work on one canvas.
const pointers=new Map();let gesture=null;
$('course').addEventListener('pointerdown',e=>{if(document.querySelector('dialog[open]'))return;audio.unlock();$('course').focus({preventScroll:true});$('course').setPointerCapture(e.pointerId);const rect=$('course').getBoundingClientRect(),p={x:e.clientX-rect.left,y:e.clientY-rect.top};pointers.set(e.pointerId,p);gesture={start:p,last:p,moved:false};if(pointers.size===2){const[a,b]=[...pointers.values()];gesture.pinch=distance(a,b);gesture.moved=true;}});
$('course').addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const rect=$('course').getBoundingClientRect(),p={x:e.clientX-rect.left,y:e.clientY-rect.top},old=pointers.get(e.pointerId);pointers.set(e.pointerId,p);if(pointers.size===2){const[a,b]=[...pointers.values()],d=distance(a,b);if(gesture.pinch)renderer.zoom(d/gesture.pinch,{x:(a.x+b.x)/2,y:(a.y+b.y)/2});gesture.pinch=d;gesture.moved=true;}else if(gesture){if(distance(p,gesture.start)>5)gesture.moved=true;if(gesture.moved)renderer.pan(p.x-old.x,p.y-old.y);}});
function endPointer(e){if(!pointers.has(e.pointerId))return;const p=pointers.get(e.pointerId);if(pointers.size===1&&gesture&&!gesture.moved&&ui.phase==='aim'){const point=renderer.world(p);ui.center=Math.atan2(point.x-state.ball.x,point.y-state.ball.y);ui.started=performance.now();}pointers.delete(e.pointerId);if(!pointers.size)gesture=null;else if(gesture)gesture.moved=true;}
$('course').addEventListener('pointerup',endPointer);$('course').addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);gesture=null;});
$('course').addEventListener('wheel',e=>{if(document.querySelector('dialog[open]'))return;e.preventDefault();const rect=$('course').getBoundingClientRect();renderer.zoom(Math.exp(-e.deltaY*.001),{x:e.clientX-rect.left,y:e.clientY-rect.top});},{passive:false});
document.addEventListener('keydown',e=>{
  if(['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName)&&e.key!=='Escape')return;
  if(document.querySelector('dialog[open]'))return;if(e.repeat)return;
  if(e.code==='Space'||e.key==='Enter'){e.preventDefault();act();}
  else if(e.key==='Escape'&&ui.phase==='power')setupAim(true);
  else if(['ArrowLeft','ArrowRight'].includes(e.key)&&ui.phase==='aim'){e.preventDefault();ui.center+=radians(e.key==='ArrowLeft'?-2:2);ui.started=performance.now();}
  else if(/^[1-9]$/.test(e.key)&&['aim','power'].includes(ui.phase)){const n=Number(e.key)-1;if(state.lie==='bunker'&&CLUBS[n].carry>160)return;ui.club=n;setupAim(true);}
});
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('cancel',e=>{if(dialog.id==='clubhouse'){e.preventDefault();return;}if(dialog.id==='settings'){e.preventDefault();dialog.close();if(ui.phase==='menu')openMenu();else if(ui.phase==='power')setupAim(true);}if(dialog.id==='records'){e.preventDefault();dialog.close();if(boardReturn==='menu')openMenu();else show('result');}if(dialog.id==='result'){e.preventDefault();openMenu();}});
let lastFrame=performance.now();
function frame(now){
  const dt=Math.min(64,Math.max(0,now-lastFrame));lastFrame=now;
  const paused=!!document.querySelector('dialog[open]')||document.hidden;
  if(!paused){sample(now);if(ui.animation){ui.animation.elapsed+=dt;if(ui.animation.elapsed>=ui.animation.flightTime+ui.animation.rollTime)landing();}else if(ui.putting){const a=ui.putting;a.elapsed+=dt;const tick=Math.min(a.putts,Math.floor(a.elapsed/(a.duration/a.putts)));if(tick>a.sounded){a.sounded=tick;audio.effect('swing-swish',1.6);}if(a.elapsed>=a.duration){ui.putting=null;audio.effect('ball-cup');finish();}}}
  const pct=clamp(ui.power/1.15*100,0,100);$('needle').style.left=pct+'%';$('power-fill').style.width=pct+'%';$('meter').setAttribute('aria-valuenow',String(Math.round(ui.power*100)));
  if(toastUntil&&now>toastUntil){$('shot-toast').classList.remove('visible');toastUntil=0;}
  renderer.draw(state.hole,state,ui,now);requestAnimationFrame(frame);
}
new ResizeObserver(()=>{renderer.resize();renderer.fit(state.hole);}).observe($('stage'));
document.addEventListener('visibilitychange',()=>{audio.suspend(document.hidden);lastFrame=performance.now();if(!document.hidden&&ui.phase==='power')setupAim(true);});
renderer.resize();decorate();openMenu();requestAnimationFrame(frame);
