import fs from 'node:fs/promises';
import path from 'node:path';
import { isBundled } from '../src/utils/assetResolver.js';

const dist = path.join(process.cwd(), 'dist');
const nativePublic = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'assets', 'public');
await fs.rm(nativePublic, { recursive: true, force: true });

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  }));
  return nested.flat();
}

let removedBytes = 0;
for (const file of await walk(dist)) {
  const route = `/${path.relative(dist, file).replaceAll('\\', '/')}`;
  const isMedia = /\.(png|jpe?g|webp|gif|avif|mp3|mp4|wav|ogg)$/i.test(route);
  if (route.startsWith('/generated/') || (isMedia && !isBundled(route))) {
    const stat = await fs.stat(file);
    removedBytes += stat.size;
    await fs.rm(file, { force: true });
  }
}

console.log(`Removed ${(removedBytes / 1024 / 1024).toFixed(1)} MB of web-only and on-demand artwork from the native package.`);
