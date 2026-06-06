import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { arrowBack, locationOutline } from 'ionicons/icons';
import { getDestinoBySlug } from '../data/destinos';
import { recordDestinoVisit } from '../logic/destinosHomeStorage';
import type { DocumentacionDestino } from '../data/destinos';
import { SeguroBlock } from './ResultadoAventura';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { PdUserMenu } from '../components/PdUserMenu';
import { useWikipediaImages } from '../hooks/useWikipediaImages';
import { wikiImages as localWikiImages } from '../data/wikiImages';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';
import { SCROLL_EXTRA_PAST_CONTENT_TOP_PX } from '../utils/scrollIntoScrollParent';
import { PdFavoritoDestinoButton } from '../components/PdFavoritoDestinoButton';
import { PdVueloFavoritoSection } from '../components/PdVueloFavoritoSection';
import { isFavoriteDestino } from '../logic/destinosFavoritosStorage';


function scrollContentBelowHero(
  scrollRoot: HTMLDivElement | null,
  contentEl: HTMLDivElement | null,
) {
  if (!scrollRoot || !contentEl) return;
  const top =
    scrollRoot.scrollTop +
    contentEl.getBoundingClientRect().top -
    scrollRoot.getBoundingClientRect().top;
  scrollRoot.scrollTo({
    top: Math.max(0, top + SCROLL_EXTRA_PAST_CONTENT_TOP_PX),
    behavior: 'smooth',
  });
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
  const { chromeVisible, ionScrollProps, notifyScrollTop } = useFloatingChromeScroll();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = slug ? getDestinoBySlug(slug) : undefined;
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  /* ── Favorito state: controla layout compacto vs sábana ── */
  const [isFav, setIsFav] = useState(() => (slug ? isFavoriteDestino(slug) : false));

  useEffect(() => {
    const update = () => setIsFav(slug ? isFavoriteDestino(slug) : false);
    window.addEventListener('pd-favoritos-changed', update);
    return () => window.removeEventListener('pd-favoritos-changed', update);
  }, [slug]);

  useEffect(() => {
    if (slug && destino) recordDestinoVisit(slug);
  }, [slug, destino]);

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
  const { images: wikiApiImages, loading: wikiLoading } = useWikipediaImages(
    !hasLocalImages ? destino?.id : undefined,
  );
  const images = useMemo(() => {
    if (!destino) return [];
    if (hasLocalImages)           return localWikiImages[destino.id];
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
    if (scrollRef.current) {
      const t = scrollRef.current.scrollTop;
      setScrollY(t);
      notifyScrollTop(t);
    }
  }, [notifyScrollTop]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (destino) document.title = `${destino.nombre} – Para Dónde?`;
  }, [destino]);

  /* Desde Mis viajes (#destino-vuelos): bajar al dashboard directamente */
  useEffect(() => {
    if (location.hash !== '#destino-vuelos') return;
    const run = () => {
      scrollContentBelowHero(scrollRef.current, contentRef.current);
    };
    const t = window.setTimeout(run, 120);
    return () => window.clearTimeout(t);
  }, [location.hash, location.pathname, slug, destino?.id]);

  /* Not found */
  if (!destino) {
    return (
      <IonPage>
        <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
        <IonContent className="ion-padding" {...ionScrollProps}>
          <div className="pd-content pd-subpage-inner" style={{ color: 'var(--pd-color-text)' }}>
            <p>No encontramos ese destino.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  /* Scroll-driven values */
  const vh = typeof window !== 'undefined' ? window.innerHeight : 700;
  const heroContentOpacity = Math.max(0, 1 - scrollY / (vh * 0.52));
  const scrollHintOpacity  = Math.max(0, 1 - scrollY / (vh * 0.18));
  const chromeHidden = !chromeVisible;

  const ta   = destino.reseñasExternas?.tripadvisor;
  const book = destino.reseñasExternas?.booking;

  const mapsSearchHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    destino.nombre + (destino.pais ? `, ${destino.pais}` : ', Argentina'),
  )}`;

  const regionLabel =
    destino.region === 'europa'        ? ' · Europa' :
    destino.region === 'norteamerica'  ? ' · América del Norte' :
    destino.region === 'sudamerica'    ? ' · Sudamérica' :
    destino.region === 'asia'          ? ' · Asia' :
    destino.region === 'caribe'        ? ' · Caribe' :
    destino.region === 'medio_oriente' ? ' · Medio Oriente' :
    destino.region === 'africa'        ? ' · África' : '';

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
        <div className="pd-destino-bg-dim" />
      </div>

      {/* ── Volver ── */}
      <div className={`pd-floating-chrome pd-floating-chrome--dest-back${chromeHidden ? ' pd-floating-chrome--hidden' : ''}`}>
        <button type="button" className="pd-destino-floating-btn" onClick={() => navigate(-1)} aria-label="Volver">
          <IonIcon icon={arrowBack} />
          <span>Volver</span>
        </button>
      </div>

      {/* ── Mapa + menú ── */}
      <div className={`pd-floating-chrome pd-floating-chrome--dest-trailing${chromeHidden ? ' pd-floating-chrome--hidden' : ''}`}>
        <a
          href={mapsSearchHref}
          target="_blank"
          rel="noopener noreferrer"
          className="pd-destino-floating-btn pd-destino-floating-map pd-destino-floating-btn--icon-only"
          aria-label={`Mapa: ${destino.nombre}`}
        >
          <IonIcon icon={locationOutline} />
          <span className="pd-destino-floating-text">Mapa</span>
        </a>
        <PdUserMenu />
      </div>

      {/* ── Scrollable container ── */}
      <div ref={scrollRef} className="pd-destino-scroll">

        {/* ── Hero: 100dvh ── */}
        <section className="pd-destino-hero">
          <div className={`pd-destino-hero-grad${isFav ? ' pd-destino-hero-grad--fav' : ''}`} />

          <div className="pd-destino-hero-body" style={{ opacity: heroContentOpacity }}>
            {destino.pais && destino.region !== 'argentina' && (
              <span className="pd-destino-hero-region">{destino.pais}{regionLabel}</span>
            )}
            <h1 className="pd-destino-hero-title">{destino.nombre}</h1>
            <p className="pd-destino-hero-desc">{destino.descripcionCorta}</p>

            <div className="pd-destino-hero-stats">
              {ta && (
                <a href={ta.url} target="_blank" rel="noopener noreferrer"
                  className="pd-destino-hero-stat pd-destino-hero-stat--link"
                  aria-label={`Ver opiniones en TripAdvisor (${ta.puntaje} de 5)`}>
                  ⭐ {ta.puntaje}<small>/5 TripAdvisor</small>
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

          {wikiLoading && !hasLocalImages && (
            <div className="pd-destino-wiki-badge" aria-label="Cargando fotos reales del destino">
              <span className="pd-destino-wiki-spinner" />
              Cargando fotos reales…
            </div>
          )}

          {!isFav && <div className="pd-hero-to-content-fade" aria-hidden="true" />}

          <div className="pd-destino-hero-scroll-hint-wrap" style={{ opacity: scrollHintOpacity }}>
            <button type="button" className="pd-destino-hero-scroll-hint-btn"
              onClick={scrollHeroToContent} aria-label="Ver información del destino">
              ↓
            </button>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            LAYOUT COMPACTO — "Mis viajes" (isFav = true)
            Grilla 3 columnas: Vuelos | Docs | Info
        ══════════════════════════════════════════════ */}
        {isFav ? (
          <div ref={contentRef} className="pd-destino-dashboard">

            <div className="pd-destino-dash-grid">

              {/* Col 1 — Vuelos */}
              <div className="pd-destino-dash-card">
                <p className="pd-destino-dash-card-title">✈ Vuelos</p>
                {slug && <PdVueloFavoritoSection destinoSlug={slug} />}
              </div>

              {/* Col 2 — Documentación */}
              <div className="pd-destino-dash-card">
                <p className="pd-destino-dash-card-title">📋 Docs</p>
                <p className="pd-destino-dash-card-hint">Verificá en Migraciones antes de viajar.</p>
                <DocumentacionSection doc={destino.documentacion} />
              </div>

              {/* Col 3 — Info rápida */}
              <div className="pd-destino-dash-card">
                <p className="pd-destino-dash-card-title">🗺 Info</p>
                <p className="pd-destino-dash-info-label">📅 Cuándo ir</p>
                <p className="pd-destino-dash-info-text">{destino.guia.cuandoIr}</p>
                <p className="pd-destino-dash-info-label">⏱ Cuántos días</p>
                <p className="pd-destino-dash-info-text">{destino.guia.cuantosDias}</p>
                {(ta || book) && (
                  <div className="pd-destino-dash-ratings">
                    {ta   && <span className="pd-destino-dash-rating"><a href={ta.url}   target="_blank" rel="noopener noreferrer">⭐ {ta.puntaje}/5 <small>TripAdvisor</small></a></span>}
                    {book && <span className="pd-destino-dash-rating"><a href={book.url} target="_blank" rel="noopener noreferrer">⭐ {book.puntaje}/5 <small>Booking</small></a></span>}
                  </div>
                )}
              </div>

            </div>

            {/* Footer: botón fav + acciones rápidas */}
            <div className="pd-destino-dash-footer">
              {slug && <PdFavoritoDestinoButton slug={slug} className="pd-destino-fav-wrap" />}
              <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer"
                className="pd-destino-dash-footer-link">🏨 Booking</a>
              <Link to="/guias/que-llevar" className="pd-destino-dash-footer-link">🧳 Checklist</Link>
              <a href={mapsSearchHref} target="_blank" rel="noopener noreferrer"
                className="pd-destino-dash-footer-link">📍 Mapa</a>
            </div>

          </div>

        ) : (

        /* ══════════════════════════════════════════════
            LAYOUT COMPLETO — explorar destino (isFav = false)
        ══════════════════════════════════════════════ */
          <div ref={contentRef} className="pd-destino-content">
            <div className="pd-destino-content-inner">

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
                      <a href={ta.url} target="_blank" rel="noopener noreferrer" className="pd-destino-review-link">Ver →</a>
                    </div>
                  )}
                  {book && (
                    <div className="pd-destino-review-row" style={{ marginTop: '0.65rem' }}>
                      <div className="pd-destino-review-info">
                        <span className="pd-destino-review-score">{book.puntaje}/5</span>
                        <span className="pd-destino-review-label">Booking</span>
                      </div>
                      <span className="pd-destino-review-count">{book.cantidad.toLocaleString()} opiniones</span>
                      <a href={book.url} target="_blank" rel="noopener noreferrer" className="pd-destino-review-link">Alojamientos →</a>
                    </div>
                  )}
                </div>
              )}

              <div className="pd-destino-glass-section pd-destino-glass-section--documentacion">
                <p className="pd-destino-doc-kicker">Requisitos orientativos</p>
                <h2 className="pd-destino-glass-title">📋 Documentación</h2>
                <p className="pd-destino-doc-lead">
                  Resumen para planificar; siempre verificá en Migraciones, consulados y aerolínea antes de viajar.
                </p>
                <DocumentacionSection doc={destino.documentacion} />
              </div>

              <SeguroBlock forDestino={destino} />

              <div className="pd-destino-glass-section pd-destino-links-section">
                {slug ? <PdFavoritoDestinoButton slug={slug} className="pd-destino-fav-wrap" /> : null}
                <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer" className="pd-destino-link">
                  🏨 Ver alojamientos en Booking.com →
                </a>
                <Link to="/guias/que-llevar" className="pd-destino-link">
                  🧳 Armar mi checklist para este viaje →
                </Link>
                <a href={mapsSearchHref} target="_blank" rel="noopener noreferrer" className="pd-destino-link">
                  📍 Ver en mapa →
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </IonPage>
  );
}
