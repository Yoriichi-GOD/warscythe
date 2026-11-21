import React from 'react';

const TITLE_ROOT = '/fitness-v2/olympus/title';

export default function DeityTitleCard({ deity, className = '' }) {
  if (!deity) return null;
  return <img
    className={`fitness-deity-title-card deity-${deity.id} ${className}`.trim()}
    src={`${TITLE_ROOT}/${deity.id}.webp`}
    alt={`${deity.name} — ${deity.domain}`}
  />;
}
