import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [
    react(),
    // Responsive images: imports carrying a `?w=...&as=srcset` query are
    // resized at build time into a srcset string. Plain image imports
    // (no query) are untouched, so existing usages keep working.
    imagetools(),
    VitePWA({
      registerType: 'autoUpdate',
      // Manual registration via deferred <script> in index.html so the
      // SW install event's precache work runs AFTER LCP, not during it.
      injectRegister: false,
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
          // IMPORTANT: do NOT extract @react-three or three into named
          // shared chunks. Vite hoists shared-by-multiple-lazy-chunks
          // groups to a static import of the main bundle, which forced
          // /about (and every non-3D route) to download 325 KB of three
          // it never executes. Leaving them inline in each lazy chunk
          // means /home pays the cost only when SpaceScene mounts,
          // /contact only when ConnectorsBackground mounts, etc., and
          // /about pays nothing.
          if (id.includes('framer-motion')) return 'motion'
        },
      },
    },
  },
})
