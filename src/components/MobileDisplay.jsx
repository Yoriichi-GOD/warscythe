import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import './mobileDisplay.css';

export default function MobileDisplayToggle({ id, label, display, sideways = false }) {
  const SideArrow = display.collapsed ? ChevronLeft : ChevronRight;
  return <button type="button" className={`mobile-display-toggle${sideways ? ' mobile-display-toggle--sideways' : ''}`} aria-label={sideways ? `${display.collapsed ? 'Expand' : 'Collapse'} ${label}` : undefined} aria-expanded={!display.collapsed} aria-controls={id} onClick={display.toggle} disabled={display.forceOpen}>
    <span className="display-toggle-label">{label}</span><span className="display-toggle-action"><span className="display-toggle-action-text">{display.collapsed ? 'Show' : 'Hide'}</span>{sideways ? <SideArrow size={18} /> : <ChevronDown size={15} style={{ transform: display.collapsed ? undefined : 'rotate(180deg)' }} />}</span>
  </button>;
}
