import React from 'react';

export default function ScytheDisplay({ 
  level = "DORMANT", 
  type = "standard", 
  pwr = "10",
  evolutionStages = [],
  currentStageIndex = 0,
  scytheLevel = "DORMANT",
  onSelectStage = () => {},
  onReturnToActive = () => {},
  previewLevel = null
}) {
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = type === "ultimate" 
    ? `/ultimate/${level.toLowerCase()}.png`
    : `/scythe/${safeLevel}.png`;

  // Find the description of the selected stage
  const selectedStage = evolutionStages?.find(s => s.id === safeLevel);
  const descriptionText = selectedStage 
    ? selectedStage.desc 
    : (type === 'ultimate' ? 'The ultimate weapon of a true sovereign.' : 'Complete operations to awaken its true potential.');

  const isActualLevel = scytheLevel.toUpperCase() === safeLevel;

  return (
    <div className="scythe-display-container">
      {/* GOLDEN AMBIENT AURA */}
      <div className="scythe-aura" />

      {/* MOBILE ONLY HEADER & TIMELINE */}
      <div className="block lg:hidden w-full px-4 pt-4 z-20">
        <div className="text-center mb-1">
          <span className="text-[8px] font-mono text-gray-400 tracking-[0.25em] uppercase block mb-0.5">Weapon Evolution</span>
          <h4 className="text-white font-display text-xs tracking-[0.2em] uppercase font-black">Reaper's Scythe</h4>
        </div>

        {/* HORIZONTAL STEPPER TIMELINE */}
        {evolutionStages && evolutionStages.length > 0 && (
          <div className="relative w-full py-3 flex items-center justify-between px-3 mt-1">
            {/* Connecting line */}
            <div className="absolute top-[21px] left-6 right-6 h-[1px] bg-white/10 z-0" />
            
            {evolutionStages.map((stage, idx) => {
              const isUnlocked = idx <= currentStageIndex;
              const isActive = safeLevel === stage.id;
              const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'][idx] || (idx + 1).toString();
              
              return (
                <button
                  key={stage.id}
                  onClick={() => isUnlocked && onSelectStage(stage.id, stage.pwr)}
                  className={`flex flex-col items-center gap-1 z-10 transition-all focus:outline-none ${
                    !isUnlocked ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  disabled={!isUnlocked}
                >
                  <span className={`text-[9px] font-mono tracking-widest font-black transition-colors ${
                    isActive ? 'text-gold-core scale-110 font-bold' : 'text-white/40'
                  }`}>
                    {roman}
                  </span>
                  
                  {/* Stepper diamond node */}
                  <div className={`w-1.5 h-1.5 rotate-45 border transition-all ${
                    isActive 
                      ? 'border-gold-core bg-gold-core shadow-[0_0_8px_#c5a059]' 
                      : 'border-white/20 bg-black'
                  }`} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 🗡️ HEARTBEAT LEVITATION (HERO SCALING) */}
      <div className="scythe-image-wrapper">
        <img
          key={`${type}-${safeLevel}`}
          src={imagePath}
          alt={`${safeLevel} Scythe`}
          className="scythe-hero-img"
          onError={(e) => { 
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = '/scythe/DORMANT.png'; 
          }}
        />
      </div>

      {/* INFO FOOTER */}
      <div className="scythe-info-footer font-mono">
        {/* Desktop Title */}
        <span className="hidden lg:inline scythe-level-title font-times">
          {safeLevel} {type === 'ultimate' ? 'ULTIMATE' : 'SCYTHE'}
        </span>

        {/* Mobile Title with Diamond Separators */}
        <span className="inline lg:hidden text-white font-times text-[10px] tracking-[0.25em] uppercase font-black">
          ◇ {safeLevel} ◇
        </span>

        {/* Description */}
        <span className="scythe-desc">
          {descriptionText}
        </span>

        {/* Desktop Power Stat */}
        <span className="hidden lg:inline scythe-pwr-label">{pwr} PWR</span>

        {/* Mobile Power & Status Badge */}
        <div className="flex lg:hidden items-center gap-3 mt-1.5">
          <span className="text-[9px] font-mono text-gold-core/70 tracking-widest font-black uppercase">
            {pwr}
          </span>
          <span className="text-white/15">|</span>
          {isActualLevel ? (
            <span className="bg-gold-core text-black text-[7px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded shadow-[0_0_6px_rgba(197,160,89,0.3)]">
              Active
            </span>
          ) : (
            <span className="bg-white/5 border border-white/10 text-white/55 text-[7px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded">
              Preview
            </span>
          )}
        </div>

        {/* Mobile-only Return to Active button */}
        {previewLevel && (
          <button 
            onClick={onReturnToActive}
            className="flex lg:hidden mt-3 text-[7px] font-mono text-gold-core border border-gold-core/20 px-2.5 py-1 rounded hover:bg-gold-core/10 transition-all uppercase tracking-widest pointer-events-auto"
          >
            Return to Active
          </button>
        )}
      </div>

      <style jsx>{`
        .scythe-display-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .scythe-aura {
          position: absolute;
          width: 24rem;
          height: 24rem;
          border-radius: 50%;
          background: rgba(197, 160, 89, 0.08);
          filter: blur(80px);
          pointer-events: none;
          animation: pulse-aura 4s infinite ease-in-out;
        }

        @keyframes pulse-aura {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.9; }
        }

        .scythe-image-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          z-index: 10;
        }

        @media (max-width: 1023px) {
          .scythe-image-wrapper {
            padding-top: 4.5rem;
            padding-bottom: 7.5rem;
            height: auto;
            flex: 1;
          }
        }

        .scythe-hero-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 20px 80px rgba(0,0,0,1));
          animation: float-scythe 5s infinite ease-in-out;
          opacity: 1;
        }

        /* Float animation */
        @keyframes float-scythe {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-16px) scale(1.025);
          }
        }

        .scythe-info-footer {
          position: absolute;
          bottom: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.375rem;
          z-index: 20;
          text-align: center;
          padding: 0 1rem;
        }

        .scythe-level-title {
          color: #fff;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }

        .scythe-desc {
          color: #6b7280;
          font-size: 8px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          line-height: 1.6;
          max-width: 200px;
        }

        .scythe-pwr-label {
          color: rgba(197, 160, 89, 0.5);
          font-size: 8px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          font-weight: bold;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}
