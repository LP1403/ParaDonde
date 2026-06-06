import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getMisionesCompletadasLocal } from '../../logic/puntuacionStorage';
import { getMisionById } from '../../data/misiones';
import { getDestinoBySlug } from '../../data/destinos';
import type { PuntuacionGlobal } from '../../services/firestoreService';

interface Props {
  puntuacion: PuntuacionGlobal | null;
  onClose: () => void;
}

export function HistorialModal({ puntuacion, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const misionesMap = getMisionesCompletadasLocal();
  const misiones = Object.values(misionesMap).sort((a, b) => {
    const tA = a.completadaAt?.seconds ?? 0;
    const tB = b.completadaAt?.seconds ?? 0;
    return tB - tA;
  });

  const totalPuntos = puntuacion?.totalPuntos ?? 0;
  const porFuente = puntuacion?.porFuente ?? { misiones: 0, vuelos: 0, referidos: 0 };

  return createPortal(
    <div className="pd-hist-root" role="dialog" aria-modal="true" aria-label="Historial de puntos">
      <button type="button" className="pd-hist-backdrop" onClick={onClose} aria-label="Cerrar" />
      <div className="pd-hist-panel">
        <div className="pd-hist-header">
          <h2 className="pd-hist-title">Historial de puntos</h2>
          <button type="button" className="pd-hist-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Resumen */}
        <div className="pd-hist-resumen">
          <div className="pd-hist-total">
            <span className="pd-hist-total-num">{totalPuntos.toLocaleString('es-AR')}</span>
            <span className="pd-hist-total-label">pts totales</span>
          </div>
          <div className="pd-hist-fuentes">
            <div className="pd-hist-fuente">
              <span aria-hidden>🎯</span>
              <span className="pd-hist-fuente-num">{porFuente.misiones.toLocaleString('es-AR')}</span>
              <span className="pd-hist-fuente-lbl">misiones</span>
            </div>
            <div className="pd-hist-fuente">
              <span aria-hidden>✈️</span>
              <span className="pd-hist-fuente-num">{porFuente.vuelos.toLocaleString('es-AR')}</span>
              <span className="pd-hist-fuente-lbl">vuelos</span>
            </div>
            <div className="pd-hist-fuente">
              <span aria-hidden>🔗</span>
              <span className="pd-hist-fuente-num">{porFuente.referidos.toLocaleString('es-AR')}</span>
              <span className="pd-hist-fuente-lbl">referidos</span>
            </div>
          </div>
        </div>

        {/* Lista de eventos */}
        <div className="pd-hist-lista-wrap">
          {misiones.length === 0 ? (
            <p className="pd-hist-empty">Todavía no completaste ninguna misión.</p>
          ) : (
            <ul className="pd-hist-lista">
              {misiones.map((m) => {
                const misionDef = getMisionById(m.misionId);
                const destino = getDestinoBySlug(m.destinoSlug);
                const fecha = m.completadaAt?.seconds
                  ? new Date(m.completadaAt.seconds * 1000).toLocaleDateString('es-AR', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })
                  : null;
                return (
                  <li key={m.misionId} className="pd-hist-item">
                    <span className="pd-hist-item-icon" aria-hidden>
                      {misionDef?.icono ?? '🎯'}
                    </span>
                    <div className="pd-hist-item-info">
                      <p className="pd-hist-item-titulo">
                        {misionDef?.titulo ?? m.misionId}
                      </p>
                      <p className="pd-hist-item-meta">
                        {destino?.nombre ?? m.destinoSlug}
                        {fecha && <> · {fecha}</>}
                      </p>
                    </div>
                    <span className="pd-hist-item-pts">+{m.puntosGanados.toLocaleString('es-AR')} pts</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
