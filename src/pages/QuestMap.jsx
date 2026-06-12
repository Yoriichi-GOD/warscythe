import React from 'react';
import MapSection from '../components/MapSection';

export default function QuestMap({ onTabChange }) {
  return (
    <div className="h-auto min-h-full w-full lg:h-full">
      <MapSection onTabChange={onTabChange} />
    </div>
  );
}
