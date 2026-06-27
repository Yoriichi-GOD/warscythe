import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { BUNDLE_CONFIG } from '../utils/assetResolver';
import { X, CloudDownload, Trash2, CheckCircle2, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function AssetDownloaderModal({ onClose }) {
  const { downloadedRegions, downloadRegionBundle, deleteRegionBundle } = useWarscytheStore();
  const [downloadedItemIds, setDownloadedItemIds] = useState([]);
  const [loadingItems, setLoadingItems] = useState({}); // { [subId]: boolean }
  const [expandedCats, setExpandedCats] = useState({ regions: true, premium_scythes: false }); // Regions expanded by default
  const [error, setError] = useState(null);

  // Dynamic Cache Check
  const runCacheCheck = async () => {
    try {
      const { isBundled, getAssetUrl } = await import('../utils/assetResolver');
      const cache = await caches.open('warscythe-region-assets');
      const found = [];

      for (const [catKey, cat] of Object.entries(BUNDLE_CONFIG)) {
        for (const [subId, item] of Object.entries(cat.items)) {
          let allValid = true;
          for (const file of item.files) {
            if (!isBundled(file)) {
              const match = await cache.match(getAssetUrl(`/${file}`));
              if (!match) {
                allValid = false;
                break;
              }
            }
          }
          if (allValid) {
            found.push(String(subId));
          }
        }
      }
      setDownloadedItemIds(found);
      useWarscytheStore.setState({ downloadedRegions: found });
    } catch (e) {
      console.error('Cache scan failed:', e);
    }
  };

  useEffect(() => {
    runCacheCheck();
  }, [downloadedRegions]);

  const getItemName = (catKey, subId) => {
    return BUNDLE_CONFIG[catKey]?.items[subId]?.name || subId;
  };

  const getCategoryStatus = (catKey) => {
    const cat = BUNDLE_CONFIG[catKey];
    const subIds = Object.keys(cat.items);
    const downloadedSubIds = subIds.filter(id => downloadedItemIds.includes(String(id)));
    
    return {
      total: subIds.length,
      downloadedCount: downloadedSubIds.length,
      isFullyDownloaded: downloadedSubIds.length === subIds.length,
      isPartiallyDownloaded: downloadedSubIds.length > 0 && downloadedSubIds.length < subIds.length
    };
  };

  const handleToggleItem = async (catKey, subId, isCurrentlyDownloaded) => {
    if (['deities', 'artifacts', 'nodes'].includes(catKey)) return;

    setLoadingItems(prev => ({ ...prev, [subId]: true }));
    setError(null);
    try {
      if (isCurrentlyDownloaded) {
        if (window.confirm(`Are you sure you want to delete the offline assets for "${getItemName(catKey, subId)}"?`)) {
          await deleteRegionBundle(subId);
        }
      } else {
        await downloadRegionBundle(subId);
      }
      await runCacheCheck();
    } catch (err) {
      setError(`Failed to update assets. Check connection.`);
    } finally {
      setLoadingItems(prev => ({ ...prev, [subId]: false }));
    }
  };

  const handleToggleCategory = async (catKey, isCatFullyDownloaded) => {
    if (['deities', 'artifacts', 'nodes'].includes(catKey)) return;

    const cat = BUNDLE_CONFIG[catKey];
    const subIds = Object.keys(cat.items);
    setError(null);

    if (isCatFullyDownloaded) {
      if (!window.confirm(`Delete all offline assets in "${cat.name}"?`)) return;
      const toDelete = subIds.filter(id => downloadedItemIds.includes(String(id)));
      if (toDelete.length === 0) return;

      const loadState = {};
      toDelete.forEach(id => { loadState[id] = true; });
      setLoadingItems(prev => ({ ...prev, ...loadState }));

      try {
        for (const id of toDelete) {
          await deleteRegionBundle(id);
        }
        await runCacheCheck();
      } catch (err) {
        setError(`Failed to clear assets for "${cat.name}".`);
      } finally {
        const resetLoadState = {};
        toDelete.forEach(id => { resetLoadState[id] = false; });
        setLoadingItems(prev => ({ ...prev, ...resetLoadState }));
      }
    } else {
      const toDownload = subIds.filter(id => !downloadedItemIds.includes(String(id)));
      if (toDownload.length === 0) return;

      const loadState = {};
      toDownload.forEach(id => { loadState[id] = true; });
      setLoadingItems(prev => ({ ...prev, ...loadState }));

      try {
        for (const id of toDownload) {
          await downloadRegionBundle(id);
        }
        await runCacheCheck();
      } catch (err) {
        setError(`Failed to download assets for "${cat.name}".`);
      } finally {
        const resetLoadState = {};
        toDownload.forEach(id => { resetLoadState[id] = false; });
        setLoadingItems(prev => ({ ...prev, ...resetLoadState }));
      }
    }
  };

  const downloadableCategories = Object.keys(BUNDLE_CONFIG).filter(k => !['deities', 'artifacts', 'nodes'].includes(k));
  const isAllDownloaded = downloadableCategories.every(k => getCategoryStatus(k).isFullyDownloaded);
  const isAnyLoading = Object.values(loadingItems).some(val => val);

  const handleDownloadAll = async () => {
    setError(null);
    const toDownload = [];
    downloadableCategories.forEach(catKey => {
      const subIds = Object.keys(BUNDLE_CONFIG[catKey].items);
      subIds.forEach(id => {
        if (!downloadedItemIds.includes(String(id))) {
          toDownload.push(id);
        }
      });
    });

    if (toDownload.length === 0) return;

    const loadState = {};
    toDownload.forEach(id => { loadState[id] = true; });
    setLoadingItems(prev => ({ ...prev, ...loadState }));

    try {
      for (const id of toDownload) {
        await downloadRegionBundle(id);
      }
      await runCacheCheck();
    } catch (err) {
      setError('Bulk download failed. Some assets might be incomplete.');
    } finally {
      const resetLoadState = {};
      toDownload.forEach(id => { resetLoadState[id] = false; });
      setLoadingItems(prev => ({ ...prev, ...resetLoadState }));
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Delete all offline custom assets? You will need internet access to load regions and skins.')) {
      return;
    }
    setError(null);
    const toDelete = [];
    downloadableCategories.forEach(catKey => {
      const subIds = Object.keys(BUNDLE_CONFIG[catKey].items);
      subIds.forEach(id => {
        if (downloadedItemIds.includes(String(id))) {
          toDelete.push(id);
        }
      });
    });

    if (toDelete.length === 0) return;

    const loadState = {};
    toDelete.forEach(id => { loadState[id] = true; });
    setLoadingItems(prev => ({ ...prev, ...loadState }));

    try {
      for (const id of toDelete) {
        await deleteRegionBundle(id);
      }
      await runCacheCheck();
    } catch (err) {
      setError('Bulk deletion encountered an issue.');
    } finally {
      const resetLoadState = {};
      toDelete.forEach(id => { resetLoadState[id] = false; });
      setLoadingItems(prev => ({ ...prev, ...resetLoadState }));
    }
  };

  const toggleExpand = (catKey) => {
    setExpandedCats(prev => ({ ...prev, [catKey]: !prev[catKey] }));
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
            TOTAL ENCODINGS: {downloadedItemIds.length} / {Object.values(BUNDLE_CONFIG).reduce((sum, c) => sum + Object.keys(c.items).length, 0)}
          </span>
        </div>

        {/* Categories Accordion */}
        <div className="downloader-body custom-scrollbar flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {Object.entries(BUNDLE_CONFIG).map(([catKey, cat]) => {
            const status = getCategoryStatus(catKey);
            const isBaseGroup = ['deities', 'artifacts', 'nodes'].includes(catKey);
            const isExpanded = !!expandedCats[catKey];

            return (
              <div key={catKey} className="flex flex-col gap-2">
                {/* Category Header Row (styled like a row card) */}
                <div 
                  onClick={() => toggleExpand(catKey)}
                  className="category-card p-3 rounded border border-white/10 bg-black/60 flex items-center justify-between transition-all hover:bg-black/80 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    {isExpanded ? <ChevronUp size={12} className="text-gold-core" /> : <ChevronDown size={12} className="text-gray-500" />}
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">{cat.name}</span>
                      <span className="font-mono text-[7.5px] text-gray-500 uppercase tracking-widest mt-0.5">
                        {isBaseGroup ? 'BUNDLED IN BASE APP' : `STATUS: ${status.downloadedCount}/${status.total} CACHED`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center" onClick={e => e.stopPropagation()}>
                    <input 
                      type="checkbox"
                      checked={status.isFullyDownloaded}
                      disabled={isBaseGroup || isAnyLoading}
                      ref={el => {
                        if (el) {
                          el.indeterminate = status.isPartiallyDownloaded;
                        }
                      }}
                      onChange={() => handleToggleCategory(catKey, status.isFullyDownloaded)}
                      className="accent-gold-core cursor-pointer w-3.5 h-3.5"
                    />
                  </div>
                </div>

                {/* Sub Items (accordion panel) */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden flex flex-col gap-2 pl-4"
                    >
                      {Object.entries(cat.items).map(([subId, item]) => {
                        const isItemDownloaded = downloadedItemIds.includes(String(subId)) || isBaseGroup;
                        const isItemLoading = !!loadingItems[subId];

                        return (
                          <div 
                            key={subId} 
                            className={`bundle-row p-3 rounded border flex items-center justify-between transition-all ${
                              isItemDownloaded 
                                ? 'border-gold-core/25 bg-gold-core/[0.02] shadow-[0_0_10px_rgba(197,160,89,0.02)]' 
                                : 'border-white/5 bg-black/40'
                            }`}
                          >
                            {/* Left Side Info */}
                            <div className="flex flex-col gap-0.5 text-left">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wide">
                                  {item.name}
                                </span>
                                {isItemDownloaded && !isItemLoading && (
                                  <CheckCircle2 size={12} className="text-[#2ecc71]" />
                                )}
                              </div>
                              <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">
                                SIZE ON DISK: {item.size} • STATUS: {isBaseGroup ? 'LOCAL BUNDLE' : (isItemDownloaded ? 'LOCAL CACHE' : 'REMOTE CDN')}
                              </span>
                            </div>

                            {/* Right Side Button / Spinner */}
                            <button
                              disabled={isBaseGroup || isItemLoading}
                              onClick={() => handleToggleItem(catKey, subId, isItemDownloaded)}
                              className={`px-3 py-1.5 rounded font-mono text-[8.5px] uppercase font-bold tracking-widest transition-all flex items-center gap-1.5 ${
                                isBaseGroup
                                  ? 'bg-transparent text-gray-500 border border-transparent cursor-default'
                                  : isItemLoading
                                  ? 'bg-transparent text-gold-core border border-gold-core/20'
                                  : isItemDownloaded
                                  ? 'bg-red-950/20 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 cursor-pointer'
                                  : 'bg-gold-core text-black hover:bg-white hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] cursor-pointer'
                              }`}
                            >
                              {isItemLoading ? (
                                <>
                                  <Loader2 size={10} className="animate-spin" />
                                  <span>SYNCING...</span>
                                </>
                              ) : isBaseGroup ? (
                                <span>INSTALLED</span>
                              ) : isItemDownloaded ? (
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
                    </motion.div>
                  )}
                </AnimatePresence>
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

          /* Custom Scrollbar for Downloader Body */
          .downloader-body::-webkit-scrollbar {
            width: 10px;
            display: block !important;
          }
          .downloader-body::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.4);
            border-left: 1px solid rgba(197, 160, 89, 0.15);
            border-right: 1px solid rgba(197, 160, 89, 0.15);
          }
          .downloader-body::-webkit-scrollbar-thumb {
            background: rgba(197, 160, 89, 0.3);
            border: 1px solid rgba(197, 160, 89, 0.5);
            border-radius: 0px;
          }
          .downloader-body::-webkit-scrollbar-thumb:hover {
            background: rgba(197, 160, 89, 0.65);
          }
          .downloader-body::-webkit-scrollbar-button:single-button {
            background-color: rgba(10, 9, 12, 0.9);
            display: block;
            height: 12px;
            width: 10px;
            background-size: 6px;
            background-repeat: no-repeat;
            background-position: center;
            border-left: 1px solid rgba(197, 160, 89, 0.15);
            border-right: 1px solid rgba(197, 160, 89, 0.15);
          }
          .downloader-body::-webkit-scrollbar-button:single-button:decrement {
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgba(197,160,89,0.85)'><polygon points='50,15 15,85 85,85'/></svg>");
            border-bottom: 1px solid rgba(197, 160, 89, 0.15);
          }
          .downloader-body::-webkit-scrollbar-button:single-button:increment {
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgba(197,160,89,0.85)'><polygon points='50,85 15,15 85,15'/></svg>");
            border-top: 1px solid rgba(197, 160, 89, 0.15);
          }
        `}</style>
      </motion.div>
    </div>
  );
}
