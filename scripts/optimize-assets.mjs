import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outputRoot = path.join(root, 'public', 'generated');
const sources = [
  { root: path.join(root, 'public', 'scythe'), route: 'scythe' },
  { root: path.join(root, 'assets-cdn-backup', 'scythe'), route: 'scythe' },
];
const widths = [320, 640, 1280];

async function walk(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(fullPath) : [fullPath];
    }));
    return nested.flat();
  } catch {
    return [];
  }
}

await fs.rm(outputRoot, { recursive: true, force: true });

let generated = 0;
for (const source of sources) {
  for (const file of await walk(source.root)) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue;
    const relative = path.relative(source.root, file);
    const parsed = path.parse(relative);
    for (const width of widths) {
      const output = path.join(outputRoot, source.route, parsed.dir, `${parsed.name}-${width}.webp`);
      await fs.mkdir(path.dirname(output), { recursive: true });
      await sharp(file)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82, alphaQuality: 90, smartSubsample: true })
        .toFile(output);
      generated += 1;
    }
  }
}

console.log(`Generated ${generated} responsive WebP assets.`);
