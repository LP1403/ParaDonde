import { NIVELES_REPUTACION, getNivelParaPuntos, getSiguienteNivel, getPorcentajeProgreso } from '../../data/reputacion';
import type { NivelReputacion } from '../../data/reputacion';

interface Props {
  nivelActual: NivelReputacion;
  totalPuntos: number;
}

export function NivelProgresion({ nivelActual, totalPuntos }: Props) {
  const sig = getSiguienteNivel(totalPuntos);
  const porcentaje = getPorcentajeProgreso(totalPuntos);
  const idxActual = NIVELES_REPUTACION.findIndex((n) => n.id === nivelActual.id);

  return (
    <div className="pd-nivprog-wrap">
      <div className="pd-nivprog-track">
        {NIVELES_REPUTACION.map((n, i) => {
          const activo = n.id === nivelActual.id;
          const alcanzado = i <= idxActual;
          return (
            <div key={n.id} className="pd-nivprog-nodo-wrap">
              {i > 0 && (
                <div
                  className={`pd-nivprog-linea ${alcanzado ? 'pd-nivprog-linea--done' : ''}`}
                  aria-hidden
                />
              )}
              <div
                className={`pd-nivprog-nodo ${activo ? 'pd-nivprog-nodo--activo' : ''} ${alcanzado && !activo ? 'pd-nivprog-nodo--done' : ''}`}
                style={{ '--nivel-color': n.color } as React.CSSProperties}
                aria-label={`${n.nombre}${activo ? ' (nivel actual)' : ''}`}
              >
                <div className="pd-nivprog-hex">
                  <span className="pd-nivprog-emoji" aria-hidden>{n.emoji}</span>
                </div>
                <span className="pd-nivprog-nombre">{n.nombre}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pd-nivprog-barra-wrap" aria-hidden>
        <div
          className="pd-nivprog-barra"
          style={{ width: `${porcentaje}%`, background: nivelActual.color }}
        />
      </div>
      <p className="pd-nivprog-label">
        {totalPuntos.toLocaleString('es-AR')} pts
        {sig ? ` · faltan ${(sig.puntosMin - totalPuntos).toLocaleString('es-AR')} para ${sig.nombre}` : ' · nivel máximo 🏆'}
      </p>
    </div>
  );
}
