import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user': {
        target: 'http://localhost:3000', // Replace with your backend URL
        changeOrigin: true,
      },
    },
  },
});
