import { getOrigenPaisOpcionById } from '../logic/origenPaisResolve';
import { OrigenPaisFlagMedia } from './OrigenPaisFlagMedia';

type Props = {
  opcionId: string;
  onContinuar: () => void;
  onCambiar: () => void;
};

export function AventuraOrigenPaisResumen({ opcionId, onContinuar, onCambiar }: Props) {
  const op = getOrigenPaisOpcionById(opcionId);
  if (!op) return null;

  return (
    <div className="pd-origen-pais-resumen">
      <p className="pd-origen-pais-resumen-kicker">Tu residencia</p>
      <h2 className="pd-origen-pais-resumen-title">Este es tu país</h2>
      <p className="pd-origen-pais-resumen-lead">
        Lo usamos para tips de documentación y equipaje. Si vivís en otro país, podés cambiarlo.
      </p>
      <div className="pd-origen-pais-resumen-card">
        <OrigenPaisFlagMedia opcionId={opcionId} className="pd-origen-pais-resumen-flag" />
        <span className="pd-origen-pais-resumen-nombre">{op.label}</span>
      </div>
      <div className="pd-origen-pais-resumen-actions">
        <button type="button" className="pd-origen-pais-resumen-btn-primary" onClick={onContinuar}>
          Continuar
        </button>
        <button type="button" className="pd-origen-pais-resumen-btn-secondary" onClick={onCambiar}>
          Cambiar país
        </button>
      </div>
    </div>
  );
}
