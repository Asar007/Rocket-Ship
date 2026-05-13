import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 900,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        // Cluster heavy vendor code into stable, cacheable chunks so the
        // landing hero never has to ship three.js / framer-motion together.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          // Match by directory boundary to avoid false positives like
          // "react-reconciler" leaking into "react" or "three-mesh-bvh"
          // into "three".
          const inPkg = (name) => id.includes(`/node_modules/${name}/`) || id.includes(`\\node_modules\\${name}\\`)

          if (inPkg('@shadergradient')) return 'shader'
          if (inPkg('three') || inPkg('@react-three')) return 'three'
          if (inPkg('framer-motion')) return 'motion'
          if (inPkg('lucide-react')) return 'icons'
          // react + react-dom together — keep them inseparable so React
          // internals never trigger a circular vendor chunk.
          if (
            inPkg('react') ||
            inPkg('react-dom') ||
            inPkg('scheduler') ||
            inPkg('object-assign')
          ) {
            return 'react'
          }
          return 'vendor'
        },
      },
    },
  },
  esbuild: {
    // Strip console / debugger statements in production builds.
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
})
