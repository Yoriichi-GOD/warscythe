import { FrameAsset } from './OrnateFrame';
import './worldDivider.css';

export default function WorldDivider({ family = 'gold', className = '' }) {
  const sapphire = family === 'sapphire';
  return <div className={`world-divider ${className}`} aria-hidden="true">
    <FrameAsset asset={`dividers/${sapphire ? 'sapphire-line' : 'gold-diamond-line'}.webp`} className="world-divider-line"/>
    <FrameAsset asset={`dividers/${sapphire ? 'sapphire-gem' : 'gold-diamond'}.webp`} className="world-divider-gem"/>
  </div>;
}
