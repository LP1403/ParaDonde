import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setupIonicReact } from '@ionic/react';
import App from './App';
import { getFirebaseApp } from './firebase';
import { replaceDevLocalhostMissingPort } from './utils/fixDevLocalhostOrigin';
import './theme/theme.css';
import './index.css';

if (!replaceDevLocalhostMissingPort()) {
  setupIonicReact();
  getFirebaseApp();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
