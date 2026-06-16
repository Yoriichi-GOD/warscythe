import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { BUNDLE_CONFIG } from '../utils/assetResolver';
import { X, CloudDownload, Trash2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function AssetDownloaderModal({ onClose }) {
  const { downloadedRegions, downloadRegionBundle, deleteRegionBundle } = useWarscytheStore();
  const [loadingRegions, setLoadingRegions] = useState({}); // { [regionId]: boolean }
  const [error, setError] = useState(null);

  const regionsList = Object.entries(BUNDLE_CONFIG).map(([id, config]) => ({
    id: Number(id),
    ...config
  }));

  const handleToggle = async (regionId, isDownloaded) => {
    setLoadingRegions(prev => ({ ...prev, [regionId]: true }));
    setError(null);
    try {
      if (isDownloaded) {
        if (window.confirm(`Are you sure you want to delete the offline bundle for ${BUNDLE_CONFIG[regionId].name}? This will free up storage space.`)) {
          await deleteRegionBundle(regionId);
        }
      } else {
        await downloadRegionBundle(regionId);
      }
    } catch (err) {
      setError(`Failed to process request for ${BUNDLE_CONFIG[regionId].name}. Check connection.`);
    } finally {
      setLoadingRegions(prev => ({ ...prev, [regionId]: false }));
    }
  };

  const isAllDownloaded = regionsList.every(r => downloadedRegions.includes(r.id));
  const isAnyLoading = Object.values(loadingRegions).some(val => val);

  const handleDownloadAll = async () => {
    setError(null);
    const regionsToDownload = regionsList.filter(r => !downloadedRegions.includes(r.id));
    if (regionsToDownload.length === 0) return;

    // Start loading for all target regions
    const newLoading = {};
    regionsToDownload.forEach(r => { newLoading[r.id] = true; });
    setLoadingRegions(prev => ({ ...prev, ...newLoading }));

    try {
      for (const r of regionsToDownload) {
        await downloadRegionBundle(r.id);
      }
    } catch (err) {
      setError('Bulk download failed. Some assets might be incomplete.');
    } finally {
      const finishedLoading = {};
      regionsToDownload.forEach(r => { finishedLoading[r.id] = false; });
      setLoadingRegions(prev => ({ ...prev, ...finishedLoading }));
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Delete all offline region bundles? You will need internet access to load regions beyond Ashwood.')) {
      return;
    }
    setError(null);
    const regionsToDelete = regionsList.filter(r => downloadedRegions.includes(r.id));
    if (regionsToDelete.length === 0) return;

    const newLoading = {};
    regionsToDelete.forEach(r => { newLoading[r.id] = true; });
    setLoadingRegions(prev => ({ ...prev, ...newLoading }));

    try {
      for (const r of regionsToDelete) {
        await deleteRegionBundle(r.id);
      }
    } catch (err) {
      setError('Bulk deletion encountered an issue.');
    } finally {
      const finishedLoading = {};
      regionsToDelete.forEach(r => { finishedLoading[r.id] = false; });
      setLoadingRegions(prev => ({ ...prev, ...finishedLoading }));
    }
  };

  return (
    <div className="modal-backdrop downloader-backdrop" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="downloader-modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.96)), url("/shop-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid var(--border-bright)'
        }}
      >
        {/* Header */}
        <div className="downloader-header">
          <div className="flex items-center gap-3">
            <CloudDownload className="text-gold-core animate-pulse" size={22} />
            <div className="title-group">
              <h2 className="cinzel-title text-base font-bold tracking-widest text-white">TACTICAL CACHE CORE</h2>
              <p className="font-mono text-[8px] text-gold-core/70 tracking-[0.25em] uppercase">OFFLINE REGION ENCODINGS MANAGER</p>
            </div>
          </div>
          <button className="downloader-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Info Box */}
        <div className="downloader-info p-3 bg-white/[0.02] border border-white/5 rounded-md flex flex-col gap-1 mx-6 mt-4">
          <span className="font-mono text-[8.5px] text-gray-400 leading-normal uppercase">
            👉 Regions 1 (Ashwood) and deities/scythes are bundled locally. Complete Region 1 to unlock the map coordinates. Cache the subsequent region assets in advance to ensure lag-free and offline gameplay.
          </span>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mx-6 mt-3 flex items-center gap-2 p-2.5 bg-red-950/20 border border-red-500/20 rounded text-red-400 font-mono text-[9px] uppercase">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Bulk Actions */}
        <div className="mx-6 mt-4 pb-3 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="download-all-chk"
              checked={isAllDownloaded}
              disabled={isAnyLoading}
              onChange={(e) => {
                if (e.target.checked) {
                  handleDownloadAll();
                } else {
                  handleClearAll();
                }
              }}
              className="accent-gold-core cursor-pointer w-3.5 h-3.5"
            />
            <label htmlFor="download-all-chk" className="font-mono text-[9px] text-white uppercase tracking-wider font-extrabold cursor-pointer select-none">
              {isAllDownloaded ? 'ALL BUNDLES CACHED' : 'CACHE ALL REGIONS FOR OFFLINE'}
            </label>
          </div>
          <span className="font-mono text-[8px] text-gray-500">
            TOTAL ENCODINGS: {downloadedRegions.length} / {regionsList.length}
          </span>
        </div>

        {/* List of Bundles */}
        <div className="downloader-body custom-scrollbar flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2.5">
          {regionsList.map(item => {
            const isDownloaded = downloadedRegions.includes(item.id);
            const isLoading = loadingRegions[item.id];

            return (
              <div 
                key={item.id} 
                className={`bundle-row p-3 rounded border flex items-center justify-between transition-all ${
                  isDownloaded 
                    ? 'border-gold-core/25 bg-gold-core/[0.02] shadow-[0_0_10px_rgba(197,160,89,0.02)]' 
                    : 'border-white/5 bg-black/40'
                }`}
              >
                {/* Left Side Info */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wide">
                      Region {item.id}: {item.name}
                    </span>
                    {isDownloaded && !isLoading && (
                      <CheckCircle2 size={12} className="text-[#2ecc71]" />
                    )}
                  </div>
                  <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">
                    SIZE ON DISK: {item.size} • STATUS: {isDownloaded ? 'LOCAL CACHE' : 'REMOTE CDN'}
                  </span>
                </div>

                {/* Right Side Button / Spinner */}
                <button
                  disabled={isLoading}
                  onClick={() => handleToggle(item.id, isDownloaded)}
                  className={`px-3 py-1.5 rounded font-mono text-[8.5px] uppercase font-bold tracking-widest transition-all flex items-center gap-1.5 ${
                    isLoading
                      ? 'bg-transparent text-gold-core border border-gold-core/20'
                      : isDownloaded
                      ? 'bg-red-950/20 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 cursor-pointer'
                      : 'bg-gold-core text-black hover:bg-white hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] cursor-pointer'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={10} className="animate-spin" />
                      <span>SYNCING...</span>
                    </>
                  ) : isDownloaded ? (
                    <>
                      <Trash2 size={10} />
                      <span>DELETE</span>
                    </>
                  ) : (
                    <>
                      <CloudDownload size={10} />
                      <span>DOWNLOAD</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="downloader-footer border-t border-white/5 pt-4 px-6 pb-2 text-center">
          <p className="font-mono text-[8px] text-gray-500 tracking-wider">
            ENCODED ASSETS CACHED LOCALLY ON WEB CACHE STORAGE API
          </p>
        </div>

        <style jsx>{`
          .downloader-backdrop {
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 2200;
          }

          .downloader-modal-content {
            width: 95vw;
            height: 85vh;
            max-width: 650px;
            background-color: #08080a;
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 0 50px rgba(0,0,0,0.8);
            padding: 1.25rem 0;
          }

          .downloader-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            padding: 0 1.5rem 1rem 1.5rem;
          }

          .downloader-close {
            background: none;
            border: none;
            color: var(--text-dark);
            cursor: pointer;
            transition: 0.2s;
          }

          .downloader-close:hover {
            color: #fff;
            transform: rotate(90deg);
          }

          .cinzel-title {
            font-family: 'Cinzel Decorative', 'Cinzel', serif;
          }

          .bundle-row {
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          }
          
          .accent-gold-core {
            accent-color: var(--gold-core);
          }
        `}</style>
      </motion.div>
    </div>
  );
}
