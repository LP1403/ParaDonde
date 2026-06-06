import { useState } from 'react';
import type { Beneficio } from '../../data/beneficios';

interface Props {
  beneficio: Beneficio;
  desbloqueado: boolean;
}

const tipoBadge: Record<string, string> = {
  descuento: 'Descuento',
  acceso_vip: 'VIP',
  prioridad: 'Prioridad',
  regalo: 'Regalo',
  experiencia: 'Experiencia',
};

export function BeneficioCard({ beneficio, desbloqueado }: Props) {
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(beneficio.codigoPromo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // fallback silencioso
    }
  };

  return (
    <div className={`pd-beneficio-card ${desbloqueado ? 'pd-beneficio-card--activo' : 'pd-beneficio-card--bloqueado'}`}>
      <div className="pd-beneficio-card-head">
        <span className="pd-beneficio-card-icono" aria-hidden>{beneficio.icono}</span>
        <div className="pd-beneficio-card-meta">
          <span className={`pd-beneficio-card-tipo pd-beneficio-card-tipo--${beneficio.tipo}`}>
            {tipoBadge[beneficio.tipo]}
          </span>
          <span className="pd-beneficio-card-valor">{beneficio.valor}</span>
        </div>
      </div>

      <h4 className="pd-beneficio-card-titulo">{beneficio.titulo}</h4>
      <p className="pd-beneficio-card-proveedor">{beneficio.proveedor}</p>
      <p className="pd-beneficio-card-desc">{beneficio.descripcion}</p>

      {desbloqueado ? (
        <div className="pd-beneficio-card-codigo-wrap">
          <code className="pd-beneficio-card-codigo">{beneficio.codigoPromo}</code>
          <button
            type="button"
            className="pd-beneficio-card-copiar"
            onClick={copiarCodigo}
            aria-label="Copiar código"
          >
            {copiado ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>
      ) : (
        <div className="pd-beneficio-card-bloqueado-msg">
          <span aria-hidden>🔒</span> Se desbloquea en nivel {beneficio.nivelMinimo.charAt(0).toUpperCase() + beneficio.nivelMinimo.slice(1)}
        </div>
      )}
    </div>
  );
}
