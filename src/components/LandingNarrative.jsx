import { createElement } from 'react';

export function NarrativeText({ as = 'p', children, className = '', words = false }) {
  const text = typeof children === 'string' ? children : null;
  const parts = text ? (words ? text.split(/\s+/) : text.match(/[^.!?]+(?:[.!?]+|$)/g) || [text]) : null;
  return createElement(as, {
    className: `lp-narrative ${words ? 'lp-narrative--words' : 'lp-narrative--sentences'} ${className}`.trim(),
    'data-copy-reveal': true,
  }, parts ? <><span className="lp-narrative-accessible">{text}</span>{parts.map((part, index) => <span key={index} aria-hidden="true" className="lp-narrative-piece">{part.trim()}{words && index < parts.length - 1 ? '\u00a0' : ''}</span>)}</> : children);
}
