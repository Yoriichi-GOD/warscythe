let pending=null;
export function requestRewardPreview(options){pending=options;window.dispatchEvent(new CustomEvent('warscythe:preview-reward',{detail:options}));}
export function takeRewardPreview(){const options=pending;pending=null;return options;}
export function makeRewardPreview(options={},owner='local'){
  const rarity=['common','uncommon','rare','epic','mythic'].includes(options.rarity)?options.rarity:'epic';
  return {eventId:`preview-${crypto.randomUUID()}`,preview:true,owner,previewFull:options.presentation!=='quick',scene:options.scene,source:'preview',reward:{rarity,artifact:{name:'Tome of Iron Will'}},basePts:100,totalPts:125,taskTitle:'Sample discovery · your earned progress stays unchanged',fragment:'A traveller carried this keepsake between distant roads. This is a presentation preview; no reward is granted.'};
}
