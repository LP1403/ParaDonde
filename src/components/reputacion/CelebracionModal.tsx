import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getNivelParaPuntos, getPorcentajeProgreso, getSiguienteNivel } from '../../data/reputacion';

interface Props {
  puntosGanados: number;
  totalPuntos: number;
  destinoNombre: string;
  onClose: () => void;
}

export function CelebracionModal({ puntosGanados, totalPuntos, destinoNombre, onClose }: Props) {
  const nivel = getNivelParaPuntos(totalPuntos);
  const sig = getSiguienteNivel(totalPuntos);
  const porcentaje = getPorcentajeProgreso(totalPuntos);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="pd-cel-root" role="dialog" aria-modal="true" aria-label="Misión completada">
      <div className="pd-cel-backdrop" onClick={onClose} />
      <div className="pd-cel-panel">
        <div className="pd-cel-burst" aria-hidden>
          {['✦','✦','✦','✦','✦','✦','✦','✦'].map((s, i) => (
            <span key={i} className="pd-cel-star" style={{ '--i': i } as React.CSSProperties}>{s}</span>
          ))}
        </div>

        <div className="pd-cel-icon" aria-hidden>⭐</div>

        <h2 className="pd-cel-titulo">¡Misión completada!</h2>

        <div className="pd-cel-pts-badge">
          <span className="pd-cel-pts-plus">+</span>
          <span className="pd-cel-pts-num">{puntosGanados.toLocaleString('es-AR')}</span>
          <span className="pd-cel-pts-label">pts</span>
        </div>

        <p className="pd-cel-destino">Subiste tu reputación en <strong>{destinoNombre}</strong></p>

        <div className="pd-cel-nivel-row">
          <span className="pd-cel-nivel-emoji" aria-hidden>{nivel.emoji}</span>
          <span className="pd-cel-nivel-nombre" style={{ color: nivel.color }}>{nivel.nombre}</span>
        </div>

        {sig && (
          <div className="pd-cel-progreso">
            <div className="pd-cel-progreso-track">
              <div className="pd-cel-progreso-bar" style={{ width: `${porcentaje}%`, background: nivel.color }} />
            </div>
            <p className="pd-cel-progreso-label">
              {totalPuntos.toLocaleString('es-AR')} / {sig.puntosMin.toLocaleString('es-AR')} pts para {sig.nombre}
            </p>
          </div>
        )}

        <button type="button" className="pd-cel-btn" onClick={onClose}>
          ¡Genial!
        </button>
      </div>
    </div>,
    document.body,
  );
}
