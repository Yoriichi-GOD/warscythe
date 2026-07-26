import React, { useState } from 'react';
import { AlertTriangle, BookOpen, CheckCircle, Flame, ShieldAlert, Trash2, X } from 'lucide-react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import RitualTimePicker from './RitualTimePicker';
import { getRitualMonthStats } from '../utils/ritualMedals';

export default function RitualDetail({ ritualId, onClose, onComplete }) {
  const ritual = useWarscytheStore(state => (state.rituals || []).find(item => item.id === ritualId));
  const updateRitual = useWarscytheStore(state => state.updateRitual);
  const deleteRitual = useWarscytheStore(state => state.deleteRitual);
  const ritualCompletionEvents = useWarscytheStore(state => state.ritualCompletionEvents) || [];
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [draft, setDraft] = useState(() => ritual ? ({
    title: ritual.title || '',
    frequency: ritual.frequency || 'daily',
    effort: ritual.effort || 'Medium',
    targetTime: ritual.targetTime || '',
    notes: ritual.notes || '',
  }) : null);

  if (!ritual || !draft) return null;

  const today = new Date().toISOString().slice(0, 10);
  const isCompletedToday = ritual.lastCompletedAt?.slice(0, 10) === today;
  const monthStats = getRitualMonthStats(ritual, ritualCompletionEvents);
  const saveChanges = () => {
    if (!draft.title.trim()) return;
    updateRitual(ritual.id, {
      ...draft,
      title: draft.title.trim(),
      targetTime: draft.targetTime || null,
    });
    onClose();
  };

  const discardRitual = () => {
    deleteRitual(ritual.id);
    onClose();
  };

  return (
    <div className="ritual-modal-backdrop" onClick={onClose}>
      <div
        className="ritual-modal-panel ritual-edit-panel"
        onClick={event => event.stopPropagation()}
      >
        <header className="ritual-modal-header">
          <div>
            <Flame size={16} />
            <span>ENSHRINED RITUAL</span>
            <h2>EDIT THE VOW</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close ritual details"><X size={17} /></button>
        </header>

        <div className="ritual-edit-body custom-scrollbar">
          <div className="ritual-guardian-brief">
            <img src="/guardian-observer.png" alt="Guardian" />
            <div>
              <span>GUARDIAN // VOW CONTROL</span>
              <p>Nothing is sealed beyond correction. Rename the vow, change its cadence, resistance or hour, add field notes, conquer it for today, or discard it entirely.</p>
            </div>
          </div>

          <label className="ritual-edit-field">
            <span>RITUAL IDENTIFIER</span>
            <input
              value={draft.title}
              onChange={event => setDraft(value => ({ ...value, title: event.target.value }))}
              maxLength={80}
            />
          </label>

          <div className="ritual-detail-grid">
            <div className="ritual-edit-field">
              <span>FREQUENCY</span>
              <div className="ritual-segmented">
                {['daily', 'weekly'].map(value => <button type="button" key={value} className={draft.frequency === value ? 'active' : ''} onClick={() => setDraft(current => ({ ...current, frequency: value }))}>{value}</button>)}
              </div>
            </div>
            <div className="ritual-edit-field">
              <span>RESISTANCE</span>
              <div className="ritual-segmented ritual-effort-segments">
                {['Low', 'Medium', 'High', 'Boss'].map(value => <button type="button" key={value} className={draft.effort === value ? 'active' : ''} onClick={() => setDraft(current => ({ ...current, effort: value }))}>{value}</button>)}
              </div>
            </div>
          </div>

          <div className="ritual-edit-field">
            <span>DISPATCH TIME</span>
            <RitualTimePicker value={draft.targetTime} onChange={targetTime => setDraft(current => ({ ...current, targetTime }))} compact />
          </div>

          <label className="ritual-edit-field">
            <span><BookOpen size={12} /> FIELD NOTES</span>
            <textarea
              placeholder="Record context, rules, or observations for this ritual..."
              value={draft.notes}
              onChange={event => setDraft(value => ({ ...value, notes: event.target.value }))}
            />
          </label>
        </div>

        <footer className="ritual-edit-footer">
          <button className="ritual-save-button" onClick={saveChanges} disabled={!draft.title.trim()}>SEAL CHANGES</button>
          {!isCompletedToday && (
            <button className="ritual-conquer-button" onClick={() => { onComplete(ritual.id); onClose(); }}>
              <CheckCircle size={17} /> CONQUER
            </button>
          )}
          <button className="ritual-delete-button" onClick={() => setShowDeleteWarning(true)} aria-label="Delete ritual"><Trash2 size={17} /></button>
        </footer>

        {showDeleteWarning && (
          <div className="ritual-delete-warning" role="alertdialog" aria-modal="true" aria-labelledby="ritual-delete-title">
            <div className="ritual-delete-warning-card">
              <div className="ritual-delete-warning-sigil"><ShieldAlert size={22} /></div>
              <span>VOW SEVERANCE WARNING</span>
              <h3 id="ritual-delete-title">BREAK THIS RITUAL?</h3>
              <p>
                Deleting <strong>{ritual.title}</strong> ends its active streak and removes it from this month&apos;s medal projection.
                Previously awarded medals remain in the Ledger.
              </p>
              <div className="ritual-delete-impact">
                <div><Flame size={13} /><span>CURRENT STREAK</span><strong>{ritual.streak || 0} DAYS</strong></div>
                <div><AlertTriangle size={13} /><span>MONTHLY RECORD</span><strong>{monthStats.completed} / {monthStats.totalOpportunities} LOGGED</strong></div>
              </div>
              <div className="ritual-delete-warning-actions">
                <button type="button" onClick={() => setShowDeleteWarning(false)}>KEEP THE VOW</button>
                <button type="button" className="confirm-severance" onClick={discardRitual}>SEVER RITUAL</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
