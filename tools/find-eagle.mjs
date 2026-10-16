// Offline developer diagnostic. Searches a fixed first-shot approach fixture;
// it does not submit scores or control the live game.
import {openingHole,newState,applyShot,distance} from '../src/engine.mjs';
const first={club:0,aim:-.034133,power:1},state=applyShot(newState(openingHole()),first).state;
const center=Math.atan2(state.hole.pin.x-state.ball.x,state.hole.pin.y-state.ball.y);
let best={distance:Infinity};
outer:for(let a=-160;a<=160;a++)for(let p=1400;p<=2000;p++){
  const input={club:6,aim:Math.round((center+a*.0005)*1e6)/1e6,power:p*.0005};
  const shot=applyShot(state,input),d=distance(shot.result.rest,state.hole.pin);
  if(d<best.distance)best={distance:d,first,second:input,strokes:shot.state.strokes,putts:shot.state.putts,holed:shot.result.holed,land:shot.result.land,rest:shot.result.rest};
  if(shot.result.holed&&shot.state.strokes===2)break outer;
}
console.log(JSON.stringify(best,null,2));
