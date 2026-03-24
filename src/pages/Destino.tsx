import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { IonPage } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { arrowBack, locationOutline } from 'ionicons/icons';
import { getDestinoBySlug } from '../data/destinos';
import type { DocumentacionDestino } from '../data/destinos';
import { SeguroBlock } from './ResultadoAventura';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { PdThemeToggle } from '../components/PdThemeToggle';
import { useWikipediaImages } from '../hooks/useWikipediaImages';
import { wikiImages as localWikiImages } from '../data/wikiImages';

function scrollContentBelowHero(
  scrollRoot: HTMLDivElement | null,
  contentEl: HTMLDivElement | null,
) {
  if (!scrollRoot || !contentEl) return;
  scrollRoot.scrollTo({ top: contentEl.offsetTop, behavior: 'smooth' });
}

/* ─────────────────────────────── Doc cards ── */

interface DocCardProps {
  icon: string;
  titulo: string;
  estado: 'ok' | 'warning' | 'info';
  texto: string;
}
function DocCard({ icon, titulo, estado, texto }: DocCardProps) {
  return (
    <div className={`pd-doc-card pd-doc-card--${estado}`}>
      <span className="pd-doc-card-icon">{icon}</span>
      <div className="pd-doc-card-body">
        <p className="pd-doc-card-title">{titulo}</p>
        <p className="pd-doc-card-text">{texto}</p>
      </div>
    </div>
  );
}

function DocumentacionSection({ doc }: { doc: DocumentacionDestino }) {
  return (
    <>
      <div className="pd-doc-cards-grid">
        <DocCard
          icon={doc.pasaporte ? '🛂' : '🪪'}
          titulo={doc.pasaporte ? 'Pasaporte vigente' : 'DNI alcanza'}
          estado={doc.pasaporte ? 'warning' : 'ok'}
          texto={
            doc.pasaporte
              ? 'Para este destino necesitás pasaporte vigente.'
              : 'Podés viajar con tu DNI argentino, sin pasaporte.'
          }
        />
        <DocCard
          icon={doc.visa ? '📄' : '✅'}
          titulo={doc.visa ? 'Visa requerida' : 'Sin visa'}
          estado={doc.visa ? 'warning' : 'ok'}
          texto={doc.visa
            ? (doc.visaInfo ?? 'Se requiere trámite de visa previo al viaje.')
            : (doc.visaInfo ?? 'No necesitás visa para este destino.')}
        />
        {doc.vacunas && doc.vacunas.length > 0 && (
          <DocCard
            icon="💉"
            titulo="Vacunas recomendadas"
            estado="info"
            texto={doc.vacunas.join(' · ')}
          />
        )}
        <DocCard
          icon={doc.seguroRecomendado ? '🛡️' : '🤙'}
          titulo={doc.seguroRecomendado ? 'Seguro recomendado' : 'Seguro opcional'}
          estado={doc.seguroRecomendado ? 'info' : 'ok'}
          texto={
            doc.seguroRecomendado
              ? 'Te recomendamos contratar seguro de viaje para este destino.'
              : 'No es indispensable, pero siempre es una buena idea tenerlo.'
          }
        />
      </div>
      {doc.notas && <p className="pd-doc-notas">ℹ️ {doc.notas}</p>}
    </>
  );
}

/* ─────────────────────────────── Page ── */

export default function Destino() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const destino = slug ? getDestinoBySlug(slug) : undefined;
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const scrollHeroToContent = useCallback(() => {
    scrollContentBelowHero(scrollRef.current, contentRef.current);
  }, []);

  /*
    Image priority:
      1. Pre-downloaded local images (public/images/destinos/{id}/) → instant
      2. Wikipedia API fetch (async) → only when local images don't exist yet
      3. destino.imageUrl (Unsplash) → final fallback
  */
  const hasLocalImages = Boolean(destino && localWikiImages[destino.id]?.length);

  /* Only hit the Wikipedia API if we have no local images */
  const { images: wikiApiImages, loading: wikiLoading } = useWikipediaImages(
    !hasLocalImages ? destino?.id : undefined,
  );

  const images = useMemo(() => {
    if (!destino) return [];
    if (hasLocalImages)          return localWikiImages[destino.id];
    if (wikiApiImages.length > 0) return wikiApiImages;
    return destino.imageUrl ? [destino.imageUrl] : [];
  }, [destino, hasLocalImages, wikiApiImages]);

  /* Two-slot crossfade bg cycling */
  const [slotA, setSlotA] = useState({ idx: 0, opacity: 1 });
  const [slotB, setSlotB] = useState({ idx: 1, opacity: 0 });
  const activeSlot = useRef<'a' | 'b'>('a');

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

  /* Scroll tracking */
  const handleScroll = useCallback(() => {
    if (scrollRef.current) setScrollY(scrollRef.current.scrollTop);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (destino) document.title = `${destino.nombre} – Para Dónde?`;
  }, [destino]);

  /* Not found */
  if (!destino) {
    return (
      <IonPage>
        <PdSubpageChrome onBack={() => navigate(-1)} />
        <div className="pd-content pd-subpage-inner" style={{ padding: '1rem', color: 'var(--pd-color-text)' }}>
          <p>No encontramos ese destino.</p>
        </div>
      </IonPage>
    );
  }

  /* Scroll-driven values */
  const vh = typeof window !== 'undefined' ? window.innerHeight : 700;
  const heroContentOpacity = Math.max(0, 1 - scrollY / (vh * 0.52));
  const scrollHintOpacity  = Math.max(0, 1 - scrollY / (vh * 0.18));
  /* bg veil: subtle darkening as content scrolls in */
  const bgVeilOpacity      = Math.min(0.55, scrollY / (vh * 1.1));

  const ta   = destino.reseñasExternas?.tripadvisor;
  const book = destino.reseñasExternas?.booking;

  const regionLabel =
    destino.region === 'europa'         ? ' · Europa' :
    destino.region === 'norteamerica'   ? ' · América del Norte' :
    destino.region === 'sudamerica'     ? ' · Sudamérica' :
    destino.region === 'asia'           ? ' · Asia' :
    destino.region === 'caribe'         ? ' · Caribe' :
    destino.region === 'medio_oriente'  ? ' · Medio Oriente' :
    destino.region === 'africa'         ? ' · África' : '';

  return (
    <IonPage className="pd-destino-page">

      {/* ── Fixed cycling background ── */}
      <div className="pd-destino-bg-fixed" aria-hidden="true">
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
        {/* Static dim for readability */}
        <div className="pd-destino-bg-dim" />
        {/* Scroll-driven veil */}
        <div className="pd-destino-bg-veil" style={{ opacity: bgVeilOpacity }} />
      </div>

      {/* ── Floating back button ── */}
      <button
        className="pd-destino-floating-btn pd-destino-floating-back"
        onClick={() => navigate(-1)}
        aria-label="Volver"
      >
        <IonIcon icon={arrowBack} />
        <span>Volver</span>
      </button>

      {/* ── Mapa + tema (derecha), mismo estilo que subpáginas ── */}
      <div className="pd-destino-floating-right">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            destino.nombre + (destino.pais ? ', ' + destino.pais : ', Argentina'),
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pd-destino-floating-btn pd-destino-floating-map"
          aria-label="Ver mapa"
        >
          <IonIcon icon={locationOutline} />
          <span>Mapa</span>
        </a>
        <PdThemeToggle />
      </div>

      {/* ── Scrollable container ── */}
      <div ref={scrollRef} className="pd-destino-scroll">

        {/* ── Hero: 100vh ── */}
        <section className="pd-destino-hero">
          {/* Bottom gradient for text readability */}
          <div className="pd-destino-hero-grad" />

          {/* Hero content fades with scroll */}
          <div className="pd-destino-hero-body" style={{ opacity: heroContentOpacity }}>
            {destino.pais && destino.region !== 'argentina' && (
              <span className="pd-destino-hero-region">
                {destino.pais}{regionLabel}
              </span>
            )}
            <h1 className="pd-destino-hero-title">{destino.nombre}</h1>
            <p className="pd-destino-hero-desc">{destino.descripcionCorta}</p>

            {/* Quick stats row */}
            <div className="pd-destino-hero-stats">
              {ta && (
                <a
                  href={ta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-destino-hero-stat pd-destino-hero-stat--link"
                  aria-label={`Ver opiniones de ${destino.nombre} en TripAdvisor (${ta.puntaje} de 5)`}
                >
                  ⭐ {ta.puntaje}
                  <small>/5 TripAdvisor</small>
                </a>
              )}
              {destino.presupuestoEstimado && (
                <span className="pd-destino-hero-stat">
                  💰 ${Math.round(destino.presupuestoEstimado.minARS / 1000)}K – ${Math.round(destino.presupuestoEstimado.maxARS / 1000)}K
                  <small> ARS est.</small>
                </span>
              )}
              {destino.itinerario && (
                <span className="pd-destino-hero-stat">
                  📅 {destino.itinerario.duracionDias} días recomendados
                </span>
              )}
            </div>
          </div>

          {/* Loading badge — only shown when fetching from API (no local images yet) */}
          {wikiLoading && !hasLocalImages && (
            <div className="pd-destino-wiki-badge" aria-label="Cargando fotos reales del destino">
              <span className="pd-destino-wiki-spinner" />
              Cargando fotos reales…
            </div>
          )}

          {/* Transición foto → contenido (misma lectura que el scroll con el velo) */}
          <div className="pd-hero-to-content-fade" aria-hidden="true" />

          {/* Scroll hint */}
          <div className="pd-destino-hero-scroll-hint-wrap" style={{ opacity: scrollHintOpacity }}>
            <button
              type="button"
              className="pd-destino-hero-scroll-hint-btn"
              onClick={scrollHeroToContent}
              aria-label="Ver información del destino"
            >
              ↓
            </button>
          </div>
        </section>

        {/* ── Glass content sections ── */}
        <div ref={contentRef} className="pd-destino-content">
          <div className="pd-destino-content-inner">

            {/* Qué ver / Cuándo ir / Tips */}
            <div className="pd-destino-glass-section">
              <h2 className="pd-destino-glass-title">🗺️ Qué ver</h2>
              <p className="pd-destino-glass-text">{destino.guia.queVer}</p>

              <div className="pd-destino-glass-row">
                <div>
                  <h3 className="pd-destino-glass-sub">📅 Cuándo ir</h3>
                  <p className="pd-destino-glass-text">{destino.guia.cuandoIr}</p>
                </div>
                <div>
                  <h3 className="pd-destino-glass-sub">⏱️ Cuántos días</h3>
                  <p className="pd-destino-glass-text">{destino.guia.cuantosDias}</p>
                </div>
              </div>

              <h3 className="pd-destino-glass-sub" style={{ marginTop: '1rem' }}>💡 Tips</h3>
              <p className="pd-destino-glass-text">{destino.guia.tips}</p>
            </div>

            {/* Reseñas */}
            {(ta || book) && (
              <div className="pd-destino-glass-section">
                <h2 className="pd-destino-glass-title">⭐ Reseñas</h2>
                {ta && (
                  <div className="pd-destino-review-row">
                    <div className="pd-destino-review-info">
                      <span className="pd-destino-review-score">{ta.puntaje}/5</span>
                      <span className="pd-destino-review-label">TripAdvisor</span>
                    </div>
                    <span className="pd-destino-review-count">{ta.cantidad.toLocaleString()} opiniones</span>
                    <a href={ta.url} target="_blank" rel="noopener noreferrer" className="pd-destino-review-link">
                      Ver →
                    </a>
                  </div>
                )}
                {book && (
                  <div className="pd-destino-review-row" style={{ marginTop: '0.65rem' }}>
                    <div className="pd-destino-review-info">
                      <span className="pd-destino-review-score">{book.puntaje}/5</span>
                      <span className="pd-destino-review-label">Booking</span>
                    </div>
                    <span className="pd-destino-review-count">{book.cantidad.toLocaleString()} opiniones</span>
                    <a href={book.url} target="_blank" rel="noopener noreferrer" className="pd-destino-review-link">
                      Alojamientos →
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Documentación */}
            <div className="pd-destino-glass-section">
              <h2 className="pd-destino-glass-title">📋 Documentación necesaria</h2>
              <DocumentacionSection doc={destino.documentacion} />
            </div>

            {/* Seguro */}
            <SeguroBlock forDestino={destino} />

            {/* Links */}
            <div className="pd-destino-glass-section pd-destino-links-section">
              <a
                href="https://www.booking.com"
                target="_blank"
                rel="noopener noreferrer"
                className="pd-destino-link"
              >
                🏨 Ver alojamientos en Booking.com →
              </a>
              <Link to="/guias/que-llevar" className="pd-destino-link">
                🧳 Armar mi checklist para este viaje →
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="pd-destino-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, font: 'inherit' }}
              >
                ← Volver al destino anterior
              </button>
            </div>

          </div>
        </div>
      </div>
    </IonPage>
  );
}
