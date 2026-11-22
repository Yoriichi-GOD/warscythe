import { BASE_ARTIFACTS } from '../store/constants.js';

const rarities = ['common','uncommon','rare','epic','mythic'];
const catalogue = new Set(BASE_ARTIFACTS.flatMap(artifact => rarities.map(rarity => artifact.name.trim().toLowerCase()+'::'+rarity)));
export const ARTIFACT_VARIANT_TOTAL = catalogue.size;

// Legacy items remain in the collection. They are not silently relabelled as
// one of the current catalogue's variants to make a completion fraction fit.
export const getCurrentArtifactVariantCount = (artifacts = []) => new Set(artifacts.map(getArtifactVariantKey).filter(key => catalogue.has(key))).size;

export const getArtifactVariantKey = artifact => {
  const name = String(artifact?.name || 'unknown artifact').trim().toLowerCase();
  const rarity = String(artifact?.rarity || 'common').trim().toLowerCase();
  return `${name}::${rarity}`;
};

export const getArtifactCollection = (artifacts = []) => {
  const groups = new Map();

  artifacts.forEach((artifact, index) => {
    const key = getArtifactVariantKey(artifact);
    const existing = groups.get(key);
    const recovery = {
      date: artifact.date || artifact.completedAt || null,
      context: artifact.context || null,
      effortContext: artifact.effortContext || null,
      rewardEventId: artifact.rewardEventId || artifact.eventUuid || `${key}:${index}`,
    };

    if (existing) {
      existing.count += 1;
      existing.recoveries.push(recovery);
      return;
    }

    groups.set(key, {
      ...artifact,
      variantKey: key,
      count: 1,
      recoveries: [recovery],
    });
  });

  return [...groups.values()].sort((a, b) => {
    const latestA = new Date(a.recoveries.at(-1)?.date || 0).getTime();
    const latestB = new Date(b.recoveries.at(-1)?.date || 0).getTime();
    return latestB - latestA;
  });
};
