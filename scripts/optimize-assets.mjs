import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outputRoot = path.join(root, 'public', 'generated');
const sources = [
  { root: path.join(root, 'public', 'scythe'), route: 'scythe' },
  { root: path.join(root, 'assets-cdn-backup', 'scythe'), route: 'scythe' },
  { root: path.join(root, 'public', 'landing-page'), route: 'landing-page' },
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
    if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
    const relative = path.relative(source.root, file);
    const parsed = path.parse(relative);
    const metadata = await sharp(file).metadata();
    const candidates = source.route === 'landing-page' ? [480, 940, 1440].filter(width => width < metadata.width) : widths;
    for (const width of candidates) {
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

await fs.mkdir(path.join(outputRoot, 'ui'), { recursive: true });
for (const width of [96, 192]) {
  await sharp(path.join(root, 'public', 'command-core.webp')).resize({ width, height: width, fit: 'inside' }).webp({ quality: 85, alphaQuality: 90 }).toFile(path.join(outputRoot, 'ui', 'command-core-' + width + '.webp'));
  generated += 1;
}
console.log(`Generated ${generated} responsive WebP assets.`);
