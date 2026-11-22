import { useEffect, useRef } from 'react';

export function useLandingNarrative(enabled) {
  const root = useRef(null);
  useEffect(() => {
    const element = root.current;
    if (!element || !enabled || typeof Element.prototype.animate !== 'function') return;
    const clamp = value => Math.max(0, Math.min(1, value));
    const depth = window.matchMedia('(min-width: 900px) and (pointer: fine)').matches;
    const groups = [
      ...[...element.querySelectorAll('[data-copy-reveal]')].map(node => ({node, targets:[...node.querySelectorAll(':scope > .lp-narrative-piece')], kind:'copy'})),
      ...[...element.querySelectorAll('[data-image-reveal]')].map(node => ({node, targets:[node.querySelector('img')].filter(Boolean), kind:'image'})),
      ...(depth ? [...element.querySelectorAll('[data-scene-depth]')].map(node => ({node:node.closest('section'), targets:[node], kind:'landscape'})) : []),
    ].filter(group => group.targets.length).map(group => ({...group, previous:-1, animations:group.targets.map(target => {
      const keyframes = group.kind === 'landscape' ? [
        {transform:'translateY(2%) scale(1.06)'},
        {transform:'translateY(-2%) scale(1.06)'},
      ] : group.kind === 'image' ? [
        {opacity:.12,transform:'perspective(1600px) translateY(42px) rotateY(-4deg)',offset:0},
        {opacity:1,transform:'perspective(1600px) translateY(0) rotateY(0)',offset:.23},
        {opacity:1,transform:'perspective(1600px) translateY(0) rotateY(0)',offset:.82},
        {opacity:.15,transform:'perspective(1600px) translateY(-22px) rotateY(2deg)',offset:1},
      ] : [
        {opacity:.12,transform:'translateY(22px)',offset:0},
        {opacity:1,transform:'translateY(0)',offset:.2},
        {opacity:1,transform:'translateY(0)',offset:.82},
        {opacity:.12,transform:'translateY(-16px)',offset:1},
      ];
      const animation=target.animate(keyframes,{duration:1000,fill:'both',easing:'linear'});
      animation.pause();return animation;
    })}));
    let frame=0,disposed=false;
    const active=new Set(groups), byNode=new Map(groups.map(group=>[group.node,group]));
    const seek=(group,progress,entering=1)=>{
      if(Math.abs(progress-group.previous)<.0005)return;
      group.previous=progress;
      group.animations.forEach((animation,part)=>{
        const offset=Math.min(part,8)*.035;
        const delayed=entering<1&&group.kind==='copy'?clamp((entering-offset)/(1-offset))*.23:progress;
        animation.currentTime=delayed*1000;
      });
    };
    const draw=()=>{
      frame=0;if(document.hidden)return;
      const height=window.innerHeight;
      // Read each active box before seeking any animation; no layout read/write loop.
      const positions=[...active].map(group=>({group,rect:group.node.getBoundingClientRect()}));
      positions.forEach(({group,rect})=>{
        if(group.kind==='landscape'){seek(group,clamp((height-rect.top)/(height+rect.height)));return;}
        const entering=clamp((height*.96-rect.top)/(height*.23));
        const leaving=clamp((height*.18-rect.bottom)/(height*.14));
        seek(group,entering<1?entering*.23:leaving>0?.82+leaving*.18:.23,entering);
      });
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw)};
    const observer=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const group=byNode.get(entry.target);if(!group)return;
        if(entry.isIntersecting)active.add(group);
        else{active.delete(group);seek(group,entry.boundingClientRect.top>=window.innerHeight?0:1,1);}
      });schedule();
    },{rootMargin:'180px 0px',threshold:0});
    groups.forEach(group=>observer?.observe(group.node));
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    document.addEventListener('visibilitychange',schedule);
    element.dataset.narrativeMotion='true';draw();
    document.fonts?.ready.then(()=>{if(!disposed)schedule()});
    return()=>{
      disposed=true;cancelAnimationFrame(frame);observer?.disconnect();
      window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);
      document.removeEventListener('visibilitychange',schedule);
      groups.forEach(group=>group.animations.forEach(animation=>animation.cancel()));
      delete element.dataset.narrativeMotion;
    };
  },[enabled]);
  return root;
}
