import { Capacitor } from '@capacitor/core';

const isNative = () => Capacitor.isNativePlatform();

export function getResponsiveAsset(pathname) {
  if (isNative() || !pathname?.startsWith('/scythe/') || !/\.(png|jpe?g)$/i.test(pathname)) {
    return null;
  }

  const base = pathname.replace(/\.(png|jpe?g)$/i, '');
  return {
    src: `/generated${base}-640.webp`,
    srcSet: [320, 640, 1280]
      .map((width) => `/generated${base}-${width}.webp ${width}w`)
      .join(', '),
    sizes: '(max-width: 640px) 45vw, (max-width: 1200px) 34vw, 420px',
  };
}
