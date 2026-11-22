// Physical leaves are a presentation. Discovery IDs and source paragraphs are
// canonical, so changing the viewport never changes what the reader owns.
export function paginateDocuments(documents, { width, height, padding = 28, fontSize = 18, columns = 1 }) {
  const probe = document.createElement('div');
  // Match the actual loaded book face and paragraph rules, including fallbacks.
  probe.className = 'archive-prose archive-pagination-probe';
  Object.assign(probe.style, { position: 'fixed', left: '-10000px', top: '0', visibility: 'hidden', width: `${width - padding * 2}px`, fontFamily: '"EB Garamond", "Times New Roman", Times, serif', fontSize: `${fontSize}px`, lineHeight: '1.6', whiteSpace: 'normal', overflowWrap: 'anywhere' });
  (document.querySelector('.world-archive') || document.body).appendChild(probe);
  const pages = [];
  const headingProbe = document.createElement('header');
  headingProbe.className = 'archive-paper-heading';
  Object.assign(headingProbe.style,{position:'fixed',left:'-10000px',top:'0',visibility:'hidden',height:'auto',width:`${width-padding*2}px`,'--archive-leaf-title':width<340?'18px':'22px'});
  (document.querySelector('.world-archive') || document.body).appendChild(headingProbe);
  try {
    for (const source of documents) {
      headingProbe.replaceChildren(...['span','h2','p'].map((tag,index)=>{const element=document.createElement(tag);element.textContent=[source.kind,source.title,source.author][index];return element;}));
      const headerHeight = Math.max(112,Math.ceil(headingProbe.getBoundingClientRect().height)+16);
      const capacity = Math.max(32,height-padding*2-headerHeight-24);
      let blocks = [];
      const fits = candidate => {
        probe.replaceChildren(...candidate.map(block => { const p = document.createElement('p'); p.style.margin = '0 0 12px'; p.textContent = block.text.replace(/[*~]/g, ''); return p; }));
        return probe.getBoundingClientRect().height <= capacity - 8;
      };
      const finish = () => { if (blocks.length) { pages.push({ document: source, blocks, paragraph: blocks[0].index, headerHeight }); blocks = []; } };
      source.paragraphs.forEach((text, index) => {
        const note = text.startsWith('*') && text.endsWith('*');
        const words = (note ? text.slice(1,-1) : text).split(/\s+/);
        const block = value => ({ text: note ? `*${value}*` : value, index });
        while (words.length) {
          const whole = block(words.join(' '));
          if (fits([...blocks, whole])) { blocks.push(whole); break; }
          if (blocks.length) { finish(); continue; }
          let low = 1, high = words.length, best = 1;
          while (low <= high) { const middle = Math.floor((low + high) / 2); if (fits([{ text: words.slice(0, middle).join(' '), index }])) { best = middle; low = middle + 1; } else high = middle - 1; }
          blocks.push(block(words.splice(0, best).join(' '))); finish();
        }
      });
      finish();
      // Start each document on a new spread. Otherwise an odd opening index
      // lands on the previous document when the engine chooses its left leaf.
      if (columns === 2 && pages.length % 2 === 1) pages.push({ document:source, blocks:[], paragraph:source.paragraphs.length-1, headerHeight, blank:true });
    }
    return pages;
  } finally { probe.remove(); headingProbe.remove(); }
}
