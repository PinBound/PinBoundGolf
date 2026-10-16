export class Sound{
  constructor(prefs,onFailure){this.prefs=prefs;this.onFailure=onFailure;this.track=null;this.kind='';this.unlocked=false;this.effects=new Set();this.hidden=false;}
  unlock(){this.unlocked=true;}
  volume(){if(this.track)this.track.volume=this.prefs.muted?0:this.prefs.music;for(const e of this.effects)e.volume=this.prefs.muted?0:this.prefs.effects;}
  music(kind){
    if(this.kind===kind){if(this.track?.paused&&!this.hidden&&this.unlocked)this.track.play().catch(()=>{});return;}
    this.kind=kind;if(this.track){this.track.pause();this.track=null;}
    if(!kind||!this.unlocked)return;
    this.track=new Audio(new URL('../audio/'+(kind==='menu'?'main-menu.mp3':'scorecard.mp3'),import.meta.url));this.track.loop=true;this.volume();if(!this.hidden)this.track.play().catch(()=>this.onFailure?.('Audio is unavailable. The game will continue silently.'));
  }
  effect(name,rate=1){if(!this.unlocked||this.prefs.muted||!this.prefs.effects||this.hidden)return;const audio=new Audio(new URL('../audio/'+name+'.mp3',import.meta.url));audio.volume=this.prefs.effects;audio.playbackRate=rate;audio.preservesPitch=false;this.effects.add(audio);const clear=()=>this.effects.delete(audio);audio.onended=clear;audio.onerror=clear;audio.play().catch(clear);}
  suspend(hidden){this.hidden=hidden;if(hidden){this.track?.pause();for(const e of this.effects)e.pause();this.effects.clear();}else if(this.track&&this.unlocked)this.track.play().catch(()=>{});}
}
