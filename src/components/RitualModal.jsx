import React, { useEffect, useState } from 'react';
import { Activity, ChevronDown, Crosshair, ShieldAlert, X, Zap } from 'lucide-react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { HABIT_TEMPLATES } from '../store/constants';
import RitualTimePicker from './RitualTimePicker';

const frequencyOptions = [
  { value: 'daily', label: 'DAILY REPETITION' },
  { value: 'weekly', label: 'WEEKLY CADENCE' },
];

const effortOptions = [
  { value: 'Low', label: 'RECON (LOW)' },
  { value: 'Medium', label: 'SKIRMISH (MED)' },
  { value: 'High', label: 'ASSAULT (HIGH)' },
  { value: 'Boss', label: 'BOSS RAID' },
];

function RitualSelectField({
  id,
  label,
  icon,
  value,
  options,
  fieldClass,
  interactive,
  openMenu,
  setOpenMenu,
  onSelect,
  onAdvance,
}) {
  return (
    <div className={`ritual-create-field ${fieldClass}`}>
      <label>{icon} {label}</label>
      <div className="ritual-select">
        <button
          type="button"
          className="ritual-select-trigger"
          onClick={() => interactive && setOpenMenu(openMenu === id ? null : id)}
        >
          <span>{options.find(option => option.value === value)?.label || value}</span>
          <ChevronDown size={13} />
        </button>
        {openMenu === id && (
          <div className="ritual-select-menu">
            {options.map(option => (
              <button
                type="button"
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  setOpenMenu(null);
                  onAdvance?.();
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RitualModal({
  onClose,
  tutorialMode = false,
  initialDraft = null,
  onDraftChange,
  onSubmitted,
}) {
  const [title, setTitle] = useState(initialDraft?.title || '');
  const [frequency, setFrequency] = useState(initialDraft?.frequency || 'daily');
  const [effort, setEffort] = useState(initialDraft?.effort || 'Medium');
  const [targetTime, setTargetTime] = useState(initialDraft?.targetTime || '');
  const [openMenu, setOpenMenu] = useState(null);
  const [tutorialStage, setTutorialStage] = useState(0);

  const addRitual = useWarscytheStore(state => state.addRitual);
  const triggerBossFlash = useWarscytheStore(state => state.triggerBossFlash);

  useEffect(() => {
    if (!tutorialMode) onDraftChange?.({ title, frequency, effort, targetTime });
  }, [title, frequency, effort, targetTime, tutorialMode, onDraftChange]);

  const fieldState = (stage) => {
    if (!tutorialMode) return '';
    return tutorialStage === stage ? 'tutorial-active' : 'tutorial-locked';
  };

  const selectPreset = (presetTitle) => {
    const preset = HABIT_TEMPLATES.find(item => item.title === presetTitle);
    if (preset) {
      setTitle(preset.title);
      setEffort(preset.effort);
    }
    setOpenMenu(null);
    if (tutorialMode) setTutorialStage(1);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    if (tutorialMode) {
      if (tutorialStage < 4) return;
      onClose({ title: title.trim(), frequency, effort, targetTime: targetTime || null });
      return;
    }
    if (addRitual(title.trim(), frequency, effort, targetTime || null)) {
      onSubmitted?.();
      if (effort === 'Boss') triggerBossFlash('initiate');
      onClose();
    }
  };

  return (
    <div className="ritual-modal-backdrop" onClick={tutorialMode ? undefined : onClose}>
      <div className="ritual-modal-panel" onClick={event => event.stopPropagation()}>
        <header className="ritual-modal-header">
          <div>
            <Crosshair size={16} />
            <span>RITUAL FORGE</span>
            <h2>ENSHRINE RITUAL</h2>
          </div>
          {!tutorialMode && <button type="button" onClick={onClose} aria-label="Close ritual creation"><X size={17} /></button>}
        </header>

        {tutorialMode && (
          <div className="ritual-rehearsal-order">
            <span>OATHBOUND REHEARSAL // {tutorialStage + 1} OF 5</span>
            <strong>
              {tutorialStage === 0 && 'CHOOSE A PRESET TO GIVE THE RITUAL ITS FIRST FORM.'}
              {tutorialStage === 1 && 'CHOOSE HOW OFTEN THIS VOW RETURNS.'}
              {tutorialStage === 2 && 'CHOOSE THE RESISTANCE THIS VOW DEMANDS.'}
              {tutorialStage === 3 && 'SET THE HOUR AT WHICH THIS VOW CALLS YOU BACK.'}
              {tutorialStage === 4 && 'THE FORM IS READY. CONFIRM ITS ENSHRINEMENT.'}
            </strong>
          </div>
        )}

        <form onSubmit={submit} className="ritual-create-form">
          <div className={`ritual-create-field ritual-preset-field ${fieldState(0)}`}>
            <label><Zap size={11} /> TEMPLATE PRESET</label>
            <div className="ritual-select">
              <button type="button" className="ritual-select-trigger" onClick={() => (!tutorialMode || tutorialStage === 0) && setOpenMenu(openMenu === 'preset' ? null : 'preset')}>
                <span>{title || 'SELECT QUICK HABIT'}</span><ChevronDown size={13} />
              </button>
              {openMenu === 'preset' && (
                <div className="ritual-select-menu ritual-preset-menu custom-scrollbar">
                  {HABIT_TEMPLATES.map(template => (
                    <button type="button" key={template.title} onClick={() => selectPreset(template.title)}>
                      <span>{template.title}</span><small>{template.effort}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`ritual-create-field ritual-name-field ${tutorialMode ? 'tutorial-derived' : ''}`}>
            <label><Zap size={11} /> RITUAL IDENTIFIER</label>
            <input
              type="text"
              placeholder="ENTER HABIT ROUTINE..."
              value={title}
              onChange={event => !tutorialMode && setTitle(event.target.value)}
              required
            />
          </div>

          <div className="ritual-create-grid">
            <RitualSelectField
              id="frequency"
              label="FREQUENCY"
              icon={<ShieldAlert size={11} />}
              value={frequency}
              options={frequencyOptions}
              fieldClass={fieldState(1)}
              interactive={!tutorialMode || tutorialStage === 1}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              onSelect={setFrequency}
              onAdvance={() => tutorialMode && setTutorialStage(2)}
            />
            <RitualSelectField
              id="effort"
              label="RESISTANCE"
              icon={<Activity size={11} />}
              value={effort}
              options={effortOptions}
              fieldClass={fieldState(2)}
              interactive={!tutorialMode || tutorialStage === 2}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              onSelect={setEffort}
              onAdvance={() => tutorialMode && setTutorialStage(3)}
            />
          </div>

          <div className={`ritual-create-field ritual-time-field ${fieldState(3)}`}>
            <label><Zap size={11} /> TARGET TIME <small>OPTIONAL ALERT CUE</small></label>
            <RitualTimePicker
              value={targetTime}
              onChange={setTargetTime}
              onCommit={() => tutorialMode && setTutorialStage(4)}
              compact
            />
          </div>

          <div className={`ritual-modal-footer ${fieldState(4)}`}>
            <button type="submit" disabled={!title.trim() || (tutorialMode && tutorialStage !== 4)}>
              CONFIRM ENSHRINEMENT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
