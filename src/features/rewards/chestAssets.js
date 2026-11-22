let ready;
export function preloadRewardChest() {
  if (typeof Image === 'undefined') return Promise.resolve(false);
  if (!ready) ready = Promise.all(['closed','open'].map(state=>{
    const image = new Image(); image.src = `/rewards/chest-${state}.webp`;
    return image.decode();
  })).then(()=>true).catch(()=>{ready=null;return false;});
  return ready;
}
