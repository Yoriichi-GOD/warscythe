import { BUNDLE_CONFIG, isBundled } from '../src/utils/assetResolver.js';

const base = 'https://yrxchjontmgkjaazrybh.supabase.co/storage/v1/object/public/cosmetics/public';
const files = [...new Set(Object.values(BUNDLE_CONFIG)
  .flatMap((category) => Object.values(category.items))
  .flatMap((item) => item.files)
  .filter((file) => !isBundled(file)))];

const failures = [];
let checked = 0;
for (const file of files) {
  const response = await fetch(`${base}/${file}`, {
    headers: { Range: 'bytes=0-0' },
  });
  if (!response.ok && response.status !== 206) failures.push({ file, status: response.status });
  checked += 1;
}

console.log(`Verified ${checked} CDN assets; ${failures.length} failed.`);
if (failures.length) {
  console.table(failures);
  process.exitCode = 1;
}
