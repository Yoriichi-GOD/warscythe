import React from 'react';
import MapSection from '../components/MapSection';

export default function QuestMap({ onTabChange, tutorialHighlightNode = null, onTutorialNodeClick = null, tutorialActive = false }) {
  return (
    <div className="h-auto min-h-full w-full lg:h-full">
      <MapSection 
        onTabChange={onTabChange}
        tutorialHighlightNode={tutorialHighlightNode}
        onTutorialNodeClick={onTutorialNodeClick}
        tutorialActive={tutorialActive}
      />
    </div>
  );
}
