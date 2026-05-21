import React from 'react';
import MapSection from '../components/MapSection';

export default function QuestMap({ onTabChange }) {
  return (
    <div className="h-full w-full">
      <MapSection onTabChange={onTabChange} />
    </div>
  );
}
