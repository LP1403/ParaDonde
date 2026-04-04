import { preguntasAventura } from '../data/aventura';

type Props = {
  opcionId: string;
  onContinuar: () => void;
  onCambiar: () => void;
};

export function AventuraOrigenPaisResumen({ opcionId, onContinuar, onCambiar }: Props) {
  const p = preguntasAventura[0];
  const op = p?.id === 'origen_pais' ? p.opciones.find((o) => o.id === opcionId) : undefined;
  if (!op) return null;

  return (
    <div className="pd-origen-pais-resumen">
      <p className="pd-origen-pais-resumen-kicker">Tu residencia</p>
      <h2 className="pd-origen-pais-resumen-title">Este es tu país</h2>
      <p className="pd-origen-pais-resumen-lead">
        Lo usamos para tips de documentación y equipaje. Si vivís en otro país, podés cambiarlo.
      </p>
      <div className="pd-origen-pais-resumen-card">
        <span className="pd-origen-pais-resumen-flag" aria-hidden>
          {op.bandera ?? '🏳️'}
        </span>
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
