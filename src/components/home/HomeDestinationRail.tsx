import { Link } from 'react-router-dom';
import type { Destino } from '../../data/destinos';
import { HomeMiniDestinoCard } from './HomeMiniDestinoCard';

type Props = {
  title: string;
  destinos: Destino[];
  verTodosTo?: string;
  verTodosLabel?: string;
  emptyHint?: string;
  /** Ancla para scroll desde el hero (ej. mis-destinos) */
  sectionId?: string;
};

function railId(title: string) {
  return `pd-hub-rail-${title.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export function HomeDestinationRail({
  title,
  destinos,
  verTodosTo,
  verTodosLabel = 'Ver todos',
  emptyHint,
  sectionId,
}: Props) {
  const rid = railId(title);
  return (
    <section
      id={sectionId}
      className={`pd-home-hub-section${sectionId ? ' pd-home-hub-section--scroll-target' : ''}`}
      aria-labelledby={rid}
    >
      <div className="pd-home-hub-section-head">
        <h2 id={rid} className="pd-home-hub-section-title">
          {title}
        </h2>
        {verTodosTo ? (
          <Link to={verTodosTo} className="pd-home-hub-section-link">
            {verTodosLabel} →
          </Link>
        ) : null}
      </div>
      {destinos.length === 0 ? (
        <p className="pd-home-hub-empty">{emptyHint ?? 'Todavía no hay destinos para mostrar.'}</p>
      ) : (
        <div className="pd-home-hub-rail" role="list">
          {destinos.map((d) => (
            <div key={d.id} className="pd-home-hub-rail-item" role="listitem">
              <HomeMiniDestinoCard destino={d} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
