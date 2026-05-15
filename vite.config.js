import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // We ship our own /site.webmanifest + <link> in index.html.
      manifest: false,
      workbox: {
        // Precache the app shell + small assets. The ~2.3 MB Connectors
        // chunk and the large WebP textures are runtime-cached on demand
        // instead of bloating the precache on slow connections.
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        globIgnores: ['**/ConnectorsBackground-*.js'],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/textures/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'earth-textures',
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 60 },
            },
          },
          {
            urlPattern: /ConnectorsBackground-.*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'heavy-chunks',
              expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.origin === 'https://fonts.googleapis.com' ||
              url.origin === 'https://fonts.gstatic.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts' },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // Leave the heavy physics / post-processing libs in the default
          // graph so they stay inside the lazy ConnectorsBackground async
          // chunk (only loaded when that section scrolls into view).
          if (
            id.includes('@react-three/rapier') ||
            id.includes('@react-three/postprocessing') ||
            id.includes('postprocessing') ||
            id.includes('node_modules/maath')
          )
            return
          if (id.includes('@react-three')) return 'r3f' // fiber + drei
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('framer-motion')) return 'motion'
        },
      },
    },
  },
})
