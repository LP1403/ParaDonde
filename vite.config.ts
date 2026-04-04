import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    /** Necesario para que el emulador (10.0.2.2) o la IP LAN lleguen al dev server */
    host: true,
    port: 5173,
    strictPort: true,
  },
});
