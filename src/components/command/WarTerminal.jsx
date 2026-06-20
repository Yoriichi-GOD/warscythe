import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../../store/useWarscytheStore';
import { REGIONS } from '../../store/constants';
import { Terminal, CornerDownLeft, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export default function WarTerminal({ isOpen, onClose }) {
  const store = useWarscytheStore();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'WAR SCYTHE COMMAND TERMINAL v4.0' },
    { type: 'system', text: 'Type "/" to view list of deployment directives.' }
  ]);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(0);

  const inputRef = useRef(null);
  const historyEndRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Scroll to bottom of history
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Core Commands
  const COMMANDS = [
    { cmd: '/strike', desc: 'Deploy a new task/operation.', params: '[title] /date [val] /threat [val] /region [val] /note [val] /priority [val]' },
    { cmd: '/ritual', desc: 'Forge a new habit/consistency track.', params: '[title] /frequency [daily|weekly]' },
    { cmd: '/workout', desc: 'Initiate a physical fitness log.', params: '[title]' },
    { cmd: '/exercise', desc: 'Add movement sets to active workout.', params: '[name] [sets]x[reps]@[rpe]' }
  ];

  // Parameter values suggestions
  const PARAM_VALUES = {
    '/threat': ['low', 'medium', 'high', 'legendary'],
    '/priority': ['low', 'medium', 'high'],
    '/frequency': ['daily', 'weekly'],
    '/region': REGIONS.slice(0, store.level).map(r => r.name.toLowerCase().replace(/\s+/g, '-')),
    '/date': ['tomorrow', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  };

  // Parsing helper: splits command into title and key-value parameters
  const parseCommand = (rawStr) => {
    const tokens = rawStr.trim().split(/\s+/);
    const command = tokens[0];
    if (!command.startsWith('/')) return { command: null };

    // Group parameters
    const params = {};
    let currentParam = null;
    let titleParts = [];

    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.startsWith('/')) {
        currentParam = token;
        params[currentParam] = [];
      } else {
        if (currentParam) {
          params[currentParam].push(token);
        } else {
          titleParts.push(token);
        }
      }
    }

    // Clean parameter values
    Object.keys(params).forEach(k => {
      params[k] = params[k].join(' ');
    });

    return {
      command,
      title: titleParts.join(' '),
      params
    };
  };

  // Resolve target dates relative to today
  const resolveTargetDate = (dateStr, minDays) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!dateStr) {
      // Default to minimum required days
      const defaultDate = new Date(today);
      defaultDate.setDate(defaultDate.getDate() + minDays);
      return defaultDate.toISOString().slice(0, 10);
    }

    const cleaned = dateStr.toLowerCase().trim();
    if (cleaned === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().slice(0, 10);
    }

    const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    if (daysOfWeek.includes(cleaned)) {
      const targetDay = daysOfWeek.indexOf(cleaned);
      const currentDay = today.getDay();
      let diff = targetDay - currentDay;
      if (diff <= 0) diff += 7; // Next week's day

      const result = new Date(today);
      result.setDate(result.getDate() + diff);
      return result.toISOString().slice(0, 10);
    }

    // Try parsing date directly
    const directDate = new Date(dateStr);
    if (!isNaN(directDate.getTime())) {
      return directDate.toISOString().slice(0, 10);
    }

    return null;
  };

  // Handles executing parsed commands
  const handleExecute = () => {
    if (!input.trim()) return;

    const rawInput = input;
    setInput('');
    setActiveSuggestionIdx(0);

    const parsed = parseCommand(rawInput);
    if (!parsed.command) {
      setHistory(prev => [...prev, 
        { type: 'input', text: rawInput },
        { type: 'error', text: `Command syntax invalid. Directives must initiate with "/".` }
      ]);
      return;
    }

    setHistory(prev => [...prev, { type: 'input', text: rawInput }]);

    // 1. /strike command
    if (parsed.command === '/strike') {
      if (!parsed.title) {
        setHistory(prev => [...prev, { type: 'error', text: 'Directive rejected: Strike title is mandatory.' }]);
        return;
      }

      // Parse parameters
      const threatInput = (parsed.params['/threat'] || 'medium').toLowerCase();
      const threatMap = { low: 'Low', medium: 'Medium', high: 'High', legendary: 'Boss' };
      const effort = threatMap[threatInput] || 'Medium';

      const minDaysMap = { Low: 1, Medium: 3, High: 7, Boss: 14 };
      const minDays = minDaysMap[effort];

      const deadline = resolveTargetDate(parsed.params['/date'], minDays);
      if (!deadline) {
        setHistory(prev => [...prev, { type: 'error', text: 'Directive rejected: Target date is invalid.' }]);
        return;
      }

      const priority = (parsed.params['/priority'] || 'none').toLowerCase();
      const note = parsed.params['/note'] || '';
      
      let category = 'operations';
      const regionInput = parsed.params['/region'];
      if (regionInput) {
        const matchingRegion = REGIONS.find(r => r.name.toLowerCase().replace(/\s+/g, '-') === regionInput.toLowerCase());
        if (matchingRegion) {
          const regionIdx = REGIONS.indexOf(matchingRegion);
          if (regionIdx >= store.level) {
            setHistory(prev => [...prev, { type: 'error', text: `Directive rejected: Region "${matchingRegion.name}" remains locked.` }]);
            return;
          }
          category = matchingRegion.name;
        } else {
          setHistory(prev => [...prev, { type: 'error', text: `Directive rejected: Region "${regionInput}" not found in core map.` }]);
          return;
        }
      }

      // Submit task creation
      const result = store.addTask(parsed.title, category, effort, deadline, priority, []);
      if (result === true) {
        setHistory(prev => [...prev, { type: 'success', text: `STRIKE DEPLOYED: "${parsed.title.toUpperCase()}" registered in ashwood frontier log.` }]);
      } else {
        setHistory(prev => [...prev, { type: 'error', text: `Core Engine rejected operation: ${result}` }]);
      }
    }

    // 2. /ritual command
    else if (parsed.command === '/ritual') {
      if (!parsed.title) {
        setHistory(prev => [...prev, { type: 'error', text: 'Directive rejected: Ritual title is mandatory.' }]);
        return;
      }
      const frequency = (parsed.params['/frequency'] || 'daily').toLowerCase();
      if (frequency !== 'daily' && frequency !== 'weekly') {
        setHistory(prev => [...prev, { type: 'error', text: 'Directive rejected: Frequency must be "daily" or "weekly".' }]);
        return;
      }

      const result = store.addRitual(parsed.title, frequency, 'Low');
      if (result) {
        setHistory(prev => [...prev, { type: 'success', text: `RITUAL FORGED: "${parsed.title.toUpperCase()}" consistency loop established.` }]);
      } else {
        setHistory(prev => [...prev, { type: 'error', text: 'Failed to establish consistency loop.' }]);
      }
    }

    // 3. /workout command
    else if (parsed.command === '/workout') {
      if (!parsed.title) {
        setHistory(prev => [...prev, { type: 'error', text: 'Directive rejected: Workout title is mandatory.' }]);
        return;
      }
      store.startWorkout(parsed.title);
      setHistory(prev => [...prev, { type: 'success', text: `WORKOUT INITIATED: Active fitness log opened for "${parsed.title.toUpperCase()}".` }]);
    }

    // 4. /exercise command
    else if (parsed.command === '/exercise') {
      if (!store.activeWorkout) {
        setHistory(prev => [...prev, { type: 'error', text: 'Directive rejected: No active workout session found. Open with /workout first.' }]);
        return;
      }
      if (!parsed.title) {
        setHistory(prev => [...prev, { type: 'error', text: 'Directive rejected: Exercise name is mandatory. Syntax: /exercise Squat 5x5@8' }]);
        return;
      }

      // Try to parse sets x reps @ rpe (e.g. 5x5@8)
      const restTokens = rawInput.replace('/exercise', '').trim().replace(parsed.title, '').trim().split(/\s+/);
      const spec = restTokens[0] || '1x5@8'; // Default
      const match = spec.match(/(\d+)\s*[xX]\s*(\d+)(?:\s*@\s*(\d+))?/);

      if (!match) {
        setHistory(prev => [...prev, { type: 'error', text: 'Exercise specification invalid. Required syntax format: 5x5 or 5x5@8' }]);
        return;
      }

      const setsCount = parseInt(match[1], 10);
      const repsCount = parseInt(match[2], 10);
      const rpeValue = match[3] ? parseInt(match[3], 10) : 8;

      // Add movement
      store.addMovementToActiveWorkout(parsed.title);
      
      // We need to fetch the newly added movement's ID
      const activeWorkoutState = useWarscytheStore.getState().activeWorkout;
      const movement = activeWorkoutState.movements[activeWorkoutState.movements.length - 1];

      if (movement) {
        for (let s = 0; s < setsCount; s++) {
          store.addSetToMovement(movement.id, 'working');
          const updatedState = useWarscytheStore.getState().activeWorkout;
          const updatedMovement = updatedState.movements.find(m => m.id === movement.id);
          const addedSet = updatedMovement.sets[updatedMovement.sets.length - 1];
          if (addedSet) {
            store.updateSetProperties(movement.id, addedSet.id, {
              reps: repsCount,
              rpe: rpeValue,
              completed: true
            });
          }
        }
        setHistory(prev => [...prev, { type: 'success', text: `EXERCISE ADDED: ${setsCount} sets of ${repsCount} reps @ RPE ${rpeValue} registered under "${parsed.title.toUpperCase()}".` }]);
      } else {
        setHistory(prev => [...prev, { type: 'error', text: 'Failed to append movement to active session.' }]);
      }
    }

    else {
      setHistory(prev => [...prev, { type: 'error', text: `Directive "${parsed.command}" unrecognized.` }]);
    }
  };

  // Get active autocomplete options based on current input text
  const getSuggestions = () => {
    if (!input.startsWith('/')) return [];

    const tokens = input.split(/\s+/);
    const lastToken = tokens[tokens.length - 1] || '';

    // If typing primary command name
    if (tokens.length === 1) {
      return COMMANDS.filter(c => c.cmd.startsWith(lastToken));
    }

    // If typing parameters/arguments
    const lastParamToken = [...tokens].reverse().find(t => t.startsWith('/'));
    if (lastParamToken && PARAM_VALUES[lastParamToken]) {
      const currentArg = lastToken.startsWith('/') ? '' : lastToken;
      return PARAM_VALUES[lastParamToken]
        .filter(v => v.startsWith(currentArg))
        .map(v => ({ cmd: v, desc: `Value for parameter ${lastParamToken}` }));
    }

    // Otherwise suggest parameters for active command
    const activeCmd = tokens[0];
    const matchingCmd = COMMANDS.find(c => c.cmd === activeCmd);
    if (matchingCmd) {
      const activeParams = matchingCmd.params.match(/\/\w+/g) || [];
      return activeParams
        .filter(p => !tokens.includes(p) && p.startsWith(lastToken))
        .map(p => ({ cmd: p, desc: `Parameter option` }));
    }

    return [];
  };

  const suggestions = getSuggestions();

  // Handle autocomplete completion choice
  const selectSuggestion = (option) => {
    const tokens = input.split(/\s+/);
    tokens[tokens.length - 1] = option;
    const nextInput = tokens.join(' ') + ' ';
    setInput(nextInput);
    setActiveSuggestionIdx(0);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (suggestions.length > 0 && e.shiftKey) {
        e.preventDefault();
        selectSuggestion(suggestions[activeSuggestionIdx].cmd);
      } else {
        e.preventDefault();
        handleExecute();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIdx((activeSuggestionIdx + 1) % Math.max(1, suggestions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIdx((activeSuggestionIdx - 1 + suggestions.length) % Math.max(1, suggestions.length));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeSuggestionIdx].cmd);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="terminal-backdrop" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="terminal-window glass-panel"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="terminal-header font-mono">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-gold-core animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.25em] text-white">War Terminal</span>
              </div>
              <span className="text-[7px] text-gray-500 font-bold font-mono">ESC TO ABORT</span>
            </div>

            {/* Logs Area */}
            <div className="terminal-log-area custom-scrollbar font-mono text-[10px]">
              {history.map((log, idx) => (
                <div key={idx} className={`log-row flex gap-2 ${log.type}`}>
                  <span className="log-bullet font-black select-none">
                    {log.type === 'input' ? '>' : '::'}
                  </span>
                  <div className="flex-1 whitespace-pre-wrap leading-relaxed">
                    {log.type === 'error' && <AlertCircle size={10} className="inline mr-1 text-red-500" />}
                    {log.type === 'success' && <CheckCircle size={10} className="inline mr-1 text-gold-core" />}
                    {log.text}
                  </div>
                </div>
              ))}
              <div ref={historyEndRef} />
            </div>

            {/* Autocomplete Box */}
            {suggestions.length > 0 && (
              <div className="terminal-autocomplete font-mono">
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectSuggestion(s.cmd)}
                    className={`autocomplete-row ${idx === activeSuggestionIdx ? 'active' : ''}`}
                  >
                    <span className="text-gold-core font-bold font-mono text-[9px]">{s.cmd}</span>
                    <span className="text-gray-500 font-mono text-[8px] truncate">{s.desc}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="terminal-input-bar font-mono">
              <span className="terminal-prompt select-none text-gold-core font-black">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value); setActiveSuggestionIdx(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Type directive... (e.g. /strike Finish application /threat legendary)"
                className="terminal-input-field"
              />
              <button onClick={handleExecute} className="terminal-enter-btn">
                <CornerDownLeft size={12} className="text-gold-core" />
              </button>
            </div>
          </motion.div>

          <style jsx>{`
            .terminal-backdrop {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.85);
              backdrop-filter: blur(16px);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
              padding: 1.5rem;
            }

            .terminal-window {
              width: 100%;
              max-width: 580px;
              background: rgba(5, 5, 8, 0.95) !important;
              border: 1px solid rgba(197, 160, 89, 0.3) !important;
              box-shadow: 0 25px 75px rgba(0,0,0,0.9), 0 0 25px rgba(197,160,89,0.05);
              border-radius: 6px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              height: 400px;
            }

            .terminal-header {
              padding: 0.75rem 1rem;
              background: rgba(197, 160, 89, 0.05);
              border-bottom: 1px solid rgba(197, 160, 89, 0.15);
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            .terminal-log-area {
              flex: 1;
              overflow-y: auto;
              padding: 1.25rem 1rem;
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .log-row.system { color: #8c6a4a; opacity: 0.85; }
            .log-row.input { color: #ffffff; }
            .log-row.success { color: var(--gold-core); }
            .log-row.error { color: #ef4444; }

            .log-bullet {
              color: rgba(197, 160, 89, 0.4);
            }

            .terminal-autocomplete {
              background: rgba(10, 10, 15, 0.98);
              border-top: 1px solid rgba(197, 160, 89, 0.15);
              border-bottom: 1px solid rgba(197, 160, 89, 0.15);
              max-height: 120px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
            }

            .autocomplete-row {
              padding: 0.5rem 1rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              cursor: pointer;
              transition: 0.1s;
            }

            .autocomplete-row:hover, .autocomplete-row.active {
              background: rgba(197, 160, 89, 0.1);
            }

            .terminal-input-bar {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.75rem 1rem;
              background: rgba(0, 0, 0, 0.4);
              border-top: 1px solid rgba(197, 160, 89, 0.15);
            }

            .terminal-prompt {
              font-size: 11px;
            }

            .terminal-input-field {
              flex: 1;
              background: transparent;
              border: none;
              outline: none;
              color: #fff;
              font-family: inherit;
              font-size: 10px;
              letter-spacing: 0.05em;
            }

            .terminal-input-field::placeholder {
              color: #4b5563;
            }

            .terminal-enter-btn {
              background: none;
              border: none;
              cursor: pointer;
              padding: 4px;
              opacity: 0.7;
              transition: 0.2s;
            }

            .terminal-enter-btn:hover {
              opacity: 1;
              transform: scale(1.1);
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
