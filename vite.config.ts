import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    compression({ algorithm: 'gzip', ext: '.gz' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'data-ecosystem': ['./src/data/ecosystemData.ts'],
          'data-architecture': ['./src/data/architectureData.ts'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
