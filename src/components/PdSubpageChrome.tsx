import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { PdThemeToggle } from './PdThemeToggle';
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
 * Barra flotante: volver (izq) + cuenta + tema (der), sin IonToolbar.
 */
export function PdSubpageChrome({
  onBack,
  backLabel = 'Volver',
  backAriaLabel = 'Volver',
  chromeVisible = true,
}: Props) {
  const hid = !chromeVisible;
  return (
    <>
      <div
        className={`pd-floating-chrome pd-floating-chrome--sub-back${hid ? ' pd-floating-chrome--hidden' : ''}`}
      >
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
      <div
        className={`pd-floating-chrome pd-floating-chrome--sub-trailing${hid ? ' pd-floating-chrome--hidden' : ''}`}
      >
        <div className="pd-subpage-theme-fixed pd-subpage-top-actions">
          <PdUserMenu variant="subpage" />
          <PdThemeToggle />
        </div>
      </div>
    </>
  );
}
