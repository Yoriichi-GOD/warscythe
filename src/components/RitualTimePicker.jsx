import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';

const parseTime = (value) => {
  if (!value) return { hour: 8, minute: 0, period: 'AM' };
  const [rawHour, rawMinute] = value.split(':').map(Number);
  return {
    hour: rawHour % 12 || 12,
    minute: Number.isFinite(rawMinute) ? rawMinute : 0,
    period: rawHour >= 12 ? 'PM' : 'AM',
  };
};

const toTimeValue = ({ hour, minute, period }) => {
  let hour24 = hour % 12;
  if (period === 'PM') hour24 += 12;
  return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export default function RitualTimePicker({ value, onChange, onCommit, compact = false, clearLabel = 'Clear ritual time' }) {
  const initial = useMemo(() => parseTime(value), [value]);
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState(initial);

  const updateSelection = (next) => {
    setSelection(next);
    onChange(toTimeValue(next));
    onCommit?.(toTimeValue(next));
  };

  const shiftHour = (delta) => {
    const nextHour = ((selection.hour - 1 + delta + 12) % 12) + 1;
    updateSelection({ ...selection, hour: nextHour });
  };

  const shiftMinute = (delta) => {
    const total = selection.hour * 60 + selection.minute + delta;
    const wrapped = ((total % 720) + 720) % 720;
    const nextHour = Math.floor(wrapped / 60) || 12;
    updateSelection({ ...selection, hour: nextHour, minute: wrapped % 60 });
  };

  const clearTime = (event) => {
    event.stopPropagation();
    onChange('');
    setOpen(false);
  };

  const commitSelection = () => {
    const committedTime = toTimeValue(selection);
    onChange(committedTime);
    onCommit?.(committedTime);
    setOpen(false);
  };

  const display = value
    ? new Date(`2000-01-01T${value}:00`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : 'CHOOSE DISPATCH TIME';

  return (
    <div className={`ritual-time-picker ${compact ? 'is-compact' : ''}`}>
      <button type="button" className="ritual-time-trigger" onClick={() => setOpen(current => !current)}>
        <Clock size={14} />
        <span>{display}</span>
        {value ? (
          <span className="ritual-time-clear" role="button" tabIndex={0} onClick={clearTime} aria-label={clearLabel}><X size={13} /></span>
        ) : (
          <ChevronDown size={14} />
        )}
      </button>

      {open && (
        <div className="ritual-time-popover">
          <div className="ritual-time-column">
            <span>HOUR</span>
            <div>
              <button type="button" onClick={() => shiftHour(-1)} aria-label="Previous hour"><ChevronLeft size={14} /></button>
              <strong>{String(selection.hour).padStart(2, '0')}</strong>
              <button type="button" onClick={() => shiftHour(1)} aria-label="Next hour"><ChevronRight size={14} /></button>
            </div>
          </div>

          <div className="ritual-time-divider">:</div>

          <div className="ritual-time-column">
            <span>MINUTE</span>
            <div>
              <button type="button" onClick={() => shiftMinute(-5)} aria-label="Previous five minutes"><ChevronLeft size={14} /></button>
              <strong>{String(selection.minute).padStart(2, '0')}</strong>
              <button type="button" onClick={() => shiftMinute(5)} aria-label="Next five minutes"><ChevronRight size={14} /></button>
            </div>
          </div>

          <div className="ritual-period-toggle">
            {['AM', 'PM'].map(period => (
              <button
                type="button"
                key={period}
                className={selection.period === period ? 'active' : ''}
                onClick={() => updateSelection({ ...selection, period })}
              >
                {period}
              </button>
            ))}
          </div>

          <button type="button" className="ritual-time-done" onClick={commitSelection}>SET TIME</button>
        </div>
      )}
    </div>
  );
}
