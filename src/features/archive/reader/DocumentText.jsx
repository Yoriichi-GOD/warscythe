import { Fragment } from 'react';

export default function DocumentText({ paragraphs, className = '' }) {
  return <div className={`archive-prose ${className}`}>
    {paragraphs.map((paragraph, index) => {
      const note = paragraph.startsWith('*') && paragraph.endsWith('*');
      const text = note ? paragraph.slice(1, -1) : paragraph;
      return <p key={index} className={note ? 'archive-note' : undefined}>{text.split(/(~~.*?~~)/g).map((part, i) => part.startsWith('~~') ? <del key={i}>{part.slice(2, -2)}</del> : <Fragment key={i}>{part}</Fragment>)}</p>;
    })}
  </div>;
}
