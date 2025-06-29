import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  esbuild: {
    supported: {
      'top-level-await': true
    }
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress the "use client" directive warning from react-hot-toast
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) {
          return;
        }
        warn(warning);
      }
    }
  }
}) 