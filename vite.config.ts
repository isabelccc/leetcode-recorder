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
        // Suppress external dependency warnings for Supabase
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.message.includes('@supabase/supabase-js')) {
          return;
        }
        warn(warning);
      },
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js']
  }
}) 