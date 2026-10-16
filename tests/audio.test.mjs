import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Sound,ambientTracks} from '../src/audio.mjs';
class AudioStub{
  constructor(url){this.src=String(url);this.paused=true;this.volume=1;}
  play(){this.paused=false;return Promise.resolve();}
  pause(){this.paused=true;}
}
globalThis.Audio=AudioStub;
const prefs=()=>({music:.3,effects:.65,ambient:.2,muted:false});
test('recorded ambience follows environment, avoids duplicate layers and follows menu/visibility/mute',t=>{
 
 const p=prefs(),s=new Sound(p);s.ambience('forest');assert.equal(s.ambientLayers.size,0);s.unlock();s.ambience('forest');assert.deepEqual(ambientTracks('forest').map(t=>t.name),['gentle-breeze','forest-birds']);const breeze=s.ambientLayers.get('gentle-breeze').audio,birds=s.ambientLayers.get('forest-birds').audio;s.ambience('garden');assert.equal(s.ambientLayers.get('gentle-breeze').audio,breeze);assert.equal(s.ambientLayers.size,2);s.ambience('coast');assert.equal(birds.paused,true);assert.equal(s.ambientLayers.has('forest-birds'),false);const surf=s.ambientLayers.get('ocean-coast').audio;assert.equal(surf.loop,true);assert.equal(surf.paused,false);p.muted=true;s.volume();assert.equal(surf.volume,0);p.muted=false;s.volume();assert.equal(surf.volume,.1);s.suspend(true);assert.equal(surf.paused,true);s.suspend(false);assert.equal(surf.paused,false);s.music('menu');assert.equal(surf.paused,true);s.suspend(true);s.suspend(false);assert.equal(surf.paused,true);assert.equal(s.track.paused,false);
});
test('only the holing putt gets putt-and-score, with effects-level controls',t=>{
 const p=prefs(),s=new Sound(p);s.unlock();const ordinary=s.putt(false),last=s.putt(true);assert.ok(ordinary.src.endsWith('/audio/swing-contact.mp3'));assert.ok(last.src.endsWith('/audio/putt-and-score.mp3'));assert.equal(last.playbackRate,1);assert.equal(last.volume,.65);p.muted=true;s.volume();assert.equal(last.volume,0);assert.equal(s.putt(true),undefined);p.muted=false;s.volume();assert.equal(ordinary.volume,.65*.35);s.suspend(true);assert.equal(last.paused,true);assert.equal(s.effects.size,0);
});
test('swing sequences the new whoosh/contact and cancels delayed contact when hidden',t=>{
 t.mock.timers.enable({apis:['setTimeout']});const s=new Sound(prefs());s.unlock();s.swing();assert.ok([...s.effects.keys()][0].src.endsWith('/audio/swing-whoosh.mp3'));t.mock.timers.tick(120);assert.ok([...s.effects.keys()][1].src.endsWith('/audio/swing-contact.mp3'));assert.equal(s.pending.size,0);s.swing();s.suspend(true);t.mock.timers.tick(200);assert.equal(s.effects.size,0);assert.equal(s.pending.size,0);
});
test('portal and supplied animals get event sounds; drafts, sand and unsupplied animals remain silent',()=>{const s=new Sound(prefs());s.unlock();for(const [event,file]of [[{kind:'portal'},'portal-phase'],[{kind:'animal',species:'squirrel'},'squirrel-squeak'],[{kind:'animal',species:'gator'},'gator-growl']])assert.ok(s.interaction(event).src.endsWith('/audio/'+file+'.mp3'));const count=s.effects.size;for(const event of [{kind:'gust'},{kind:'sand'},{kind:'animal',species:'gull'}])assert.equal(s.interaction(event),undefined);assert.equal(s.effects.size,count);});
