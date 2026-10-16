import {distance} from './engine.mjs';
export function greenView(h,ball,width,height){
  if(distance(ball,h.pin)>35)return null;
  const span=Math.max(48,h.greenRadius*2+16,Math.abs(ball.x-h.pin.x)*2+18,Math.abs(ball.y-h.pin.y)*2+18);
  return{x:(ball.x+h.pin.x)/2,y:(ball.y+h.pin.y)/2,scale:Math.min(10,Math.max(.4,Math.min(width-40,height-60)/span))};
}
