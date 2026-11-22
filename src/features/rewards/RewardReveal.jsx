import { useEffect, useRef, useState } from 'react';
import { Archive, BookOpen, Coins, Sparkles, X } from 'lucide-react';
import OrnateFrame from '../../components/frames/OrnateFrame';
import WorldDivider from '../../components/frames/WorldDivider';
import { SCENES } from './presentation';

const families={common:'hermes',uncommon:'apollo',rare:'zeus',epic:'artifact',mythic:'ares'};

export default function RewardReveal({ data, reward, remaining, discovery, onCollect }) {
  const [expanded,setExpanded]=useState(false),[held,setHeld]=useState(false),[artFailed,setArtFailed]=useState(false);
  const panel=useRef(null),visual=useRef(null),collect=useRef(onCollect);
  const major=reward.major || expanded, scene=SCENES[reward.scene];
  useEffect(()=>{collect.current=onCollect;},[onCollect]);
  const keep = (after,instant=false) => {
    const rect=visual.current?.getBoundingClientRect();
    onCollect({after,instant,from:rect ? {left:rect.left,top:rect.top,width:rect.width,height:rect.height} : null,image:artFailed?null:reward.image});
  };
  useEffect(()=>{
    if(major || held)return;
    const timer=window.setTimeout(()=>{
      const rect=visual.current?.getBoundingClientRect();
      collect.current({from:rect?{left:rect.left,top:rect.top,width:rect.width,height:rect.height}:null,image:artFailed?null:reward.image});
    },4500);
    return()=>window.clearTimeout(timer);
  },[major,held,artFailed,reward.image]);
  useEffect(()=>{
    if(!major)return;
    const previous=document.activeElement;
    panel.current?.querySelector('[data-reward-collect]')?.focus();
    const key=event=>{
      if(event.key==='Escape'){event.preventDefault();collect.current({instant:true});}
      if(event.key!=='Tab')return;
      const controls=[...panel.current.querySelectorAll('button,summary')].filter(el=>el.getBoundingClientRect().width>0);
      if(event.shiftKey && document.activeElement===controls[0]){event.preventDefault();controls.at(-1)?.focus();}
      else if(!event.shiftKey && document.activeElement===controls.at(-1)){event.preventDefault();controls[0]?.focus();}
    };
    document.addEventListener('keydown',key);
    return()=>{document.removeEventListener('keydown',key);if(previous?.isConnected)previous.focus();};
  },[major]);
  const picture=<div ref={visual} className="reward-artwork">{artFailed ? <Sparkles size={56} aria-label="Artifact artwork unavailable"/> : <img src={reward.image} alt={reward.name} onError={()=>setArtFailed(true)}/>}</div>;
  return <div className={major?'reward-discovery-overlay loot-overlay':'reward-quick-anchor'}>
    <section ref={panel} className={`reward-reveal reward-tone-${reward.rarity} ${major?'reward-reveal--major':'reward-reveal--quick'}`} role={major?'dialog':'region'} aria-modal={major||undefined} aria-label={major?undefined:'Reward recorded'} aria-labelledby={major?'reward-discovery-title':undefined} data-reward-scene={reward.scene} data-reward-event={data.eventId || undefined}
      onPointerEnter={()=>setHeld(true)} onPointerLeave={()=>setHeld(false)} onFocusCapture={()=>setHeld(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setHeld(false);}}>
      <OrnateFrame family={families[reward.rarity]} quiet={!major} className="reward-reveal-frame"/>
      <header className="reward-reveal-heading">
        {data.preview && <p className="reward-preview-label">Test Realm preview · No progress changes</p>}
        <p className="reward-origin">{major?scene.title:'A find worth keeping'}{remaining>1?` · ${remaining} rewards`:''}</p>
        <h2 id="reward-discovery-title">{reward.name}</h2>
        <p className="reward-accomplishment">{data.taskTitle}</p>
      </header>
      <div className="reward-reveal-scroll">
        <div className="reward-discovery-stage">
          {major && scene.art && <img className="reward-scene-art" src={scene.art} alt="" aria-hidden="true"/>}
          <div className="reward-aura" aria-hidden="true"/>{picture}
          <div className="reward-sparks" aria-hidden="true">{[0,1,2,3,4,5].map(index=><span key={index} style={{'--spark-x':`${[20,78,14,86,35,67][index]}%`,'--spark-y':`${[26,20,60,55,76,74][index]}%`,'--spark-delay':`${index*35}ms`}}><Sparkles size={13}/></span>)}</div>
        </div>
        <WorldDivider className="reward-divider"/>
        <div className="reward-facts"><span className="reward-rarity">{reward.rarity} artifact</span>{reward.xp!==null&&<span className="reward-xp">+{reward.xp.toLocaleString()} XP</span>}{reward.coins!==null&&<span className="reward-coins"><Coins size={15}/>+{reward.coins.toLocaleString()} coins</span>}</div>
        {data.keyElement&&<p className="reward-key"><img src={`/keys/key-${data.keyElement}.webp`} alt=""/>{data.keyElement} key recovered · another step through the region</p>}
        {major&&<p className="reward-scene-copy">{scene.description}</p>}
        {discovery&&<button type="button" className="reward-discovery-link" onClick={()=>keep('read')}><BookOpen size={18}/><span>A new find: <em>{discovery.title}</em><small>Collect and read its story</small></span></button>}
        {major&&<details className="reward-details"><summary>Reward details</summary><p>{data.fragment || data.reward?.artifact?.hook || data.reward?.artifact?.lore}</p>{Number.isFinite(data.basePts)&&<p>Base {data.basePts} XP{reward.xp!==null&&reward.xp!==data.basePts?` · execution bonus ${reward.xp-data.basePts} XP`:''}</p>}<p>Your reward and progress are saved.</p></details>}
      </div>
      <footer className="reward-reveal-actions"><button type="button" data-reward-collect className="reward-collect" onClick={()=>keep()}><Archive size={17}/>{major?'Collect & continue':'Keep working'}</button>{major?<button type="button" className="reward-quiet" onClick={()=>keep(undefined,true)}>Skip motion</button>:<button type="button" className="reward-quiet" onClick={()=>setExpanded(true)}>Inspect</button>}{!major&&<button type="button" className="reward-quiet reward-close" aria-label="Store reward quietly" onClick={()=>keep(undefined,true)}><X size={17}/></button>}</footer>
    </section>
  </div>;
}
