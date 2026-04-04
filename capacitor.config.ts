import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Live reload solo si `CAPACITOR_LIVE_RELOAD=1` (ver `npm run cap:sync:dev` / `cap:android:dev`).
 * Así el APK de producción sigue usando solo `webDir`.
 */
const liveReload = process.env.CAPACITOR_LIVE_RELOAD === '1';
const devServerUrl =
  process.env.CAPACITOR_DEV_SERVER_URL?.trim() || 'http://10.0.2.2:5173';

const config: CapacitorConfig = {
  appId: 'com.paradonde.app',
  appName: 'Para Dónde',
  webDir: 'dist',
  ...(liveReload && {
    server: {
      url: devServerUrl,
      cleartext: true,
    },
  }),
};

export default config;
