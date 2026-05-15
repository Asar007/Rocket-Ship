import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
