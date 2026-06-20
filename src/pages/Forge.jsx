import React from 'react';
import ScytheCenter from '../components/ScytheCenter';

export default function Forge({ onOpenShop }) {
  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar pb-32">
      <ScytheCenter onOpenShop={onOpenShop} />
    </div>
  );
}
