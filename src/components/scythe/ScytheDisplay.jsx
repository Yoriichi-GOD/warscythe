import React from 'react';

export default function ScytheDisplay({ level = "DORMANT", type = "standard", pwr = "10" }) {
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = type === "ultimate" 
    ? `/ultimate/${level.toLowerCase()}.png`
    : `/scythe/${safeLevel}.png`;

  return (
    <div className="scythe-display-container">
      {/* GOLDEN AMBIENT AURA */}
      <div className="scythe-aura" />

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
        <span className="scythe-level-title font-times">{safeLevel} {type === 'ultimate' ? 'ULTIMATE' : 'SCYTHE'}</span>
        <span className="scythe-desc">
          {type === 'ultimate' ? 'The ultimate weapon of a true sovereign.' : 'Complete operations to awaken its true potential.'}
        </span>
        <span className="scythe-pwr-label">{pwr} PWR</span>
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

        .scythe-hero-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 20px 80px rgba(0,0,0,1));
          animation: float-scythe 5s infinite ease-in-out;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
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

        /* Show image once loaded */
        .scythe-hero-img[src] {
          opacity: 1;
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
