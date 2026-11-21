import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { UI_TRANSITION } from './tokens';
import '../styles/motion.css';

export default function MotionEnvironment({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    const syncVisibility = () => { root.dataset.motionHidden = String(document.hidden); };
    const onPointer = () => { root.dataset.motionInput = 'pointer'; };
    const onKey = event => {
      if (!event.metaKey && !event.ctrlKey && !event.altKey) root.dataset.motionInput = 'keyboard';
    };
    const observeArtwork = node => {
      if (!(node instanceof Element)) return;
      if (node.matches('[data-ambient-motion]')) artworkObserver?.observe(node);
      node.querySelectorAll('[data-ambient-motion]').forEach(element => artworkObserver?.observe(element));
    };
    const artworkObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      entries.forEach(entry => { entry.target.dataset.motionOffscreen = String(!entry.isIntersecting); });
    });
    observeArtwork(document.body);
    const mutationObserver = new MutationObserver(records => records.forEach(record => {
      record.addedNodes.forEach(observeArtwork);
      record.removedNodes.forEach(node => {
        if (!(node instanceof Element)) return;
        artworkObserver?.unobserve(node);
        node.querySelectorAll('[data-ambient-motion]').forEach(element => artworkObserver?.unobserve(element));
      });
    }));
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('visibilitychange', syncVisibility);
      document.removeEventListener('pointerdown', onPointer, true);
      document.removeEventListener('keydown', onKey, true);
      artworkObserver?.disconnect();
      mutationObserver.disconnect();
      delete root.dataset.motionHidden;
      delete root.dataset.motionInput;
    };
  }, []);

  return <MotionConfig reducedMotion="user" transition={UI_TRANSITION}>{children}</MotionConfig>;
}
