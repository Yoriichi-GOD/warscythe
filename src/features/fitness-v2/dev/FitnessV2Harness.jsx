import React from 'react';
import FitnessOlympusExperience from '../FitnessOlympusExperience.jsx';
import { DEITY_ROSTER } from '../domain/deityRoster.js';

const gymLog = Array.from({ length: 28 }, (_, index) => {
  const weight = 80 + index * 2.5;
  const date = new Date(Date.UTC(2026, 6, 1 + index, 6, 30));
  return {
    id: `fitness-v2-preview-${index}`,
    eventUuid: `fitness-v2-preview-event-${index}`,
    date: date.toISOString(),
    split: index % 3 === 0 ? 'SBD Powerlifting Day' : index % 3 === 1 ? 'Upper Push // Bench Focus' : 'Lower Strength // Squat',
    movements: [
      {
        id: `bench-${index}`,
        name: 'Bench Press (Competition)',
        sets: Array.from({ length: 5 }, (_, setIndex) => ({
          id: `bench-${index}-${setIndex}`,
          weight,
          reps: 5,
          rpe: 8,
          type: 'working',
          completed: true,
        })),
      },
      {
        id: `row-${index}`,
        name: 'Barbell Row',
        sets: Array.from({ length: 4 }, (_, setIndex) => ({
          id: `row-${index}-${setIndex}`,
          weight: 70 + index,
          reps: 8,
          rpe: 8,
          type: 'working',
          completed: true,
        })),
      },
    ],
  };
});

export default function FitnessV2Harness() {
  const openChamber = (deityId) => window.dispatchEvent(new CustomEvent('warscythe:fitness-scene', {
    detail: { scene: 'chamber', deityId },
  }));
  const openAscension = (deityId) => window.dispatchEvent(new CustomEvent('warscythe:fitness-scene', {
    detail: { scene: 'ascension', deityId },
  }));
  const openAffinity = (deityId) => window.dispatchEvent(new CustomEvent('warscythe:fitness-scene', {
    detail: { scene: 'affinity', deityId, previousAffinity: 27, nextAffinity: 39, affinityGain: 12 },
  }));
  const openBlessing = (deity) => window.dispatchEvent(new CustomEvent('warscythe:fitness-scene', {
    detail: { scene: 'ceremony', deityId: deity.id, blessingId: deity.blessings[0].id },
  }));

  return (
    <main style={{ minHeight: '100vh', padding: '28px', color: '#ead190', background: 'radial-gradient(circle at 50% 0%, #342815 0%, #080706 38%, #000 100%)' }}>
      <div style={{ width: 'min(900px, 100%)', margin: '0 auto' }}>
        <p style={{ font: '700 10px monospace', letterSpacing: '.22em' }}>FITNESS V2 // CHAMBER VALIDATION</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8, marginBottom: 20 }}>
          {DEITY_ROSTER.map((deity) => <button key={deity.id} onClick={() => openChamber(deity.id)} style={{ padding: '14px 8px', border: `1px solid ${deity.palette}`, color: deity.palette, background: '#050505', font: '800 9px monospace', letterSpacing: '.12em' }}>{deity.name.toUpperCase()}</button>)}
          {DEITY_ROSTER.map((deity) => <button key={`${deity.id}-ascension`} onClick={() => openAscension(deity.id)} style={{ padding: '10px 6px', border: `1px solid ${deity.palette}66`, color: '#dfc986', background: '#050505', font: '700 8px monospace', letterSpacing: '.1em' }}>{deity.name.toUpperCase()} ASCENSION</button>)}
          {DEITY_ROSTER.map((deity) => <button key={`${deity.id}-affinity`} onClick={() => openAffinity(deity.id)} style={{ padding: '10px 6px', border: `1px solid ${deity.palette}55`, color: deity.palette, background: '#050505', font: '700 8px monospace', letterSpacing: '.1em' }}>{deity.name.toUpperCase()} AFFINITY</button>)}
          {DEITY_ROSTER.map((deity) => <button key={`${deity.id}-blessing`} onClick={() => openBlessing(deity)} style={{ padding: '10px 6px', border: `1px solid ${deity.palette}55`, color: '#f0d58d', background: '#050505', font: '700 8px monospace', letterSpacing: '.1em' }}>{deity.name.toUpperCase()} BLESSING</button>)}
        </div>
        <FitnessOlympusExperience gymLog={gymLog} templates={[]} onInitializeTemplate={() => {}} allowResourcePreview />
      </div>
    </main>
  );
}
