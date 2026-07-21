import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    // Feature pages are lazy-loaded. The remaining shared runtime is intentionally
    // substantial, but stays below 200 kB over the wire after gzip.
    chunkSizeWarningLimit: 700,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        navigateFallbackDenylist: [
          /^\/app-ads\.txt$/,
          /^\/robots\.txt$/,
          /^\/\.well-known\/assetlinks\.json$/,
          /^\/privacy\.html$/
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/yrxchjontmgkjaazrybh\.supabase\.co\/storage\/v1\/object\/public\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-assets-cache',
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Warscythe Execution Engine',
        short_name: 'Warscythe',
        description: 'High-performance task completion and behavior control.',
        theme_color: '#0a090c',
        icons: [
          {
            src: 'wrath-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: "any maskable"
          },
          {
            src: 'wrath-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
})
