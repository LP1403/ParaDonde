import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { PdUserMenu } from './PdUserMenu';

type Props = {
  onBack: () => void;
  /** Texto junto al ícono (misma UX que página destino) */
  backLabel?: string;
  backAriaLabel?: string;
  /** false: se oculta al scrollear hacia abajo (useFloatingChromeScroll) */
  chromeVisible?: boolean;
};

/**
 * Barra flotante: volver (izq), menú centrado (tema dentro del menú), sin IonToolbar.
 */
export function PdSubpageChrome({
  onBack,
  backLabel = 'Volver',
  backAriaLabel = 'Volver',
  chromeVisible = true,
}: Props) {
  const hid = !chromeVisible;
  return (
    <div className={`pd-floating-chrome pd-floating-chrome--sub-top${hid ? ' pd-floating-chrome--hidden' : ''}`}>
      <div className="pd-subpage-chrome-left">
        <button
          type="button"
          className="pd-destino-floating-btn"
          onClick={onBack}
          aria-label={backAriaLabel}
        >
          <IonIcon icon={arrowBack} />
          <span>{backLabel}</span>
        </button>
      </div>
      <div className="pd-subpage-chrome-center">
        <PdUserMenu />
      </div>
    </div>
  );
}
