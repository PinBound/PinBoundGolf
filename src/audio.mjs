export class Sound{
  constructor(prefs,onFailure){this.prefs=prefs;this.onFailure=onFailure;this.track=null;this.kind='';this.unlocked=false;this.effects=new Set();this.hidden=false;}
  unlock(){this.unlocked=true;if(this.context?.state==='suspended'&&!this.hidden)this.context.resume().catch(()=>{});}
  volume(){if(this.track)this.track.volume=this.prefs.muted?0:this.prefs.music;for(const e of this.effects)e.volume=this.prefs.muted?0:this.prefs.effects;if(this.ambientGain)this.ambientGain.gain.setTargetAtTime(this.prefs.muted||!this.ambientTheme?0:this.prefs.ambient??.2,this.context.currentTime,.3);}
  ambience(theme){
    this.ambientTheme=theme;if(!this.unlocked)return;
    try{
      if(!this.context){const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;this.context=new Context();const ctx=this.context,buffer=ctx.createBuffer(1,ctx.sampleRate*8,ctx.sampleRate),samples=buffer.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*.25;const source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;this.filter=ctx.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=500;this.ambientGain=ctx.createGain();this.ambientGain.gain.value=0;source.connect(this.filter).connect(this.ambientGain).connect(ctx.destination);source.start();this.birdTimer=setInterval(()=>this.bird(),14000);}
      this.filter.frequency.setTargetAtTime(['coast','dunes','bluffs'].includes(theme)?800:420,this.context.currentTime,1);this.volume();if(!this.hidden)this.context.resume().catch(()=>{});
    }catch{/* Audio is optional on browsers without Web Audio. */}
  }
  bird(){if(!this.context||!this.ambientTheme||this.hidden||this.prefs.muted||!this.prefs.ambient)return;const ctx=this.context,t=ctx.currentTime;for(let i=0;i<2;i++){const o=ctx.createOscillator(),g=ctx.createGain(),start=t+i*.22;o.type='sine';o.frequency.setValueAtTime(1700+i*240,start);o.frequency.exponentialRampToValueAtTime(2800+i*130,start+.09);g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(.018,start+.025);g.gain.exponentialRampToValueAtTime(.0001,start+.18);o.connect(g).connect(this.ambientGain);o.start(start);o.stop(start+.2);}}
  stopAmbience(){this.ambientTheme='';this.volume();}
  music(kind){
    if(kind)this.stopAmbience();
    if(this.kind===kind&&(this.track||!kind)){if(this.track?.paused&&!this.hidden&&this.unlocked)this.track.play().catch(()=>{});return;}
    this.kind=kind;if(this.track){this.track.pause();this.track=null;}
    if(!kind||!this.unlocked)return;
    this.track=new Audio(new URL('../audio/'+(kind==='menu'?'main-menu.mp3':'scorecard.mp3'),import.meta.url));this.track.loop=true;this.volume();if(!this.hidden)this.track.play().catch(()=>this.onFailure?.('Audio is unavailable. The game will continue silently.'));
  }
  effect(name,rate=1){if(!this.unlocked||this.prefs.muted||!this.prefs.effects||this.hidden)return;const audio=new Audio(new URL('../audio/'+name+'.mp3',import.meta.url));audio.volume=this.prefs.effects;audio.playbackRate=rate;audio.preservesPitch=false;this.effects.add(audio);const clear=()=>this.effects.delete(audio);audio.onended=clear;audio.onerror=clear;audio.play().catch(clear);}
  suspend(hidden){this.hidden=hidden;if(hidden){this.context?.suspend().catch(()=>{});this.track?.pause();for(const e of this.effects)e.pause();this.effects.clear();}else{if(this.ambientTheme&&this.unlocked)this.context?.resume().catch(()=>{});if(this.track&&this.unlocked)this.track.play().catch(()=>{});}}
}
