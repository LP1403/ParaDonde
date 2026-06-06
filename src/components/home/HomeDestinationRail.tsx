import { useCallback, useEffect, useRef } from 'react';
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

const DRAG_THRESHOLD_PX = 8;

export function HomeDestinationRail({
  title,
  destinos,
  verTodosTo,
  verTodosLabel = 'Ver todos',
  emptyHint,
  sectionId,
}: Props) {
  const rid = railId(title);
  const railRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const unbindDragRef = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      unbindDragRef.current?.();
      unbindDragRef.current = null;
    },
    [],
  );

  /** Rueda + barra oculta no desplazan bien: arrastre con mouse via listeners en document. */
  const onMouseDownCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !railRef.current) return;
    const rail = railRef.current;
    unbindDragRef.current?.();

    const startX = e.clientX;
    const startScroll = rail.scrollLeft;
    let moved = false;

    const onMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      rail.scrollLeft = startScroll - dx;
      if (Math.abs(dx) > DRAG_THRESHOLD_PX) {
        moved = true;
        ev.preventDefault();
      }
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      unbindDragRef.current = null;
      if (moved) suppressClickRef.current = true;
    };

    document.addEventListener('mousemove', onMouseMove, { passive: false });
    document.addEventListener('mouseup', onMouseUp);
    unbindDragRef.current = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const onClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    e.preventDefault();
    e.stopPropagation();
  }, []);

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
        <div
          ref={railRef}
          className="pd-home-hub-rail"
          role="list"
          onMouseDownCapture={onMouseDownCapture}
          onClickCapture={onClickCapture}
        >
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
