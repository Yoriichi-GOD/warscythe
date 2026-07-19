import { BUNDLE_CONFIG, getAssetUrl, isBundled } from './assetResolver';

export const ASSET_CACHE_NAME = 'supabase-assets-cache';

const normalizeId = (value) => String(value);

export const findBundleItem = (itemId) => {
  const normalizedId = normalizeId(itemId);
  for (const [categoryId, category] of Object.entries(BUNDLE_CONFIG)) {
    const entry = Object.entries(category.items || {}).find(
      ([candidateId]) => normalizeId(candidateId) === normalizedId
    );
    if (entry) {
      const [id, item] = entry;
      return { categoryId, id: normalizeId(id), item };
    }
  }
  return null;
};

export const getBundleUrls = (itemId) => {
  const match = findBundleItem(itemId);
  if (!match) return [];
  return match.item.files
    .filter(file => !isBundled(file))
    .map(file => getAssetUrl(`/${file}`));
};

export const isBundleCached = async (itemId) => {
  const urls = getBundleUrls(itemId);
  if (urls.length === 0) return true;
  const cache = await caches.open(ASSET_CACHE_NAME);
  const matches = await Promise.all(urls.map(url => cache.match(url)));
  return matches.every(Boolean);
};

export const scanCachedBundleIds = async () => {
  const cachedIds = [];
  for (const category of Object.values(BUNDLE_CONFIG)) {
    for (const itemId of Object.keys(category.items || {})) {
      if (await isBundleCached(itemId)) cachedIds.push(normalizeId(itemId));
    }
  }
  return cachedIds;
};

export const cacheAssetUrl = async (url) => {
  if (!url || isBundled(url)) return url;
  const cache = await caches.open(ASSET_CACHE_NAME);
  const existing = await cache.match(url);
  if (existing) return url;

  const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
  if (!response.ok) {
    throw new Error(`Asset download failed (${response.status}): ${url}`);
  }
  await cache.put(url, response.clone());
  return url;
};

export const cacheBundle = async (itemId, onProgress) => {
  const urls = getBundleUrls(itemId);
  const total = urls.length;
  let completed = 0;

  for (const url of urls) {
    await cacheAssetUrl(url);
    completed += 1;
    onProgress?.({ completed, total, url });
  }
  return { completed, total };
};

export const deleteCachedBundle = async (itemId) => {
  const urls = getBundleUrls(itemId);
  const cache = await caches.open(ASSET_CACHE_NAME);
  await Promise.all(urls.map(url => cache.delete(url)));
};
