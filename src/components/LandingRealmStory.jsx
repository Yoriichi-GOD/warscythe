import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { landingImageProps } from '../utils/responsiveAssets';
import './landingRealmStory.css';
import { NarrativeText } from './LandingNarrative';

const chapters = [
  { realm: 'operations', title: 'Name your battle.', copy: 'A paper. A product. The work you keep putting off. Give it an Operation, break it into steps, and take the first one.', outcome: 'Your real work advances the campaign.', link: 'Explore Operations' },
  { realm: 'rituals', title: 'Keep your oath.', copy: 'Some battles end. Others ask you to return. Turn training, reading and daily practice into Rituals with a history that lasts.', outcome: 'Consistency becomes something you can see.', link: 'Explore Rituals' },
  { realm: 'fitness', title: 'Become the weapon.', copy: 'Log your sets, reps and load. Leave the rest of the world behind in workout mode, then return with the evidence of your training.', outcome: 'The body becomes mythology.', link: 'Enter Olympus' },
  { realm: 'ledger', title: 'Leave a legend.', copy: 'The Ledger remembers the finished, the abandoned and the recovered. Your world becomes a record of the person doing the work.', outcome: 'You live the character. Warscythe keeps the save file.', link: 'Open the Ledger' },
];

export default function LandingRealmStory({ realms, onJump, motionEnabled }) {
  const root = useRef(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setChapter(Number(visible.target.dataset.chapter));
    }, { rootMargin: '-45% 0px -15% 0px', threshold: [0, .2, .5] });
    root.current.querySelectorAll('[data-chapter]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <div ref={root} className="lp-realm-story" data-chapter-active={chapter} data-story-motion={motionEnabled}>
    <div className="lp-story-stage">
      <div className="lp-story-map" aria-label="Explore the Warscythe territories">
        <div className="lp-story-map-plane">
          <img {...landingImageProps('realm-map-base.webp', '(max-width: 700px) 100vw, 58vw')} alt="The connected territories of the Warscythe realm" loading="lazy" decoding="async" fetchPriority="low" width="1518" height="1036" />
          <svg className="lp-story-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="lp-story-route-base" d="M49 84 L18 53 L44 53 L80 42 L78 64" />
            <path className="lp-story-route-ink" pathLength="1" d="M49 84 L18 53 L44 53 L80 42 L78 64" />
          </svg>
          {realms.map(realm => {
            const Icon = realm.icon;
            const current = chapters[chapter].realm === realm.id;
            return <button key={realm.id} type="button" className={`lp-story-node ${current ? 'is-current' : ''}`} style={{ left: `${realm.x}%`, top: `${realm.y}%` }} aria-label={`${realm.label}: ${realm.short}`} onClick={() => onJump(realm.id)}>
              <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
            </button>;
          })}
        </div>
      </div>
      <div className="lp-story-instrument">
        <div><span className="lp-story-page-number">{String(chapter + 1).padStart(2, '0')}<small> / 04</small></span><span>{realms.find(realm => realm.id === chapters[chapter].realm).label}</span></div>
        <div className="lp-story-chapter-nav" aria-label="Story chapters">{chapters.map((item, index) => <a key={item.realm} href={`#story-${item.realm}`} aria-label={`Chapter ${index + 1}: ${item.title}`} aria-current={index === chapter ? 'step' : undefined}><span /></a>)}</div>
      </div>
      <p className="lp-story-map-hint">Follow the story. Or choose a territory.</p>
    </div>
    <div className="lp-story-pages">{chapters.map((item, index) => <article id={`story-${item.realm}`} key={item.realm} data-chapter={index} className="lp-story-act" aria-current={chapter === index ? 'step' : undefined}>
      <NarrativeText as="h3" words>{item.title}</NarrativeText><NarrativeText>{item.copy}</NarrativeText><NarrativeText as="blockquote">{item.outcome}</NarrativeText>
      <button type="button" className="lp-story-link" onClick={() => onJump(item.realm)}>{item.link}<ArrowUpRight size={18} aria-hidden="true" /></button>
      {index < chapters.length - 1 && <span className="lp-story-next" aria-hidden="true">The path continues <ArrowDownRight size={16} /></span>}
    </article>)}</div>
  </div>;
}
