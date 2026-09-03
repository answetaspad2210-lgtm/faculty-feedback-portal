// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-server proxy so the client can call /api/... without hardcoding
// the backend URL, and without hitting CORS during local development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
