import type { NivelReputacion } from '../../data/reputacion';
import { getPorcentajeProgreso, getPuntosParaSiguienteNivel, getSiguienteNivel } from '../../data/reputacion';

interface Props {
  nivel: NivelReputacion;
  puntos: number;
  mostrarProgreso?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NivelBadge({ nivel, puntos, mostrarProgreso = false, size = 'md', className = '' }: Props) {
  const porcentaje = getPorcentajeProgreso(puntos);
  const faltanPuntos = getPuntosParaSiguienteNivel(puntos);
  const siguienteNivel = getSiguienteNivel(puntos);

  return (
    <div className={`pd-nivel-badge pd-nivel-badge--${size} pd-nivel-badge--${nivel.id} ${className}`}
      style={{ '--nivel-color': nivel.color, '--nivel-fondo': nivel.colorFondo } as React.CSSProperties}
    >
      <span className="pd-nivel-badge-emoji" aria-hidden>{nivel.emoji}</span>
      <div className="pd-nivel-badge-info">
        <span className="pd-nivel-badge-nombre">{nivel.nombre}</span>
      </div>
      {mostrarProgreso && (
        <div className="pd-nivel-badge-progreso">
          <div className="pd-nivel-badge-barra-wrap">
            <div
              className="pd-nivel-badge-barra"
              style={{ width: `${porcentaje}%` }}
              role="progressbar"
              aria-valuenow={porcentaje}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="pd-nivel-badge-puntos-label">
            {puntos} pts
            {faltanPuntos != null && siguienteNivel
              ? ` · faltan ${faltanPuntos} para ${siguienteNivel.nombre}`
              : ' · nivel máximo'}
          </p>
        </div>
      )}
    </div>
  );
}
