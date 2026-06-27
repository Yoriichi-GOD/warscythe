import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { BUNDLE_CONFIG } from '../utils/assetResolver';
import { X, CloudDownload, Trash2, CheckCircle2, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function AssetDownloaderModal({ onClose }) {
  const { downloadedRegions, downloadRegionBundle, deleteRegionBundle } = useWarscytheStore();
  const [downloadedItemIds, setDownloadedItemIds] = useState([]);
  const [loadingItems, setLoadingItems] = useState({}); // { [subId]: boolean }
  const [expandedCats, setExpandedCats] = useState({ regions: true, premium_scythes: true }); // { [catKey]: boolean }
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

  // Helper to check if a category is fully downloaded
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

  // Check if everything downloadable is downloaded
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
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.92), rgba(0, 0, 0, 0.98)), url("/shop-bg.png")',
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
              <p className="font-mono text-[8px] text-gold-core/70 tracking-[0.25em] uppercase">OFFLINE ENCODINGS & ASSETS MANAGER</p>
            </div>
          </div>
          <button className="downloader-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Info Box */}
        <div className="downloader-info p-3 bg-white/[0.02] border border-white/5 rounded-md flex flex-col gap-1 mx-6 mt-4">
          <span className="font-mono text-[8.5px] text-gray-400 leading-normal uppercase">
            👉 Regions 1, Core Artifacts, Map Nodes, and Fitness Deities are permanently bundled. Custom region maps, premium scythe skins, and visual themes can be cached offline to ensure seamless offline gameplay and save storage.
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
              {isAllDownloaded ? 'ALL PREMIUM BUNDLES CACHED' : 'CACHE ALL PREMIUM ASSETS'}
            </label>
          </div>
          <span className="font-mono text-[8px] text-gray-500">
            DOWNLOADED: {downloadedItemIds.length} / {Object.values(BUNDLE_CONFIG).reduce((sum, c) => sum + Object.keys(c.items).length, 0)}
          </span>
        </div>

        {/* Categories Accordion */}
        <div className="downloader-body custom-scrollbar flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {Object.entries(BUNDLE_CONFIG).map(([catKey, cat]) => {
            const status = getCategoryStatus(catKey);
            const isBaseGroup = ['deities', 'artifacts', 'nodes'].includes(catKey);
            const isExpanded = !!expandedCats[catKey];

            return (
              <div key={catKey} className="border border-white/5 rounded overflow-hidden bg-black/40">
                {/* Category Header Row */}
                <div 
                  onClick={() => toggleExpand(catKey)}
                  className="flex items-center justify-between p-3 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer select-none"
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

                  {/* Category Right Checkbox */}
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

                {/* Nested Items Accordion Panel */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t border-white/[0.03]"
                    >
                      <div className="p-2.5 flex flex-col gap-1.5 bg-black/60">
                        {Object.entries(cat.items).map(([subId, item]) => {
                          const isItemDownloaded = downloadedItemIds.includes(String(subId)) || isBaseGroup;
                          const isItemLoading = !!loadingItems[subId];

                          return (
                            <div 
                              key={subId}
                              className="flex items-center justify-between p-2 rounded bg-white/[0.01] border border-white/[0.02] hover:border-white/5 transition-all text-left"
                            >
                              <div className="flex flex-col gap-0.5 min-w-0 flex-1 pr-4">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="font-mono text-[9px] text-gray-300 uppercase tracking-wide truncate">{item.name}</span>
                                  {isItemDownloaded && !isItemLoading && <CheckCircle2 size={10} className="text-[#2ecc71] shrink-0" />}
                                </div>
                                <span className="font-mono text-[7px] text-gray-500 uppercase tracking-widest">
                                  DISK SIZE: {item.size} • {isBaseGroup ? 'STATIC BUNDLE' : (isItemDownloaded ? 'OFFLINE CACHE' : 'REMOTE')}
                                </span>
                              </div>

                              {/* Download/Delete Row Buttons */}
                              <button
                                disabled={isBaseGroup || isItemLoading}
                                onClick={() => handleToggleItem(catKey, subId, isItemDownloaded)}
                                className={`px-2 py-1 rounded font-mono text-[7.5px] uppercase font-bold tracking-widest transition-all shrink-0 flex items-center gap-1 ${
                                  isBaseGroup
                                    ? 'bg-transparent text-gray-600 border border-transparent cursor-default'
                                    : isItemLoading
                                    ? 'bg-transparent text-gold-core border border-gold-core/20'
                                    : isItemDownloaded
                                    ? 'bg-red-950/20 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 cursor-pointer'
                                    : 'bg-gold-core text-black hover:bg-white cursor-pointer'
                                }`}
                              >
                                {isItemLoading ? (
                                  <>
                                    <Loader2 size={8} className="animate-spin" />
                                    <span>SYNCING...</span>
                                  </>
                                ) : isBaseGroup ? (
                                  <span>INSTALLED</span>
                                ) : isItemDownloaded ? (
                                  <>
                                    <Trash2 size={8} />
                                    <span>DELETE</span>
                                  </>
                                ) : (
                                  <>
                                    <CloudDownload size={8} />
                                    <span>DOWNLOAD</span>
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
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
          
          .accent-gold-core {
            accent-color: var(--gold-core);
          }
        `}</style>
      </motion.div>
    </div>
  );
}
