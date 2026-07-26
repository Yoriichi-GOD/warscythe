import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import {
  Activity,
  Archive,
  ArrowDown,
  BookOpen,
  Check,
  ChevronDown,
  Dumbbell,
  ExternalLink,
  Flame,
  Map,
  Maximize2,
  Menu,
  Pause,
  Play,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  Terminal,
  Users,
  X,
} from 'lucide-react';
import './LandingPage.css';

const LANDING_ASSET = '/landing-page/';

const realms = [
  { id: 'gate', label: 'The War Gate', short: 'Enter the world', x: 49, y: 84, icon: Shield },
  { id: 'operations', label: 'Blackvale Campaigns', short: 'Campaigns that must end', x: 18, y: 53, icon: Swords },
  { id: 'rituals', label: 'The Oath Sanctum', short: 'Oaths that must continue', x: 44, y: 53, icon: Flame },
  { id: 'fitness', label: 'Hall of Olympus', short: 'The body becomes mythology', x: 80, y: 42, icon: Dumbbell },
  { id: 'ledger', label: 'The Iron Ledger', short: 'Nothing vanishes', x: 78, y: 64, icon: Archive },
  { id: 'legion', label: 'Legion Citadel', short: 'Do not fight alone', x: 47, y: 31, icon: Users },
  { id: 'terminal', label: 'Terminal Bastion', short: 'Where the future waits', x: 22, y: 30, icon: Terminal },
  { id: 'final-gate', label: 'The Final Gate', short: 'Begin the campaign', x: 72, y: 13, icon: Sparkles },
];

const featureSections = [
  {
    id: 'operations',
    eyebrow: 'BLACKVALE CAMPAIGNS // OPERATIONS',
    title: 'Campaigns that must end.',
    copy: 'Put anything here that actually needs to be completed—a product launch, a paper, a bug fix, or tonight’s work. Break it into tactical steps, watch progress move, and finish with consequence.',
    line: 'Finishing should not feel like a checkbox disappearing. It should feel like something happened.',
    icon: Swords,
    media: ['operations-command-screen.webp', 'operations-detail-screen.webp'],
    captions: ['The campaign command', 'The objective beneath the objective'],
    stats: ['Progress tracked', 'Regions advanced', 'Artifacts recovered', 'Bosses defeated'],
  },
  {
    id: 'rituals',
    eyebrow: 'THE OATH SANCTUM // RITUALS',
    title: 'Oaths that must continue.',
    copy: 'Training, studying, medication, reading, and sleep discipline become real through repetition. Rituals turn daily and weekly consistency into visible history rather than disposable checkmarks.',
    line: 'Streaks show continuity. Medals show whether you actually kept showing up.',
    icon: Flame,
    media: ['rituals-command-screen.webp', 'rituals-medal-screen.webp'],
    captions: ['The daily oath', 'Consistency earns evidence'],
    stats: ['Daily and weekly vows', 'Native reminders', '31-day medals', 'Permanent history'],
  },
];

const proofItems = [
  ['Operations', 'Building Warscythe, founder deadlines, releases and the work that must end.'],
  ['Rituals', 'Training, studying and the promises that only repetition can make real.'],
  ['Fitness', 'Real sessions, tonnage and personal records—logged by the founders themselves.'],
  ['Ledger', 'The completed, abandoned, recovered and maintained. Nothing quietly disappears.'],
];

function scrollToRealm(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function RuneCorners() {
  return <span className="lp-rune-corners" aria-hidden="true" />;
}

function ProductFrame({ src, caption, className = '' }) {
  const [missing, setMissing] = useState(false);
  return (
    <figure className={`lp-product-frame ${className}`}>
      <RuneCorners />
      {!missing ? (
        <img
          src={`${LANDING_ASSET}${src}`}
          alt={caption}
          loading="lazy"
          onError={() => setMissing(true)}
        />
      ) : (
        <div className="lp-product-placeholder">
          <div className="lp-placeholder-sigil"><Sparkles size={22} /></div>
          <span>REAL PRODUCT CAPTURE</span>
          <strong>{caption}</strong>
          <small>{src}</small>
        </div>
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function SectionHeading({ eyebrow, title, copy, align = 'left' }) {
  return (
    <div className={`lp-section-heading lp-align-${align}`}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function DemoModal({ onClose }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const toggleVideo = async () => {
    if (unavailable) return;
    try {
      if (videoRef.current?.paused) {
        await videoRef.current.play();
        setPlaying(true);
      } else {
        videoRef.current?.pause();
        setPlaying(false);
      }
    } catch {
      setUnavailable(true);
    }
  };

  return (
    <motion.div
      className="lp-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="lp-demo-modal"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        onClick={event => event.stopPropagation()}
      >
        <RuneCorners />
        <header>
          <div>
            <span>FOUNDER FIELD RECORDING</span>
            <h2>SEE THE REALM RESPOND</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close demo"><X size={18} /></button>
        </header>
        <div className="lp-demo-stage">
          <video
            ref={videoRef}
            poster={`${LANDING_ASSET}warscythe-demo-poster.webp`}
            preload="metadata"
            onEnded={() => setPlaying(false)}
            onError={() => setUnavailable(true)}
          >
            <source src={`${LANDING_ASSET}warscythe-demo.mp4`} type="video/mp4" />
          </video>
          <button type="button" className="lp-demo-play" onClick={toggleVideo}>
            {unavailable ? <><Sparkles size={20} /><span>DEMO RECORDING ARRIVES SOON</span></> : playing ? <><Pause size={20} /><span>PAUSE FIELD RECORDING</span></> : <><Play size={20} fill="currentColor" /><span>WATCH THE DEMO</span></>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LegalModal({ type, onClose }) {
  const isTerms = type === 'terms';
  return (
    <motion.div className="lp-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="lp-legal-modal" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} onClick={event => event.stopPropagation()}>
        <header>
          <div><ScrollText size={16} /><h2>{isTerms ? 'TERMS OF SERVICE' : 'PRIVACY POLICY'}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close legal notice"><X size={17} /></button>
        </header>
        <div className="lp-legal-copy">
          {isTerms ? (
            <>
              <h3>1. TERMS OF USE</h3>
              <p>Warscythe is a tactical command interface for recording real-world operations, rituals and fitness activity. You remain responsible for the goals you choose and the actions you take.</p>
              <h3>2. FITNESS AND MEDICAL NOTICE</h3>
              <p>Fitness progression is a narrative record, not medical advice, diagnosis or personal training instruction. Consult a qualified professional before beginning or changing a training program.</p>
              <h3>3. ACCOUNTS AND ENTITLEMENTS</h3>
              <p>Account progress and purchased entitlements are associated with your authenticated profile. Use the system honestly; fabricated progress only damages your own record.</p>
            </>
          ) : (
            <>
              <h3>1. YOUR RECORD</h3>
              <p>Warscythe stores the account and progression data necessary to preserve your Operations, Rituals, workouts, rewards and world state.</p>
              <h3>2. ADVERTISING</h3>
              <p>Eligible web accounts may be shown advertising. Premium or ad-free entitlements remove those modules according to the purchased plan.</p>
              <h3>3. OFFLINE ASSETS</h3>
              <p>Selected world artwork and soundscapes may be cached locally to make the application faster and usable during interrupted connectivity.</p>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage({ onLaunch }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [activeRealm, setActiveRealm] = useState('gate');
  const [showDemo, setShowDemo] = useState(false);
  const [showLegal, setShowLegal] = useState(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveRealm(visible.target.id);
    }, { rootMargin: '-30% 0px -55%', threshold: [0.05, 0.25, 0.5] });

    realms.forEach(realm => {
      const section = document.getElementById(realm.id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  const jump = id => {
    setMobileNavOpen(false);
    setMapOpen(false);
    // Let the animated mobile realm drawer collapse before measuring the destination.
    window.setTimeout(() => scrollToRealm(id), mapOpen ? 320 : 0);
  };

  return (
    <div className="landing-page-root">
      <motion.div className="lp-scroll-progress" style={{ scaleX: progress }} />

      <header className="lp-header">
        <button className="lp-brand" type="button" onClick={() => jump('gate')} aria-label="Warscythe home">
          <img src="/command-core.png" alt="" />
          <span><strong>WARSCYTHE</strong><small>VERSION 1.0 // GENESIS</small></span>
        </button>
        <nav className="lp-desktop-nav" aria-label="Landing page navigation">
          {[
            ['realm-map', 'Realm Map'],
            ['operations', 'Operations'],
            ['rituals', 'Rituals'],
            ['fitness', 'Fitness'],
            ['ledger', 'Ledger'],
            ['legion', 'Legion'],
          ].map(([id, label]) => <button key={id} className={activeRealm === id ? 'active' : ''} onClick={() => jump(id)}>{label}</button>)}
        </nav>
        <div className="lp-header-actions">
          <button className="lp-nav-demo" onClick={() => setShowDemo(true)}><Play size={12} /> DEMO</button>
          <button className="lp-primary-small" onClick={onLaunch}>ENTER WARSCYTHE</button>
          <button className="lp-mobile-menu" onClick={() => setMobileNavOpen(open => !open)} aria-label="Open navigation"><Menu size={19} /></button>
        </div>
      </header>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.nav className="lp-mobile-nav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {realms.map(realm => <button key={realm.id} onClick={() => jump(realm.id)}>{realm.label}</button>)}
            <button onClick={() => { setMobileNavOpen(false); setShowDemo(true); }}>Watch Demo</button>
          </motion.nav>
        )}
      </AnimatePresence>

      <main>
        <section id="gate" className="lp-hero">
          <picture className="lp-hero-art">
            <source media="(max-width: 700px)" srcSet={`${LANDING_ASSET}hero-gate-mobile.webp`} />
            <img src={`${LANDING_ASSET}hero-gate-desktop.webp`} alt="A warrior overlooking the illuminated Warscythe realm" />
          </picture>
          <div className="lp-embers" style={{ backgroundImage: `url("${LANDING_ASSET}ember-particles.webp")` }} />
          <div className="lp-hero-shade" />

          <motion.div className="lp-hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
            <span className="lp-kicker">THE EXECUTION RPG</span>
            <h1>Execution,<br /><em>Forged into Legend.</em></h1>
            <p>Warscythe is an execution RPG where your real tasks, habits and workouts shape a persistent fantasy world.</p>
            <strong>There is no customizable avatar. You are the avatar.</strong>
            <div className="lp-hero-actions">
              <button className="lp-primary-cta" onClick={onLaunch}>ENTER WARSCYTHE <ExternalLink size={15} /></button>
              <button className="lp-secondary-cta" onClick={() => setShowDemo(true)}><Play size={14} fill="currentColor" /> WATCH THE DEMO</button>
            </div>
          </motion.div>

          <button className="lp-scroll-cue" onClick={() => jump('realm-map')}>
            <span>EXPLORE THE REALM</span><ArrowDown size={17} />
          </button>
        </section>

        <section id="realm-map" className="lp-map-section">
          <SectionHeading align="center" eyebrow="THE KINGDOM RESPONDS" title="Choose your path." copy="Every territory is another form of execution. Explore the realm, then enter the system that makes it move." />
          <div className="lp-map-shell">
            <RuneCorners />
            <img src={`${LANDING_ASSET}realm-map-base.webp`} alt="The connected territories of the Warscythe realm" loading="eager" />
            <div className="lp-map-vignette" />
            {realms.map(realm => {
              const Icon = realm.icon;
              return (
                <button
                  key={realm.id}
                  className={`lp-map-node ${realm.x >= 70 ? 'label-left' : ''} ${activeRealm === realm.id ? 'active' : ''}`}
                  style={{ left: `${realm.x}%`, top: `${realm.y}%` }}
                  onClick={() => jump(realm.id)}
                  aria-label={`${realm.label}: ${realm.short}`}
                >
                  <i><Icon size={13} /></i>
                  <span><strong>{realm.label}</strong><small>{realm.short}</small></span>
                </button>
              );
            })}
          </div>

          <div className="lp-mobile-realm-nav">
            <button onClick={() => setMapOpen(open => !open)}><Map size={15} /><span>EXPLORE THE REALM</span><ChevronDown size={15} className={mapOpen ? 'rotate' : ''} /></button>
            <AnimatePresence>
              {mapOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  {realms.map(realm => <button key={realm.id} onClick={() => jump(realm.id)}><realm.icon size={13} /><span>{realm.label}</span><small>{realm.short}</small></button>)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="lp-thesis">
          <span>THE CATEGORY BREAK</span>
          <blockquote>“You do not play Warscythe instead of doing your work. <em>Your work is what plays Warscythe.</em>”</blockquote>
          <p>Most productivity tools help organize what comes next. Warscythe makes execution leave evidence.</p>
        </section>

        {featureSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <section id={section.id} className={`lp-feature-section ${sectionIndex % 2 ? 'reverse' : ''}`} key={section.id}>
              <motion.div className="lp-feature-copy" initial={{ opacity: 0, x: sectionIndex % 2 ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }}>
                <div className="lp-feature-icon"><Icon size={20} /></div>
                <SectionHeading eyebrow={section.eyebrow} title={section.title} copy={section.copy} />
                <blockquote>{section.line}</blockquote>
                <div className="lp-outcomes">
                  {section.stats.map(stat => <span key={stat}><Check size={11} /> {stat}</span>)}
                </div>
              </motion.div>
              <motion.div className="lp-feature-media" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }}>
                <ProductFrame src={section.media[0]} caption={section.captions[0]} />
                <ProductFrame src={section.media[1]} caption={section.captions[1]} className="lp-secondary-frame" />
              </motion.div>
            </section>
          );
        })}

        <section id="fitness" className="lp-olympus">
          <img src={`${LANDING_ASSET}olympus-hall.webp`} alt="" loading="lazy" />
          <div className="lp-environment-shade" />
          <div className="lp-olympus-content">
            <SectionHeading align="center" eyebrow="HALL OF OLYMPUS // FITNESS" title="The body becomes mythology." copy="Most fitness apps show graphs. Warscythe shows ascension. Your sessions, tonnage and personal records become permanent evidence of what your body has actually done." />
            <strong>Strength is war. The body is the weapon.</strong>
            <div className="lp-olympus-frames">
              <ProductFrame src="fitness-olympus-screen.webp" caption="Ascension through real training" />
              <ProductFrame src="fitness-session-screen.webp" caption="Every session leaves evidence" />
            </div>
            <div className="lp-tonnage-tease"><Activity size={15} /><span>THE NEXT DEITY IS A DESTINATION</span><strong>2,320 KG REMAINING UNTIL APOLLO</strong></div>
          </div>
        </section>

        <section id="ledger" className="lp-ledger">
          <div className="lp-ledger-copy">
            <div className="lp-feature-icon"><BookOpen size={20} /></div>
            <SectionHeading eyebrow="THE IRON LEDGER // ARCHIVE OF BECOMING" title="Nothing vanishes." copy="Warscythe remembers what you finished, abandoned, trained, recovered and maintained. Over time, the Ledger becomes less like an archive and more like a save file for your real life." />
            <blockquote>You live the character. Warscythe keeps the save file.</blockquote>
          </div>
          <div className="lp-ledger-gallery">
            <ProductFrame src="ledger-calendar-screen.webp" caption="History does not disappear" />
            <ProductFrame src="ledger-relics-screen.webp" caption="Every victory leaves an object" />
          </div>
          <p className="lp-ledger-manifesto">“I want someone who has used Warscythe for three years to see a history of who they became—not 4,000 crossed-out checkboxes.”</p>
        </section>

        <section id="legion" className="lp-legion">
          <div className="lp-legion-content">
            <SectionHeading align="center" eyebrow="LEGION CITADEL // SHARED WAR" title="Do not fight alone." copy="Assign ownership, share objectives and keep the group history honest. Legion is persistent multiplayer execution—not another chatroom." />
            <div className="lp-legion-line"><Users size={18} /><strong>A Legion is a war party with memory.</strong></div>
            <div className="lp-legion-frames">
              <ProductFrame src="legion-command-screen.webp" caption="The shared command" />
              <ProductFrame src="legion-objective-screen.webp" caption="Every warrior owns a front" />
            </div>
            <span className="lp-roadmap-tag">COMING NEXT // LEGION WARS</span>
          </div>
        </section>

        <section id="terminal" className="lp-terminal">
          <img src={`${LANDING_ASSET}terminal-bastion.webp`} alt="" loading="lazy" />
          <div className="lp-environment-shade" />
          <motion.div className="lp-terminal-panel" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }}>
            <RuneCorners />
            <span>THE ROAD AHEAD // FUTURE ROADMAP</span>
            <h2>The Terminal Bastion</h2>
            <p>The long-term vision is not only to track execution, but to let more execution happen inside Warscythe. Humans and eventually controlled agents could work toward the same Operation with visible state and explicit approval gates.</p>
            <strong>This layer is future roadmap, not current product.</strong>
            <blockquote>“I want to be killing the dragon in one Warscythe region while using Warscythe to build the next one.”</blockquote>
            <small>SSS // SELF-SUSTAINED SYSTEM</small>
          </motion.div>
        </section>

        <section id="proof" className="lp-proof">
          <SectionHeading align="center" eyebrow="PROOF OF LIFE" title="The kingdom is already alive." copy="Warscythe began as something its founders needed. The world was not added to decorate the work. It became the reason finishing finally felt like something." />
          <div className="lp-proof-grid">
            {proofItems.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
          <div className="lp-proof-foot"><strong>BUILT AND USED BY THE FOUNDERS DAILY</strong><span>WEB // INSTALLABLE PWA // ANDROID</span></div>
        </section>

        <section id="final-gate" className="lp-final-gate">
          <img src={`${LANDING_ASSET}final-gate.webp`} alt="An immense golden gate opening into the Warscythe realm" loading="lazy" />
          <div className="lp-final-shade" />
          <motion.div className="lp-final-copy" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }}>
            <span>THE FINAL GATE</span>
            <h2>Your life already has battles.<br /><em>Give them a world.</em></h2>
            <p>Warscythe is for people who know what they need to do—and are tired of doing it in systems that make it feel like nothing.</p>
            <div>
              <button className="lp-primary-cta" onClick={onLaunch}>ENTER WARSCYTHE <ExternalLink size={15} /></button>
              <button className="lp-secondary-cta" onClick={() => setShowDemo(true)}><Play size={14} /> WATCH DEMO</button>
            </div>
            <strong>EXECUTION SHOULD LEAVE EVIDENCE.</strong>
          </motion.div>
        </section>
      </main>

      <footer className="lp-footer">
        <button className="lp-brand" type="button" onClick={() => jump('gate')}>
          <img src="/command-core.png" alt="" />
          <span><strong>WARSCYTHE</strong><small>EXECUTION, FORGED INTO LEGEND</small></span>
        </button>
        <div><button onClick={() => setShowLegal('terms')}>TERMS</button><button onClick={() => setShowLegal('privacy')}>PRIVACY</button><button onClick={() => jump('realm-map')}>REALM MAP</button></div>
        <small>© 2026 WARSCYTHE COMMAND SYSTEM</small>
      </footer>

      <AnimatePresence>
        {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
        {showLegal && <LegalModal type={showLegal} onClose={() => setShowLegal(null)} />}
      </AnimatePresence>
    </div>
  );
}
