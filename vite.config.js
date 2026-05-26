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
        // Skip heavy 3D libraries from the install-time precache so
        // routes that don't render them (e.g. /about, /projects) don't
        // pay the bandwidth on first visit. They still get runtime-cached
        // on first use by the rules further down.
        globIgnores: [
          '**/ConnectorsBackground-*.js',
          '**/three-*.js',
          '**/r3f-*.js',
          '**/SpaceScene-*.js',
          '**/SpaceshipGLB-*.js',
        ],
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
            // Heavy 3D chunks: runtime-cache after first use rather than
            // shipping in the install precache (which would download them
            // on every fresh visit to /about, /projects, etc.).
            urlPattern: /\/(ConnectorsBackground|three|r3f|SpaceScene|SpaceshipGLB)-.*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'heavy-chunks',
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 30 },
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
    // vite-react-ssg generates <link rel=modulepreload> for the entry's
    // full dep graph, which means every page (e.g. /about) was preloading
    // the three/r3f chunks even though they're only consumed inside
    // React.lazy() boundaries on Home/Contact. Filter those out so they
    // only download when the lazy boundary actually triggers.
    modulePreload: {
      polyfill: false,
      resolveDependencies: (_filename, deps) =>
        deps.filter(
          (d) =>
            !d.includes('/three-') &&
            !d.includes('/r3f-') &&
            !d.includes('ConnectorsBackground-'),
        ),
    },
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
