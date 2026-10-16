// Supplied putt-and-score clip duration, verified from browser metadata.
export const FINAL_PUTT_MS=2592;
const asset=name=>new URL('../audio/'+name+'.mp3',import.meta.url);
export function ambientTracks(theme){return [{name:'gentle-breeze',gain:.55},...(['coast','dunes','bluffs'].includes(theme)?[{name:'ocean-coast',gain:.5}]:[{name:'forest-birds',gain:.3}])];}
export class Sound{
  constructor(prefs,onFailure){this.prefs=prefs;this.onFailure=onFailure;this.track=null;this.kind='';this.unlocked=false;this.effects=new Map();this.ambientLayers=new Map();this.ambientTheme='';this.hidden=false;this.pending=new Set();}
  unlock(){this.unlocked=true;}
  volume(){if(this.track)this.track.volume=this.prefs.muted?0:this.prefs.music;for(const [e,gain]of this.effects)e.volume=this.prefs.muted?0:this.prefs.effects*gain;for(const layer of this.ambientLayers.values())layer.audio.volume=this.prefs.muted?0:(this.prefs.ambient??.2)*layer.gain;}
  play(audio){if(this.hidden||!this.unlocked)return;audio.play().catch(()=>this.onFailure?.('Audio could not play. Check your browser sound settings.'));}
  ambience(theme){
    this.ambientTheme=theme;if(!this.unlocked)return;
    const tracks=ambientTracks(theme),wanted=new Set(tracks.map(t=>t.name));
    for(const [name,layer]of this.ambientLayers)if(!wanted.has(name)){layer.audio.pause();this.ambientLayers.delete(name);}
    for(const {name,gain}of tracks)if(!this.ambientLayers.has(name)){const audio=new Audio(asset(name));audio.loop=true;audio.preload='auto';this.ambientLayers.set(name,{audio,gain});}
    this.volume();for(const {audio}of this.ambientLayers.values())if(audio.paused)this.play(audio);
  }
  stopAmbience(){this.ambientTheme='';for(const {audio}of this.ambientLayers.values())audio.pause();}
  cancelPending(){for(const timer of this.pending)clearTimeout(timer);this.pending.clear();}
  music(kind){
    if(kind){this.stopAmbience();this.cancelPending();}
    if(this.kind===kind&&(this.track||!kind)){if(this.track?.paused)this.play(this.track);return;}
    this.kind=kind;if(this.track){this.track.pause();this.track=null;}
    if(!kind||!this.unlocked)return;
    this.track=new Audio(asset(kind==='menu'?'main-menu':'scorecard'));this.track.loop=true;this.volume();this.play(this.track);
  }
  effect(name,rate=1,gain=1){if(!this.unlocked||this.prefs.muted||!this.prefs.effects||this.hidden)return;const audio=new Audio(asset(name));audio.volume=this.prefs.effects*gain;audio.playbackRate=rate;audio.preservesPitch=false;this.effects.set(audio,gain);const clear=()=>this.effects.delete(audio);audio.onended=clear;audio.onerror=clear;audio.play().catch(clear);return audio;}
  swing(rate=1){this.effect('swing-whoosh',rate,.7);if(!this.unlocked||this.hidden||this.prefs.muted||!this.prefs.effects)return;const timer=setTimeout(()=>{this.pending.delete(timer);this.effect('swing-contact',rate);},120/rate);this.pending.add(timer);}
  putt(final=false){return final?this.effect('putt-and-score'):this.effect('swing-contact',1.35,.35);}
  suspend(hidden){this.hidden=hidden;if(hidden){this.cancelPending();this.track?.pause();for(const {audio}of this.ambientLayers.values())audio.pause();for(const e of this.effects.keys())e.pause();this.effects.clear();}else if(this.unlocked){if(this.ambientTheme)for(const {audio}of this.ambientLayers.values())this.play(audio);if(this.track)this.play(this.track);}}
}
