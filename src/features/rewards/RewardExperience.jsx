import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Archive, X } from 'lucide-react';
import { useWarscytheStore } from '../../store/useWarscytheStore';
import volume from '../archive/data/volumeOne.json';
import { createRewardQueue, describeReward } from './presentation';
import RewardReveal from './RewardReveal';
import RewardFlight from './RewardFlight';
import { preloadRewardChest } from './chestAssets';
import './rewards.css';

export default function RewardExperience({ data, paused=false, onClose, onOpenLedger, onOpenArchive }) {
  const [queue]=useState(()=>createRewardQueue(data));
  const items=useSyncExternalStore(queue.subscribe,queue.getSnapshot,queue.getSnapshot);
  const active=items[0];
  const [flight,setFlight]=useState(null),[receipt,setReceipt]=useState(null);
  const collecting=useRef(false);
  useEffect(()=>{queue.accept(data);},[data,queue]);
  useEffect(()=>{
    const account=useWarscytheStore.getState().user?.id || 'local';
    // Subscribe before React batches renders: two completions still get two reveals.
    return useWarscytheStore.subscribe((next,previous)=>{
      if((next.user?.id || 'local')===account && next.pendingReward!==previous.pendingReward)queue.accept(next.pendingReward);
    });
  },[queue]);
  useEffect(()=>{preloadRewardChest();},[]);
  useEffect(()=>{if(!receipt)return;const timer=window.setTimeout(()=>setReceipt(null),4500);return()=>window.clearTimeout(timer);},[receipt]);
  const collect=useCallback(options=>{
    if(!active || collecting.current)return;
    collecting.current=true;
    const reward=describeReward(active);
    setFlight({...options,reward:active,image:options?.image===null?null:reward.image,rarity:reward.rarity,name:reward.name});
  },[active]);
  const finish=useCallback(()=>{
    if(!flight || !queue.finish(flight.reward))return;
    const completed=flight.reward;
    collecting.current=false;setFlight(null);
    setReceipt({name:flight.name,preview:completed.preview});
    onClose?.(completed);
    if(flight.after==='read' && Number.isInteger(completed.discoveryIndex)){
      const id=volume.discoveryOrder[completed.discoveryIndex];if(id)onOpenArchive?.(id);
    }
  },[flight,queue,onClose,onOpenArchive]);
  const reward=active?describeReward(active):null;
  const id=active && !active.preview && Number.isInteger(active.discoveryIndex)?volume.discoveryOrder[active.discoveryIndex]:null;
  const discovery=id?volume.documents.find(document=>document.id===id):null;
  if(paused)return null;
  return <>
    {active&&!flight&&<RewardReveal key={active.eventId||reward.name+active.taskTitle} data={active} reward={reward} remaining={items.length} discovery={discovery} onCollect={collect}/>}
    {flight&&<RewardFlight flight={flight} onDone={finish}/>}
    {receipt&&!flight&&!active&&<div className="reward-receipt" role="status"><Archive size={18}/><span>{receipt.preview?'Preview complete':`${receipt.name} kept in the Ledger.`}</span>{!receipt.preview&&<button type="button" onClick={()=>{setReceipt(null);onOpenLedger?.();}}>View Ledger</button>}<button type="button" aria-label="Dismiss reward receipt" onClick={()=>setReceipt(null)}><X size={16}/></button></div>}
  </>;
}
