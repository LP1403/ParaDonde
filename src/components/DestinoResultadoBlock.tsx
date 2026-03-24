import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Destino } from '../data/destinos';
import { urlsImagenesDestino } from '../utils/destinoImagenes';
import { scrollElementToTopInScrollParent } from '../utils/scrollIntoScrollParent';
import { useWikipediaImages } from '../hooks/useWikipediaImages';
import { wikiImages as localWikiImages } from '../data/wikiImages';
import { IonIcon } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';

function truncar(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function regionEtiqueta(d: Destino): string {
  if (!d.pais || d.region === 'argentina') return '';
  const suf =
    d.region === 'europa'
      ? ' · Europa'
      : d.region === 'norteamerica'
        ? ' · América del Norte'
        : d.region === 'sudamerica'
          ? ' · Sudamérica'
          : d.region === 'asia'
            ? ' · Asia'
            : d.region === 'caribe'
              ? ' · Caribe'
              : d.region === 'medio_oriente'
                ? ' · Medio Oriente'
                : d.region === 'africa'
                  ? ' · África'
                  : '';
  return `${d.pais}${suf}`;
}

function fmtARS(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace('.0', '')} M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)} K`;
  return `$${n}`;
}

function ItinerarioVertical({ d }: { d: Destino }) {
  const it = d.itinerario;
  if (!it) return null;

  const pasos: { tag: string; texto: string; variant?: 'start' | 'mid' | 'end' }[] = [
    { tag: 'Inicio', texto: it.inicio, variant: 'start' },
    ...it.paradas.map((p, i) => ({
      tag: `Día ${i + 1}`,
      texto: p,
      variant: 'mid' as const,
    })),
    { tag: 'Final', texto: it.fin, variant: 'end' },
  ];

  return (
    <div className="pd-itinerario-v">
      <h3 className="pd-itinerario-v-heading">Tu viaje, en resumen</h3>
      <p className="pd-itinerario-v-meta">
        ~{it.distanciaTotalKm.toLocaleString('es-AR')} km · {it.duracionDias} días sugeridos
      </p>
      <ul className="pd-itinerario-v-list" aria-label="Itinerario sugerido">
        {pasos.map((step, i) => (
          <li key={i} className={`pd-itinerario-v-item pd-itinerario-v-item--${step.variant ?? 'mid'}`}>
            <span className="pd-itinerario-v-badge">{step.tag}</span>
            <p className="pd-itinerario-v-text">{step.texto}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Props = {
  destino: Destino;
  /** Contenido extra bajo la descripción (ej. bloque “¿Por qué…?”) */
  children?: ReactNode;
};

/**
 * Un destino en la lista de resultados: hero + crossfade como la guía completa,
 * debajo bloques glass con info reducida; el siguiente destino empieza pegado abajo.
 */
export function DestinoResultadoBlock({ destino: d, children }: Props) {
  const hasLocalImages = Boolean(localWikiImages[d.id]?.length);
  const { images: wikiApiImages, loading: wikiLoading } = useWikipediaImages(
    !hasLocalImages ? d.id : undefined,
  );

  const images = useMemo(
    () => urlsImagenesDestino(d, wikiApiImages),
    [d, wikiApiImages],
  );

  const imagesKey = images.join('|');

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollHeroToContent = () => {
    scrollElementToTopInScrollParent(contentRef.current);
  };

  const [slotA, setSlotA] = useState({ idx: 0, opacity: 1 });
  const [slotB, setSlotB] = useState({ idx: 1, opacity: 0 });
  const activeSlot = useRef<'a' | 'b'>('a');

  useEffect(() => {
    if (images.length <= 1) return;
    setSlotA({ idx: 0, opacity: 1 });
    setSlotB({ idx: 1 % images.length, opacity: 0 });
    activeSlot.current = 'a';
  }, [imagesKey, images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    let nextIdx = 1;
    const timer = setInterval(() => {
      nextIdx = (nextIdx + 1) % images.length;
      if (activeSlot.current === 'a') {
        setSlotB({ idx: nextIdx, opacity: 1 });
        setSlotA((s) => ({ ...s, opacity: 0 }));
        activeSlot.current = 'b';
      } else {
        setSlotA({ idx: nextIdx, opacity: 1 });
        setSlotB((s) => ({ ...s, opacity: 0 }));
        activeSlot.current = 'a';
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const ta = d.reseñasExternas?.tripadvisor;
  const region = regionEtiqueta(d);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    d.nombre + (d.pais ? ', ' + d.pais : ', Argentina'),
  )}`;

  return (
    <article className="pd-resultado-destino-block">
      <section className="pd-resultado-destino-hero">
        <div className="pd-resultado-hero-layers" aria-hidden="true">
          {images.length > 1 ? (
            <>
              {images[slotA.idx] && (
                <div
                  className="pd-destino-bg-slot"
                  style={{ backgroundImage: `url(${images[slotA.idx]})`, opacity: slotA.opacity }}
                />
              )}
              {images[slotB.idx] && (
                <div
                  className="pd-destino-bg-slot"
                  style={{ backgroundImage: `url(${images[slotB.idx]})`, opacity: slotB.opacity }}
                />
              )}
            </>
          ) : images[0] ? (
            <div
              className="pd-destino-bg-slot"
              style={{ backgroundImage: `url(${images[0]})`, opacity: 1 }}
            />
          ) : null}
          <div className="pd-destino-bg-dim" />
        </div>

        <div className="pd-destino-hero-grad" />

        <div className="pd-destino-hero-body">
          {region && <span className="pd-destino-hero-region">{region}</span>}
          <h2 className="pd-destino-hero-title">{d.nombre}</h2>
          <p className="pd-destino-hero-desc">{d.descripcionCorta}</p>

          <div className="pd-destino-hero-stats">
            {ta && (
              <span className="pd-destino-hero-stat">
                ⭐ {ta.puntaje}
                <small>/5 TripAdvisor</small>
              </span>
            )}
            {d.presupuestoEstimado && (
              <span className="pd-destino-hero-stat">
                💰 {fmtARS(d.presupuestoEstimado.minARS)} – {fmtARS(d.presupuestoEstimado.maxARS)}
                <small> ARS est.</small>
              </span>
            )}
            {d.itinerario && (
              <span className="pd-destino-hero-stat">
                📅 {d.itinerario.duracionDias} días
              </span>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-destino-hero-stat pd-resultado-hero-map-pill"
            >
              <IonIcon icon={locationOutline} style={{ fontSize: '1rem' }} />
              <small style={{ fontWeight: 700, color: 'inherit' }}>Mapa</small>
            </a>
          </div>
        </div>

        {wikiLoading && !hasLocalImages && (
          <div className="pd-destino-wiki-badge" aria-label="Cargando fotos">
            <span className="pd-destino-wiki-spinner" />
            Cargando fotos…
          </div>
        )}

        <div className="pd-hero-to-content-fade" aria-hidden="true" />

        <div className="pd-destino-hero-scroll-hint-wrap">
          <button
            type="button"
            className="pd-destino-hero-scroll-hint-btn"
            onClick={scrollHeroToContent}
            aria-label="Ver información de este destino"
          >
            ↓
          </button>
        </div>
      </section>

      <div ref={contentRef} className="pd-destino-content pd-resultado-destino-content">
        <div className="pd-destino-content-inner">
          <div className="pd-destino-glass-section">
            <h3 className="pd-destino-glass-title">🗺️ Qué ver</h3>
            <p className="pd-destino-glass-text">{truncar(d.guia.queVer, 280)}</p>
            <div className="pd-destino-glass-row">
              <div>
                <h3 className="pd-destino-glass-sub">📅 Mejor época</h3>
                <p className="pd-destino-glass-text">{truncar(d.guia.cuandoIr, 160)}</p>
              </div>
              <div>
                <h3 className="pd-destino-glass-sub">⏱️ Duración</h3>
                <p className="pd-destino-glass-text">{truncar(d.guia.cuantosDias, 120)}</p>
              </div>
            </div>
            <h3 className="pd-destino-glass-sub" style={{ marginTop: '1rem' }}>
              💡 Tip rápido
            </h3>
            <p className="pd-destino-glass-text">{truncar(d.guia.tips, 200)}</p>
          </div>

          {children}

          {d.presupuestoEstimado && (
            <div className="pd-resultado-budget">
              <span className="pd-resultado-budget-label">Presupuesto estimado</span>
              <span className="pd-resultado-budget-range">
                {fmtARS(d.presupuestoEstimado.minARS)} – {fmtARS(d.presupuestoEstimado.maxARS)} ARS
              </span>
            </div>
          )}

          {d.itinerario && (
            <div className="pd-destino-glass-section">
              <ItinerarioVertical d={d} />
            </div>
          )}

          <div className="pd-resultado-cta-row">
            <Link to={`/destino/${d.slug}`} className="pd-resultado-cta pd-resultado-cta--primary">
              Guía completa
            </Link>
            {ta && (
              <a
                href={ta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-resultado-cta pd-resultado-cta--tripadvisor"
              >
                <span className="pd-tripadvisor-icon" aria-hidden>
                  T
                </span>
                <span>Opiniones en TripAdvisor</span>
                <span className="pd-resultado-cta-rating">{ta.puntaje}/5</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
