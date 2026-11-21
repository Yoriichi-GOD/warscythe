import frameAssets from './frameAssets.json';
import './ornateFrames.css';

const FAMILIES = {
  universal: { corner: 'universal/corner.webp', rail: 'universal/rail.webp', center: 'universal/center.webp' },
  ledger: { corner: 'ledger/corner.webp', rail: 'ledger/rail.webp', center: 'ledger/center.webp' },
  artifact: { corner: 'ledger/corner-artifact.webp', rail: 'ledger/rail-artifact.webp', center: 'ledger/center-artifact.webp' },
  hermes: { corner: 'divine/hermes/corner.webp', rail: 'divine/hermes/rail.webp', center: 'divine/hermes/top-ornament.webp' },
  apollo: { corner: 'divine/apollo/corner.webp', rail: 'divine/apollo/rail.webp', center: 'divine/apollo/top-ornament.webp' },
  ares: { corner: 'divine/ares/corner.webp', rail: 'divine/ares/rail.webp', center: 'divine/ares/top-ornament.webp' },
  hercules: { corner: 'divine/hercules/corner.webp', rail: 'divine/hercules/rail.webp', center: 'divine/hercules/top-ornament.webp' },
  zeus: { corner: 'divine/zeus/corner.webp', rail: 'divine/zeus/rail.webp', center: 'divine/zeus/top-ornament.webp' },
};

// SVG's viewBox trims transparent canvas padding without altering the source pixels.
// Layout follows visible alpha bounds; corners retain their original aspect ratio.
export function FrameAsset({ asset, className = '', vertical = false, stretch = false, style }) {
  const meta = frameAssets[asset];
  if (!meta) return null;
  const { ink, width, height } = meta;
  const viewBox = vertical
    ? `${height - ink.top - ink.height} ${ink.left} ${ink.height} ${ink.width}`
    : `${ink.left} ${ink.top} ${ink.width} ${ink.height}`;
  return (
    <svg
      className={`frame-asset ${className}`.trim()}
      data-frame-asset={asset}
      viewBox={viewBox}
      preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
      style={{ aspectRatio: vertical ? `${ink.height} / ${ink.width}` : `${ink.width} / ${ink.height}`, ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <image href={`/frames/${asset}`} width={width} height={height} transform={vertical ? `translate(${height} 0) rotate(90)` : undefined} />
    </svg>
  );
}

export default function OrnateFrame({ family = 'universal', quiet = false, crest = false, className = '' }) {
  const pieces = FAMILIES[family] || FAMILIES.universal;
  const meta = frameAssets[pieces.corner];
  const anchorX = (meta.anchor.x - meta.ink.left) / meta.ink.width;
  const anchorY = (meta.anchor.y - meta.ink.top) / meta.ink.width;
  const horizontalReach = (meta.ink.left + meta.ink.width - meta.anchor.x) / meta.ink.width;
  const verticalReach = (meta.ink.top + meta.ink.height - meta.anchor.y) / meta.ink.width;
  return (
    <span
      className={`ornate-frame ornate-frame--${quiet ? 'quiet' : 'panel'} ${className}`.trim()}
      data-frame-family={family}
      style={{ '--frame-anchor-x': anchorX, '--frame-anchor-y': anchorY, '--frame-horizontal-reach': horizontalReach, '--frame-vertical-reach': verticalReach }}
      aria-hidden="true"
    >
      {!quiet && ['top', 'bottom', 'left', 'right'].map(side => (
        <span key={side} className={`ornate-frame-rail ornate-frame-rail--${side}`}>
          <FrameAsset asset={pieces.rail} vertical={side === 'left' || side === 'right'} stretch />
        </span>
      ))}
      {(quiet ? ['tl', 'br'] : ['tl', 'tr', 'bl', 'br']).map(corner => (
        <span key={corner} className={`ornate-frame-corner ornate-frame-corner--${corner}`}>
          <FrameAsset asset={pieces.corner} />
        </span>
      ))}
      {crest && !quiet && <FrameAsset asset={pieces.center} className="ornate-frame-crest" />}
    </span>
  );
}

export function LegionAvatarFrame({ level = 1, children, className = '' }) {
  const tier = Math.max(1, Math.min(10, Math.floor(Number(level) || 1)));
  return <span className={`legion-framed-avatar ${className}`.trim()}><span className="legion-framed-avatar-content">{children}</span><FrameAsset asset={`legion/avatar-frames/legion-frame-${String(tier).padStart(2, '0')}.webp`} /></span>;
}
