import test from 'node:test';
import assert from 'node:assert/strict';
import { BUNDLE_CONFIG, getAssetUrl, isBundled } from './assetResolver.js';

test('starter artwork remains bundled', () => {
  for (const file of ['/scythe/DORMANT.webp', '/deity/fitness-goddess.webp', '/maps/campaign-map-1.webp', '/frames/dividers/gold-diamond-line.webp', '/frames/dividers/gold-diamond.webp', '/frames/dividers/sapphire-line.webp', '/frames/dividers/sapphire-gem.webp']) assert.equal(getAssetUrl(file), file);
});
test('downloadable images retain WebP paths instead of requesting legacy PNGs', () => {
  for (const file of ['/deity/hermes.webp', '/themes/kailash/bg.webp', '/maps/campaign-map-10.webp']) assert.equal(getAssetUrl(file), 'https://yrxchjontmgkjaazrybh.supabase.co/storage/v1/object/public/cosmetics/public' + file);
});
test('all published image bundles resolve as WebP and audio keeps its own extension', () => {
  for (const item of Object.values(BUNDLE_CONFIG).flatMap(group => Object.values(group.items))) for (const file of item.files) {
    const url = getAssetUrl('/' + file);
    assert.equal(url.endsWith(file.endsWith('.webp') ? '.webp' : '.mp3'), true, file);
  }
});

test('reward scenes and chest states stay in the offline native package', () => {
  for (const name of ['chest-closed','chest-open','scene-cave','scene-castle','scene-dispatch']) {
    const file = '/rewards/' + name + '.webp';
    assert.equal(isBundled(file), true);
    assert.equal(getAssetUrl(file), file);
  }
});
