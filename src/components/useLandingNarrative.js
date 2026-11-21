import { useEffect, useRef } from 'react';

export function useLandingNarrative(enabled) {
  const root = useRef(null);
  useEffect(() => {
    const element = root.current;
    if (!element || !enabled || typeof Element.prototype.animate !== 'function') return;
    const clamp = value => Math.max(0, Math.min(1, value));
    const groups = [
      ...[...element.querySelectorAll('[data-copy-reveal]')].map(node => ({ node, targets: [...node.querySelectorAll(':scope > .lp-narrative-piece')], image: false })),
      ...[...element.querySelectorAll('[data-image-reveal]')].map(node => ({ node, targets: [node.querySelector('img')].filter(Boolean), image: true })),
    ].map(group => ({ ...group, previous: -1, animations: group.targets.map(target => {
      const animation = target.animate(group.image ? [
        { opacity: .12, transform: 'perspective(1600px) translateY(42px) rotateY(-4deg)', offset: 0 },
        { opacity: 1, transform: 'perspective(1600px) translateY(0) rotateY(0)', offset: .23 },
        { opacity: 1, transform: 'perspective(1600px) translateY(0) rotateY(0)', offset: .82 },
        { opacity: .15, transform: 'perspective(1600px) translateY(-22px) rotateY(2deg)', offset: 1 },
      ] : [
        { opacity: .12, transform: 'translateY(22px)', offset: 0 },
        { opacity: 1, transform: 'translateY(0)', offset: .2 },
        { opacity: 1, transform: 'translateY(0)', offset: .82 },
        { opacity: .12, transform: 'translateY(-16px)', offset: 1 },
      ], { duration: 1000, fill: 'both', easing: 'linear' });
      animation.pause();
      return animation;
    }) }));
    let frame = 0;
    let disposed = false;
    const draw = () => {
      frame = 0;
      if (document.hidden) return;
      const height = window.innerHeight;
      // Read every layout box before changing any animation playhead.
      const positions = groups.map(group => group.node.getBoundingClientRect());
      groups.forEach((group, index) => {
        const rect = positions[index];
        const entering = clamp((height * .96 - rect.top) / (height * .23));
        const leaving = clamp((height * .18 - rect.bottom) / (height * .14));
        const progress = entering < 1 ? entering * .23 : leaving > 0 ? .82 + leaving * .18 : .23;
        if (Math.abs(progress - group.previous) < .0005) return;
        group.previous = progress;
        group.animations.forEach((animation, part) => {
          // Phrases settle before the reader reaches them; exits begin at the header.
          const offset = Math.min(part, 8) * .035;
          const delayed = entering < 1 && !group.image ? clamp((entering - offset) / (1 - offset)) * .23 : progress;
          animation.currentTime = delayed * 1000;
        });
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    element.dataset.narrativeMotion = 'true';
    draw();
    document.fonts?.ready.then(() => { if (!disposed) schedule(); });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      groups.forEach(group => group.animations.forEach(animation => animation.cancel()));
      delete element.dataset.narrativeMotion;
    };
  }, [enabled]);
  return root;
}
