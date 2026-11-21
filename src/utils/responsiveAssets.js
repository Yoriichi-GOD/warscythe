import { Capacitor } from '@capacitor/core';
import landingAssets from '../data/landingAssets.json';

export function getResponsiveAsset(pathname) {
  if (Capacitor.isNativePlatform() || !pathname?.startsWith('/scythe/') || !/\.(png|jpe?g|webp)$/i.test(pathname)) return null;
  const base = pathname.replace(/\.(png|jpe?g|webp)$/i, '');
  return {
    src: `/generated${base}-640.webp`,
    srcSet: [320, 640, 1280].map(width => `/generated${base}-${width}.webp ${width}w`).join(', '),
    sizes: '(max-width: 640px) 45vw, (max-width: 1200px) 34vw, 420px',
  };
}

export function landingImageProps(file, sizes = '(max-width: 700px) 100vw, 60vw') {
  const src = '/landing-page/' + file;
  const metadata = landingAssets[file];
  if (!metadata) return { src };
  const widths = [480, 940, 1440].filter(width => width < metadata.width);
  const base = file.replace(/\.webp$/i, '');
  return { src, width: metadata.width, height: metadata.height, sizes, style: { aspectRatio: `${metadata.width} / ${metadata.height}` },
    srcSet: [...widths.map(width => `/generated/landing-page/${base}-${width}.webp ${width}w`), `${src} ${metadata.width}w`].join(', ') };
}
