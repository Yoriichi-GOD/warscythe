import { useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook, { usePageFlip } from '@gullabs/react-flipbook';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { paginateDocuments } from './paginate';
import DocumentText from './DocumentText';

const NO_POINTERS = [];

function BoundPages({ pages, dimensions, initial, onPosition }) {
  // The engine rebuilds when initialPage changes. A reading position is an
  // output while this binding is mounted, not a new initialPage on every turn.
  const [startPage] = useState(initial);
  const { ref: bookRef, bookProps, page: pageIndex, pageCount, visiblePages, canGoPrev, canGoNext, flipPrev, flipNext } = usePageFlip(startPage);
  const previous = useRef(-1);
  useEffect(() => {
    const page = pages[pageIndex];
    if (!pageCount || !page || previous.current === pageIndex) return;
    previous.current = pageIndex;
    onPosition({ documentId: page.document.id, paragraph: page.paragraph, page: pageIndex });
  }, [pageIndex, pageCount, pages, onPosition]);
  const children = useMemo(() => pages.map((page, index) => <div key={`${page.document.id}-${index}`} data-document-id={page.document.id}>
    <article className="archive-paper archive-book-paper" style={{ padding: dimensions.padding, '--archive-leaf-title': dimensions.width < 340 ? '18px' : '22px' }}>
      <header className="archive-paper-heading" aria-hidden={page.blank || undefined} style={{ height:page.headerHeight, visibility:page.blank ? 'hidden' : undefined }}><span>{page.document.kind}</span><h2>{page.document.title}</h2><p>{page.document.author}</p></header>
      <DocumentText paragraphs={page.blocks.map(block => block.text)} />
      <footer className="archive-paper-folio"><span>{page.document.date}</span><span>{index + 1}</span></footer>
    </article>
  </div>), [pages, dimensions.padding, dimensions.width]);
  return <>
    <div className="archive-book-position" style={{ width: dimensions.width * dimensions.columns, height: dimensions.height }} data-reader-orientation={dimensions.columns === 1 ? 'portrait' : 'spread'}>
      <HTMLFlipBook ref={bookRef} {...bookProps} width={dimensions.width} height={dimensions.height} size="fixed" autoSize={false} usePortrait={dimensions.columns === 1} pointerInput={NO_POINTERS} flipOnClick="never" showPageCorners={false} flippingTime={540} respectReducedMotion pageBackground="#e8d9b8" controls="none" useKeyboard lazyRadius={2} aria-label="Collected documents, bound edition" className="archive-flipbook" liveRegion>{children}</HTMLFlipBook>
    </div>
    <div className="archive-page-controls"><button type="button" aria-label="Previous book page" disabled={!canGoPrev} onClick={() => flipPrev()}><ChevronLeft size={18}/>Previous</button><span role="status">{pageCount ? `Leaf ${visiblePages.map(index => index + 1).join('–')} of ${pageCount}` : 'Opening the book…'}</span><button type="button" aria-label="Next book page" disabled={!canGoNext} onClick={() => flipNext()}>Next<ChevronRight size={18}/></button></div>
  </>;
}

export default function BookReader({ documents, initialDocumentId, initialParagraph = 0, onPosition }) {
  const stage = useRef(null);
  const [anchor, setAnchor] = useState({ documentId: initialDocumentId, paragraph: initialParagraph });
  const callback = useRef(onPosition);
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => { callback.current = onPosition; }, [onPosition]);
  useEffect(() => {
    let frame;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => {
      const rect = stage.current?.getBoundingClientRect(); if (!rect || rect.width < 100) return;
      if (rect.height < 350) { setDimensions(before => before?.compact ? before : { compact:true }); return; }
      const columns = rect.width >= 760 ? 2 : 1;
      const width = Math.floor(Math.min(420, (rect.width - 20) / columns));
      const height = Math.floor(Math.min(650, rect.height - 64, width * 1.55));
      setDimensions(before => before?.width === width && before?.height === height && before?.columns === columns ? before : { width, height, columns, padding: width < 340 ? 20 : 28 });
    }); };
    const observer = new ResizeObserver(update); observer.observe(stage.current); update();
    document.fonts?.ready.then(update);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);
  const pages = useMemo(() => dimensions && !dimensions.compact ? paginateDocuments(documents, dimensions) : [], [documents, dimensions]);
  const initial = Math.max(0, pages.findIndex(page => page.document.id === anchor.documentId && page.paragraph >= anchor.paragraph));
  const onPagePosition = useMemo(() => position => { setAnchor(position); callback.current?.(position); }, []);
  return <div className="archive-book-reader"><div className="archive-book-stage" ref={stage}>
    {dimensions?.compact ? <p className="archive-opening" role="status">This window is too short for a bound page. Choose Text above to keep reading, or make the window taller.</p> : dimensions && pages.length ? <BoundPages key={`${dimensions.width}-${dimensions.height}-${dimensions.columns}`} pages={pages} dimensions={dimensions} initial={initial} onPosition={onPagePosition} /> : <p className="archive-opening" role="status">Laying out the pages…</p>}
  </div></div>;
}
