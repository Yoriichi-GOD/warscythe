import React from 'react';
import MapSection from '../components/MapSection';

export default function QuestMap({
  onTabChange,
  tutorialHighlightNode = null,
  tutorialGuidance = null,
  onTutorialNodeClick = null,
  onTutorialContinue = null,
  tutorialActive = false
}) {
  return (
    <div className="h-auto min-h-full w-full lg:h-full">
      <MapSection 
        onTabChange={onTabChange}
        tutorialHighlightNode={tutorialHighlightNode}
        tutorialGuidance={tutorialGuidance}
        onTutorialNodeClick={onTutorialNodeClick}
        onTutorialContinue={onTutorialContinue}
        tutorialActive={tutorialActive}
      />
    </div>
  );
}
