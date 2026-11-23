import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, FileText, Mail, Search, X } from 'lucide-react';
import { useWarscytheStore } from '../../store/useWarscytheStore';
import OrnateFrame from '../../components/frames/OrnateFrame';
import WorldDivider from '../../components/frames/WorldDivider';
import volume from './data/volumeOne.json';
import { archiveStorageKey, collectDocuments, filterDocuments, reconcileReadingState, visibleConnections } from './domain/discoveries';
import DocumentText from './reader/DocumentText';
import LooseDocument from './reader/LooseDocument';
import './worldArchive.css';
import WorldSelect from '../../components/WorldSelect';

const BookReader = lazy(() => import('./reader/BookReader'));

class ReaderBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="archive-reader-fallback"><h2>The binding could not open.</h2><p>Your collected writing is still available.</p><button type="button" onClick={this.props.onRead}>Read the text</button></div> : this.props.children; }
}

function loadReading(key, documents) {
  try { return reconcileReadingState(JSON.parse(localStorage.getItem(key) || '{}'), documents); }
  catch { return reconcileReadingState({}, documents); }
}

export default function WorldArchive({ onClose, initialDocumentId, previewCount, initialMode }) {
  const totalCompletions = useWarscytheStore(state => state.totalCompletions);
  const unlockedLore = useWarscytheStore(state => state.unlockedLore);
  const userId = useWarscytheStore(state => state.user?.id);
  const preview = import.meta.env.DEV && localStorage.getItem('warscythe_test_realm_active') === 'true' && Number.isInteger(previewCount) && previewCount >= 0;
  const documents = useMemo(() => collectDocuments(volume.documents, volume.discoveryOrder, preview ? { totalCompletions:previewCount } : { totalCompletions, unlockedLore }), [preview, previewCount, totalCompletions, unlockedLore]);
  const mode = preview && ['book','original'].includes(initialMode) ? initialMode : undefined;
  const storageKey = archiveStorageKey(userId) + (preview ? ':preview:'+previewCount+':'+(mode || 'original') : '');
  const firstDocumentId = initialDocumentId || (preview && mode === 'book' ? documents[0]?.id : null);
  return <ArchiveSession key={storageKey} onClose={onClose} documents={documents} storageKey={storageKey} initialDocumentId={firstDocumentId} initialMode={mode} preview={preview}/>;
}

function ArchiveSession({ onClose, documents, storageKey, initialDocumentId, initialMode, preview }) {
  const [reading, setReading] = useState(() => { const saved = loadReading(storageKey, documents); return initialMode ? { ...saved, mode:initialMode } : saved; });
  const [selection, setSelection] = useState(() => documents.some(document => document.id === initialDocumentId) ? initialDocumentId : null);
  const [currentId, setCurrentId] = useState(selection || reading.documentId);
  const [view, setView] = useState(initialMode || reading.mode);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [thread, setThread] = useState('all');
  const root = useRef(null);
  const closeButton = useRef(null);
  const active = documents.find(document => document.id === currentId) || documents[0];
  const results = useMemo(() => filterDocuments(documents, { query, kind, thread }), [documents, query, kind, thread]);
  const discoveredThreads = Object.keys(volume.threads).filter(id => documents.some(document => document.threads.includes(id)));
  const readIds = new Set(reading.read);
  const openDocument = useCallback(id => { setSelection(id); setCurrentId(id); setReading(before => before.documentId === id ? before : { ...before, documentId: id, paragraph: 0, page: 0 }); }, []);
  const markRead = useCallback(id => setReading(before => before.read.includes(id) ? before : { ...before, read: [...before.read, id], documentId: id }), []);
  const onPosition = useCallback(position => { setCurrentId(position.documentId); setReading(before => ({ ...before, ...position, read: before.read.includes(position.documentId) ? before.read : [...before.read, position.documentId] })); }, []);
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(reading)); } catch { /* Reading works when browser storage is unavailable. */ }
  }, [reading, storageKey]);
  useEffect(() => {
    const previous = document.activeElement, oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; closeButton.current?.focus();
    const keys = event => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const focusable = [...root.current.querySelectorAll('button:not(:disabled),input,select,a[href],[tabindex="0"]')].filter(element => element.getBoundingClientRect().width && !element.closest('[inert]'));
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
    };
    document.addEventListener('keydown', keys);
    return () => { document.removeEventListener('keydown', keys); document.body.style.overflow = oldOverflow; if (previous?.isConnected) previous.focus(); };
  }, [onClose]);
  const chooseView = value => { setView(value); if (active) setSelection(active.id); setReading(before => ({ ...before, mode: value })); if (active && value !== 'original') markRead(active.id); };
  return <div className="world-archive-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={root} role="dialog" aria-modal="true" aria-labelledby="world-archive-title" className={`world-archive ${!selection || !active ? 'world-archive--library' : ''}`} data-archive-preview={preview || undefined}>
      {(!selection || !active) && <OrnateFrame family="ledger" className="archive-library-frame"/>}
      <header className="world-archive-header"><div><BookOpen size={22}/><h1 id="world-archive-title">The Unquiet Post</h1></div><button id="archive-close" ref={closeButton} type="button" className="archive-close" aria-label="Close world archive" onClick={onClose}><X size={20}/></button></header>
      {preview && <p className="archive-preview-banner" role="status">Test Realm preview · {documents.length} sample finds · Earned progress unchanged</p>}
      {!selection || !active ? <div className="archive-library">
        <section className="archive-library-intro ornate-surface"><OrnateFrame family="apollo" quiet/><div className="archive-volume-mark" aria-hidden="true"><Mail size={44}/></div><h2>One world.<br/><em>Many witnesses.</em></h2><WorldDivider className="archive-intro-divider"/><p>A letter from a princess. A price crossed out. A prayer kept on the back of an account. The roads between them are yours to discover.</p><p className="archive-collection-count">{documents.length} collected · {documents.filter(document => !readIds.has(document.id)).length} unread</p>{reading.documentId && documents.some(document => document.id === reading.documentId) && <button type="button" className="archive-primary" onClick={() => openDocument(reading.documentId)}>Return to your reading</button>}<p className="archive-small-note">Reading leaves your earned progress unchanged.</p></section>
        <section id="archive-catalogue" className="archive-catalogue" aria-label="Collected documents"><div className="archive-search"><Search size={18}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search your collected writing" aria-label="Search collected documents"/></div><div className="archive-filters"><WorldSelect label="Document type" value={kind} onChange={setKind} options={[{ value:'all', label:'Every kind of find' }, ...[...new Set(documents.map(document => document.kind))].map(value => ({ value, label:value }))]}/><WorldSelect label="Story thread" value={thread} onChange={setThread} options={[{ value:'all', label:'Every thread' }, ...discoveredThreads.map(value => ({ value, label:volume.threads[value] }))]}/></div><WorldDivider family="sapphire" className="archive-catalogue-divider"/>
          {!documents.length ? <div className="archive-empty"><Mail size={38}/><h2>The post has not reached you yet.</h2><p>Your first completed Operation will uncover a document. Its story may come from anywhere in the kingdom.</p></div> : !results.length ? <div className="archive-empty"><h2>No collected page matches.</h2><p>Try another word or clear the filters.</p><button type="button" onClick={() => { setQuery(''); setKind('all'); setThread('all'); }}>Clear filters</button></div> : <div className="archive-document-list">{results.map(document => <button type="button" key={document.id} className="archive-document-row" onClick={() => openDocument(document.id)}><span className={`archive-kind-symbol archive-kind-${document.kind}`} aria-hidden="true">{document.kind === 'letter' ? <Mail size={21}/> : <FileText size={21}/>}</span><span><span className="archive-document-title">{document.title}</span><span className="archive-document-byline">{document.author} · {document.kind}</span></span>{!readIds.has(document.id) && <span className="archive-unread">Unread</span>}</button>)}</div>}
        </section>
      </div> : <div className="archive-reading-room">
        <div className="archive-reader-toolbar"><button type="button" onClick={() => setSelection(null)}><ArrowLeft size={17}/>All discoveries</button><div className="archive-view-switch" role="group" aria-label="Reading presentation">{[['original','Letter'],['book','Codex'],['reading','Text']].map(([value,label]) => <button key={value} type="button" aria-pressed={view === value} onClick={() => chooseView(value)}>{label}</button>)}</div></div>
        <div className="archive-current-title"><h2>{active.title}</h2><span>{active.author}</span></div>
        <div className="archive-reader-content">
          {view === 'book' ? <ReaderBoundary key={selection} onRead={() => chooseView('reading')}><Suspense fallback={<p className="archive-opening" role="status">Opening the binding…</p>}><BookReader key={selection} documents={documents} initialDocumentId={selection} initialParagraph={reading.documentId === selection ? reading.paragraph || 0 : 0} onPosition={onPosition}/></Suspense></ReaderBoundary> : view === 'original' ? <LooseDocument key={selection} document={active} previouslyRead={readIds.has(active.id)} onRead={() => markRead(active.id)}/> : <article className="archive-plain-reader"><header><p>{active.date}</p><h2>{active.title}</h2><p>{active.author}</p></header><DocumentText paragraphs={active.paragraphs}/></article>}
        </div>
        {visibleConnections(active, documents).length > 0 && <details className="archive-connections"><summary>Connections among your finds</summary><div>{visibleConnections(active, documents).map(link => <button type="button" key={link.id} onClick={() => openDocument(link.id)}><span>{link.label}</span><strong>{link.document.title}</strong></button>)}</div></details>}
      </div>}
      <WorldDivider family="sapphire" className="archive-window-divider"/>
      <footer className="world-archive-footer"><span>Collected writing · Volume I</span><a href="/third-party/flipbook/NOTICE.txt" target="_blank" rel="noreferrer">Reader credits</a></footer>
    </section>
  </div>;
}
