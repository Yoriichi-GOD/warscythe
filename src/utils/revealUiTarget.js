import { getScrollBehavior } from '../motion/useMotionEnvironment';

// scrollIntoView also scrolls overflow:hidden ancestors. In this fixed app
// shell that can move a target behind the header and away from its lesson.
// Move only containers that the user can actually scroll.
export function revealUiTarget(element) {
  if (!element || element.closest('#warscythe-header, #warscythe-taskbar')) return;
  const inDialog = element.closest('[role="dialog"], .modal-backdrop, .lore-backdrop, .ritual-modal-backdrop');
  const headerBottom = inDialog ? 0 : (document.getElementById('warscythe-header')?.getBoundingClientRect().bottom || 0);
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    const css = getComputedStyle(parent);
    if (['auto', 'scroll'].includes(css.overflowY) && parent.scrollHeight > parent.clientHeight + 1) {
      const target = element.getBoundingClientRect();
      const bounds = parent.getBoundingClientRect();
      const top = Math.max(headerBottom, bounds.top) + 16;
      parent.scrollBy({top:target.top - top, behavior:getScrollBehavior()});
    }
    parent = parent.parentElement;
  }
}
