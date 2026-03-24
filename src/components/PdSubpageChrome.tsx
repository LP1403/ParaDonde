import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { PdThemeToggle } from './PdThemeToggle';

type Props = {
  onBack: () => void;
  /** Texto junto al ícono (misma UX que página destino) */
  backLabel?: string;
  backAriaLabel?: string;
};

/**
 * Barra flotante: volver (izq) + tema claro/oscuro (der), sin IonToolbar.
 */
export function PdSubpageChrome({
  onBack,
  backLabel = 'Volver',
  backAriaLabel = 'Volver',
}: Props) {
  return (
    <>
      <button
        type="button"
        className="pd-destino-floating-btn pd-destino-floating-back"
        onClick={onBack}
        aria-label={backAriaLabel}
      >
        <IonIcon icon={arrowBack} />
        <span>{backLabel}</span>
      </button>
      <div className="pd-subpage-theme-fixed">
        <PdThemeToggle />
      </div>
    </>
  );
}
