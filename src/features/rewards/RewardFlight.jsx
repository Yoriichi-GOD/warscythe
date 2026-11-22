import { useEffect, useRef } from 'react';
import { useReducedMotionPreference } from '../../motion/useMotionEnvironment';
import { UI_EASE } from '../../motion/tokens';
import { preloadRewardChest } from './chestAssets';

const easeOut = `cubic-bezier(${UI_EASE.join(',')})`;
export default function RewardFlight({ flight, onDone }) {
  const reduced = useReducedMotionPreference();
  const root = useRef(null), chest = useRef(null), shake = useRef(null), item = useRef(null), mouth = useRef(null), done = useRef(onDone);
  useEffect(()=>{done.current=onDone;},[onDone]);
  useEffect(()=>{
    let live = true, timer; const animations = [];
    const finish = () => { if(live) done.current(); };
    if(reduced || flight.instant || !flight.from || !flight.image){ timer=window.setTimeout(finish,160); }
    else {
      Promise.race([preloadRewardChest(),new Promise(resolve=>{timer=window.setTimeout(()=>resolve(false),500);})]).then(loaded=>{
        if(!live)return;
        window.clearTimeout(timer);
        if(!loaded || !root.current || !mouth.current){finish();return;}
        root.current.dataset.ready='true';
        const destination=mouth.current.getBoundingClientRect(),from=flight.from;
        const dx=destination.left+destination.width/2-from.left-from.width/2;
        const dy=destination.top+destination.height/2-from.top-from.height/2;
        const arc=Math.max(22,Math.min(100,Math.abs(dx)*.12));
        animations.push(chest.current.animate([
          {transform:'translateX(45%)',opacity:0,offset:0,easing:easeOut},
          {transform:'translateX(0)',opacity:1,offset:.16},
          {transform:'translateX(0)',opacity:1,offset:.84,easing:easeOut},
          {transform:'translateX(45%)',opacity:0,offset:1},
        ],{duration:1320,easing:'linear',fill:'both'}));
        animations.push(shake.current.animate([
          {transform:'rotate(0deg)'},{transform:'rotate(-3deg)'},{transform:'rotate(2deg)'},
          {transform:'rotate(-1deg)'},{transform:'rotate(0deg)'},
        ],{delay:170,duration:200,easing:easeOut,fill:'both'}));
        animations.push(item.current.animate([
          {transform:'translate(0,0) scale(1)',opacity:1,offset:0},
          {transform:`translate(${dx*.32}px,${dy*.16-arc}px) scale(.82)`,opacity:1,offset:.38},
          {transform:`translate(${dx}px,${dy}px) scale(.12)`,opacity:1,offset:.9},
          {transform:`translate(${dx}px,${dy+6}px) scale(.12)`,opacity:0,offset:1},
        ],{delay:310,duration:620,easing:'cubic-bezier(0.77,0,0.175,1)',fill:'both'}));
        animations[0].finished.then(finish).catch(()=>{});
      }).catch(finish);
    }
    return()=>{live=false;window.clearTimeout(timer);animations.forEach(animation=>animation.cancel());};
  },[flight,reduced]);
  return <div ref={root} className={`reward-flight loot-overlay reward-tone-${flight.rarity}`} aria-hidden="true" data-reduced={reduced || flight.instant || undefined}>
    <div ref={chest} className="reward-vault" data-testid="reward-vault">
      <div className="reward-vault-aura"/>
      <div ref={shake} className="reward-vault-sprites">
        <img className="reward-chest-closed" src="/rewards/chest-closed.webp" alt=""/>
        <img className="reward-chest-open" src="/rewards/chest-open.webp" alt=""/>
      </div>
      <span ref={mouth} className="reward-vault-mouth"/>
      <span className="reward-vault-caption">Kept in the Ledger</span>
    </div>
    {flight.from && <img ref={item} className="reward-flying-item" src={flight.image || undefined} alt="" style={{left:flight.from.left,top:flight.from.top,width:flight.from.width,height:flight.from.height}}/>}
  </div>;
}
