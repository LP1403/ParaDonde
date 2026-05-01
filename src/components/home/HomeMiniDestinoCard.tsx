import { Link } from 'react-router-dom';
import type { Destino } from '../../data/destinos';
import { primeraImagenDestinoLista } from '../../utils/destinoImagenes';
import { duracionChip, presupuestoChip, tripAdvisorChip } from './homeDestinoUtils';

type Props = {
  destino: Destino;
};

export function HomeMiniDestinoCard({ destino: d }: Props) {
  const bg = primeraImagenDestinoLista(d) ?? '';
  const ta = tripAdvisorChip(d);
  const pres = presupuestoChip(d);
  const dias = duracionChip(d);

  return (
    <Link to={`/destino/${d.slug}`} className="pd-home-hub-card">
      <div
        className="pd-home-hub-card-img"
        style={bg ? { backgroundImage: `url(${bg})` } : undefined}
      >
        <div className="pd-home-hub-card-img-overlay" />
        <div className="pd-home-hub-card-body">
          <h3 className="pd-home-hub-card-title">{d.nombre}</h3>
          <div className="pd-home-hub-chips">
            {ta ? <span className="pd-home-hub-chip">{ta}</span> : null}
            {pres ? <span className="pd-home-hub-chip">⭐ {pres}</span> : null}
            {dias ? <span className="pd-home-hub-chip">⭐ {dias}</span> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
