import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Luman-s-Invoice-Generator/', // GitHub Pages base path
});