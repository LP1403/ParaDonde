import { useEffect, useState, useMemo, useRef, useCallback, type ComponentRef } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { chevronUpOutline } from 'ionicons/icons';
import { Link, useNavigate } from 'react-router-dom';
import { destinos } from '../data/destinos';
import { preguntasAventura } from '../data/aventura';
import { recomendarDestinos, type TemporadaId } from '../logic/motorAventura';
import { armarInputDesdeRespuestasUrl } from '../logic/motorAventuraDinamico';
import { usePdTheme } from '../hooks/usePdTheme';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';
import { useHomeHubState } from '../hooks/useHomeHubState';
import { PdUserMenu } from '../components/PdUserMenu';
import { OrigenPaisFlagMedia } from '../components/OrigenPaisFlagMedia';
import { OrigenPaisMundoPicker } from '../components/OrigenPaisMundoPicker';
import { HomeHeroHub } from '../components/home/HomeHeroHub';
import { HomeActiveAdventureCard } from '../components/home/HomeActiveAdventureCard';
import { HomeDestinationRail } from '../components/home/HomeDestinationRail';
import { HomeExploreCategories } from '../components/home/HomeExploreCategories';
import { HomeAlertsList } from '../components/home/HomeAlertsList';
import { HomeBottomCta } from '../components/home/HomeBottomCta';
import { makeOrigenPaisIsoId } from '../logic/origenPaisResolve';
import { clearAventuraProgress, setPersistedOrigenPaisId } from '../logic/aventuraStorage';

/* ---------- Constants ---------- */

/** Montaña / cordillera de noche (tema oscuro) */
const HERO_BG_DARK =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80';
const HERO_BG_DARK_FALLBACK =
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80';
const HERO_BG_LIGHT =
  'https://images.unsplash.com/photo-1516302350523-4c918cc75af8?auto=format&fit=crop&w=1920&q=80';
/** Respaldo si el CDN principal falla (red, referrer, etc.) */
const HERO_BG_LIGHT_FALLBACK =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80';

const TEMPORADAS: { id: TemporadaId; label: string; sub: string }[] = [
  { id: 'verano',    label: 'Verano',     sub: 'Dic – mar (hem. sur)' },
  { id: 'otono',     label: 'Otoño',      sub: 'Mar – jun' },
  { id: 'invierno',  label: 'Invierno',   sub: 'Jun – sep' },
  { id: 'primavera', label: 'Primavera',  sub: 'Sep – dic' },
  { id: 'flexible',  label: 'Me da igual', sub: 'Cualquier época' },
];

const TEMP_BG: Record<string, string> = {
  verano:    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  otono:     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80',
  invierno:  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
  primavera: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1920&q=80',
  flexible:  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80',
};

const PREP_CARDS = [
  { icon: '📋', label: 'Documentación',    desc: 'Pasaporte, visa y requisitos',    to: '/guias/documentacion-viajar' },
  { icon: '🧳', label: 'Equipaje',         desc: 'Qué llevar y cómo empacar',       to: '/guias/que-llevar' },
  { icon: '✈️', label: 'Vuelos cancelados', desc: 'Tus derechos y pasos a seguir',   to: '/guias/vuelo-cancelado-demorado' },
  { icon: '💳', label: 'Pagos en exterior', desc: 'Dólar tarjeta y alternativas',    to: '/guias/pagar-exterior' },
];

const PRESUPUESTO_MIN = 50_000;
const PRESUPUESTO_MAX = 5_000_000;
const PRESUPUESTO_DEFAULT = 500_000;
const USD_RATE = 900;

/* ---------- Helpers ---------- */

function fmtARS(n: number) {
  return '$' + n.toLocaleString('es-AR');
}

function fmtUSD(n: number) {
  return '≈ $' + Math.round(n / USD_RATE).toLocaleString('en-US') + ' USD';
}

function preguntaPorId(id: string) {
  return preguntasAventura.find((p) => p.id === id);
}

/** Coherente con categorías del wizard /aventura */
function presupuestoToCategoria(ars: number): string {
  if (ars < 280_000) return 'economico';
  if (ars < 1_400_000) return 'medio';
  return 'sin_mirar';
}

function randomOpcionId(preguntaId: string): string {
  const p = preguntaPorId(preguntaId);
  if (!p?.opciones.length) return '';
  const opts =
    preguntaId === 'origen_pais' ? p.opciones.filter((o) => o.id !== 'otros') : p.opciones;
  if (!opts.length) return '';
  return opts[Math.floor(Math.random() * opts.length)].id;
}

/* ---------- Component ---------- */

export default function Home() {
  const navigate = useNavigate();

  const { isDark } = usePdTheme();
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const hubState = useHomeHubState();
  const isColdHub = hubState.isColdHub;
  const [hubHeroImgFailed, setHubHeroImgFailed] = useState(false);

  /* Adventure flow (solo estado frío: wizard embebido) */
  const [paso, setPaso] = useState(0);
  const [stepKey, setStepKey] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [presupuesto, setPresupuesto] = useState(PRESUPUESTO_DEFAULT);
  const [completado, setCompletado] = useState(false);
  const [origenMundoPickerOpen, setOrigenMundoPickerOpen] = useState(false);
  const [heroLightFallback, setHeroLightFallback] = useState(false);
  const [heroDarkFallback, setHeroDarkFallback] = useState(false);

  const aventuraRef = useRef<HTMLElement>(null);
  const homeContentRef = useRef<ComponentRef<typeof IonContent> | null>(null);

  const [showScrollToHero, setShowScrollToHero] = useState(false);

  const scrollToPreparaTuViaje = useCallback(() => {
    const el = document.getElementById('prepara-tu-viaje');
    if (!el) return;
    void (async () => {
      const ion = homeContentRef.current;
      try {
        const scrollEl = ion && (await ion.getScrollElement());
        if (scrollEl) {
          const elRect = el.getBoundingClientRect();
          const seRect = scrollEl.getBoundingClientRect();
          const y = elRect.top - seRect.top + scrollEl.scrollTop;
          scrollEl.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
          return;
        }
      } catch {
        /* fallback: scrollport distinto o SSR */
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })();
  }, []);

  const scrollToHomeHero = useCallback(() => {
    void (async () => {
      const ion = homeContentRef.current;
      try {
        const scrollEl = ion && (await ion.getScrollElement());
        if (scrollEl) {
          scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      } catch {
        /* fallback */
      }
      document.getElementById('pd-home-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })();
  }, []);

  useEffect(() => {
    let obs: IntersectionObserver | null = null;
    let cancelled = false;
    const t = window.setTimeout(() => {
      const ion = homeContentRef.current;
      if (!ion) return;
      void (async () => {
        try {
          const scrollEl = await ion.getScrollElement();
          const hero = document.getElementById('pd-home-hero');
          if (cancelled || !scrollEl || !hero) return;
          obs = new IntersectionObserver(
            (entries) => {
              const e = entries[0];
              if (!e) return;
              setShowScrollToHero(e.intersectionRatio < 0.22);
            },
            {
              root: scrollEl,
              threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.35, 0.5, 0.75, 1],
            },
          );
          obs.observe(hero);
        } catch {
          /* */
        }
      })();
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      obs?.disconnect();
    };
  }, []);
  const totalPasos = 7;

  /* Fondo de la sección aventura: misma foto visible en todos los pasos hasta cambiar de contexto */
  const [sectionBg, setSectionBg] = useState('');
  const [sectionBgOpacity, setBgOpacity] = useState(1);

  const changeSectionBg = useCallback((url: string) => {
    if (!url) return;
    setSectionBg(url);
    setBgOpacity(1);
  }, []);

  useEffect(() => {
    document.title = 'Para Dónde? – Guía de viajes';
  }, []);

  useEffect(() => {
    setHeroLightFallback(false);
    setHeroDarkFallback(false);
  }, [isDark]);

  useEffect(() => {
    setHubHeroImgFailed(false);
  }, [hubState.lastHeroImageUrl, isColdHub]);

  /* Vista previa: mismo motor que el resultado, con defaults hasta completar pasos */
  const mejorDestino = useMemo(() => {
    if (!respuestas.experiencia) return null;
    const input = armarInputDesdeRespuestasUrl(
      respuestas,
      paso >= 5 ? presupuesto : 400_000,
      (respuestas.temporada as TemporadaId) || 'flexible',
    );
    return recomendarDestinos(destinos, input, { max: 1 })[0] ?? null;
  }, [respuestas, presupuesto, paso]);

  /* When completed & a destination is known, show its image in the bg */
  useEffect(() => {
    if (completado && mejorDestino?.imageUrl) {
      changeSectionBg(mejorDestino.imageUrl);
    }
  }, [completado, mejorDestino, changeSectionBg]);

  /* Navigate forward (auto-advance) */
  const goNext = (key: string, value: string, imagenFondo?: string) => {
    if (key === 'origen_pais' && value === 'otros') {
      setOrigenMundoPickerOpen(true);
      return;
    }
    if (key === 'origen_pais') setPersistedOrigenPaisId(value);
    setRespuestas((prev) => ({ ...prev, [key]: value }));
    if (imagenFondo) changeSectionBg(imagenFondo);

    if (paso < totalPasos - 1) {
      setStepKey((k) => k + 1);
      setPaso((p) => p + 1);
    } else {
      setCompletado(true);
    }
  };

  const aplicarOrigenMundoEnHome = (iso2: string) => {
    const id = makeOrigenPaisIsoId(iso2);
    setPersistedOrigenPaisId(id);
    setRespuestas((prev) => ({ ...prev, origen_pais: id }));
    setOrigenMundoPickerOpen(false);
    if (paso < totalPasos - 1) {
      setStepKey((k) => k + 1);
      setPaso((p) => p + 1);
    } else {
      setCompletado(true);
    }
  };

  const goBack = () => {
    if (origenMundoPickerOpen) {
      setOrigenMundoPickerOpen(false);
      return;
    }
    if (paso > 0) {
      setStepKey((k) => k + 1);
      setPaso((p) => p - 1);
      setCompletado(false);
    }
  };

  const handleVerResultado = () => {
    const ars = Math.min(Math.max(presupuesto, PRESUPUESTO_MIN), PRESUPUESTO_MAX);
    const params = new URLSearchParams({
      origen_pais: respuestas.origen_pais ?? '',
      edad_viajero: respuestas.edad_viajero ?? '',
      compania: respuestas.compania ?? '',
      experiencia: respuestas.experiencia ?? '',
      comida_pref: respuestas.comida_pref ?? '',
      presupuesto: presupuestoToCategoria(ars),
      temporada: respuestas.temporada ?? 'flexible',
      presupuesto_ars: String(ars),
    });
    navigate(`/aventura/resultado?${params}`);
  };

  const handleSorprendeme = () => {
    const temps: TemporadaId[] = ['invierno', 'primavera', 'verano', 'otono', 'flexible'];
    const rndArs = [120_000, 350_000, 800_000, 1_800_000, 3_500_000][Math.floor(Math.random() * 5)];
    const r = {
      origen_pais: randomOpcionId('origen_pais'),
      edad_viajero: randomOpcionId('edad_viajero'),
      compania: randomOpcionId('compania'),
      experiencia: randomOpcionId('experiencia'),
      comida_pref: randomOpcionId('comida_pref'),
      presupuesto: presupuestoToCategoria(rndArs),
      temporada: temps[Math.floor(Math.random() * temps.length)],
      presupuesto_ars: String(rndArs),
    };
    navigate(`/aventura/resultado?${new URLSearchParams(r)}`);
  };

  const sliderPct = Math.round(
    ((presupuesto - PRESUPUESTO_MIN) / (PRESUPUESTO_MAX - PRESUPUESTO_MIN)) * 100,
  );

  const defaultHeroSrc = isDark
    ? heroDarkFallback
      ? HERO_BG_DARK_FALLBACK
      : HERO_BG_DARK
    : heroLightFallback
      ? HERO_BG_LIGHT_FALLBACK
      : HERO_BG_LIGHT;

  const tryHubHero =
    !isColdHub && Boolean(hubState.lastHeroImageUrl) && !hubHeroImgFailed;
  const heroSrc = tryHubHero ? hubState.lastHeroImageUrl! : defaultHeroSrc;

  const heroImgKey = `${isDark ? 'd' : 'l'}-${tryHubHero ? 'hub' : isDark ? (heroDarkFallback ? 'fb' : '1') : heroLightFallback ? 'fb' : '1'}`;

  const homeTopBarHidden = isColdHub && !chromeVisible;

  return (
    <IonPage>
      <IonContent ref={homeContentRef} fullscreen className="pd-home-v2" {...ionScrollProps}>

        {/* Menú a la derecha; centro: volver al hero (solo vista hub) */}
        <div
          className={`pd-home-top-actions${homeTopBarHidden ? ' pd-floating-chrome--hidden' : ''}`}
          slot="fixed"
        >
          <div className="pd-home-top-left" aria-hidden="true" />
          <div className="pd-home-top-center">
            {!isColdHub && showScrollToHero && (
              <button
                type="button"
                className="pd-destino-floating-btn pd-destino-floating-btn--icon-only"
                onClick={scrollToHomeHero}
                aria-label="Volver al inicio (aventura y acciones)"
              >
                <IonIcon icon={chevronUpOutline} />
              </button>
            )}
          </div>
          <div className="pd-home-top-end">
            <PdUserMenu />
          </div>
        </div>

        <HomeHeroHub
          variant={isColdHub ? 'cold' : 'hub'}
          isDark={isDark}
          heroSrc={heroSrc}
          imgKey={heroImgKey}
          onImgError={() => {
            if (tryHubHero) setHubHeroImgFailed(true);
            else if (isDark && !heroDarkFallback) setHeroDarkFallback(true);
            else if (!isDark && !heroLightFallback) setHeroLightFallback(true);
          }}
          greetingFirstName={hubState.greetingFirstName}
          hasActiveAventura={hubState.hasActiveAventura}
          onColdCta={() => aventuraRef.current?.scrollIntoView({ behavior: 'smooth' })}
          onHubPrimaryCta={() => {
            if (hubState.hasActiveAventura) navigate('/aventura');
            else {
              clearAventuraProgress();
              navigate('/aventura');
            }
          }}
          showMisDestinos={!isColdHub && hubState.recentDestinos.length > 0}
          onMisDestinos={() => {
            document.getElementById('mis-destinos')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }}
          onPreparaTuViaje={!isColdHub ? scrollToPreparaTuViaje : undefined}
        />

        {!isColdHub && (
          <div className="pd-home-hub-below">
            {hubState.aventuraProgress ? (
              <HomeActiveAdventureCard
                progress={hubState.aventuraProgress}
                totalPasos={hubState.aventuraTotalPasos}
              />
            ) : null}
            <HomeDestinationRail
              sectionId="mis-destinos"
              title="Tus destinos"
              destinos={hubState.recentDestinos}
              verTodosTo={
                hubState.recentDestinos[0]
                  ? `/destino/${hubState.recentDestinos[0].slug}`
                  : undefined
              }
              emptyHint="Cuando abras una guía de destino, aparecerá acá."
            />
            <HomeDestinationRail title="Recomendados para vos" destinos={hubState.recommendedDestinos} />
            <HomeExploreCategories />
            <HomeAlertsList />
            <HomeBottomCta resetAventura />
          </div>
        )}

        {/* ── Elige tu aventura (solo estado frío) ── */}
        {isColdHub && (
        <section
          className="pd-aventura-v2"
          id="aventura"
          ref={aventuraRef as unknown as React.RefObject<HTMLDivElement>}
        >
          {/* Dynamic background image layer */}
          {sectionBg && (
            <div
              className="pd-aventura-bg"
              style={{ backgroundImage: `url(${sectionBg})`, opacity: sectionBgOpacity }}
              aria-hidden="true"
            />
          )}
          {sectionBg && (
            <div
              className={`pd-aventura-bg-overlay pd-aventura-bg-overlay--${isDark ? 'dark' : 'light'}`}
              style={{ opacity: sectionBgOpacity }}
              aria-hidden="true"
            />
          )}

          <div className="pd-content pd-aventura-inner" style={{ position: 'relative', zIndex: 2 }}>
            <h2 className={`pd-section-title${sectionBg ? ' pd-section-title--over-bg' : ''}`}>
              Elige tu aventura
            </h2>

            <div className="pd-aventura-cols">
              {/* Left: question flow */}
              <div className="pd-aventura-flow">
                <div className="pd-flow-card">

                  {/* Progress bar */}
                  <div className="pd-flow-progress">
                    <div className="pd-flow-dots">
                      {Array.from({ length: totalPasos }).map((_, i) => (
                        <span
                          key={i}
                          className={`pd-flow-dot${
                            completado || i < paso ? ' pd-flow-dot--done' :
                            i === paso ? ' pd-flow-dot--active' : ''
                          }`}
                        />
                      ))}
                    </div>
                    <span className="pd-flow-step-label">
                      {completado ? 'Completado' : `Paso ${paso + 1} de ${totalPasos}`}
                    </span>
                  </div>

                  {/* Step content */}
                  <div className="pd-step-content" key={stepKey}>

                    {/* Paso 1: país de residencia */}
                    {paso === 0 && !completado && preguntaPorId('origen_pais') && (
                      <>
                        {origenMundoPickerOpen ? (
                          <OrigenPaisMundoPicker
                            onCancel={() => setOrigenMundoPickerOpen(false)}
                            onPick={aplicarOrigenMundoEnHome}
                          />
                        ) : (
                          <>
                            <div className="pd-step-header">
                              <span className="pd-step-emoji">🌎</span>
                              <div>
                                <h3 className="pd-step-title">{preguntaPorId('origen_pais')!.label}</h3>
                                <p className="pd-step-sub">
                                  Asumimos que vivís ahí para tips de documentación y equipaje. En &quot;Otro
                                  país&quot; podés buscar en el mundo entero.
                                </p>
                              </div>
                            </div>
                            <div className="pd-origen-pais-grid" role="list">
                              {preguntaPorId('origen_pais')!.opciones.map((op) => (
                                <button
                                  key={op.id}
                                  type="button"
                                  role="listitem"
                                  className={`pd-origen-pais-btn${respuestas.origen_pais === op.id ? ' pd-origen-pais-btn--selected' : ''}`}
                                  onClick={() => goNext('origen_pais', op.id)}
                                >
                                  <OrigenPaisFlagMedia opcionId={op.id} />
                                  <span className="pd-origen-pais-sep" aria-hidden>
                                    —
                                  </span>
                                  <span className="pd-origen-pais-nombre">{op.label}</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* Paso 2: edad */}
                    {paso === 1 && !completado && preguntaPorId('edad_viajero') && (
                      <>
                        <div className="pd-step-header">
                          <span className="pd-step-emoji">🎂</span>
                          <div>
                            <h3 className="pd-step-title">{preguntaPorId('edad_viajero')!.label}</h3>
                          </div>
                        </div>
                        <div className="aventura-grid">
                          {preguntaPorId('edad_viajero')!.opciones.map((op) => (
                            <button
                              key={op.id}
                              type="button"
                              className={`aventura-cuadrante${respuestas.edad_viajero === op.id ? ' aventura-cuadrante--selected' : ''}`}
                              data-has-image={op.imageUrl ? 'true' : undefined}
                              style={{
                                backgroundImage: op.imageUrl
                                  ? `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url(${op.imageUrl})`
                                  : undefined,
                                backgroundColor: op.imageUrl ? undefined : 'var(--pd-color-primary-soft)',
                              }}
                              onClick={() => goNext('edad_viajero', op.id, op.imageUrl)}
                            >
                              <span className="aventura-cuadrante-label">{op.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Paso 3: compañía */}
                    {paso === 2 && !completado && preguntaPorId('compania') && (
                      <>
                        <div className="pd-step-header">
                          <span className="pd-step-emoji">👥</span>
                          <div>
                            <h3 className="pd-step-title">{preguntaPorId('compania')!.label}</h3>
                          </div>
                        </div>
                        <div className="aventura-grid">
                          {preguntaPorId('compania')!.opciones.map((op) => (
                            <button
                              key={op.id}
                              type="button"
                              className={`aventura-cuadrante${respuestas.compania === op.id ? ' aventura-cuadrante--selected' : ''}`}
                              data-has-image={op.imageUrl ? 'true' : undefined}
                              style={{
                                backgroundImage: op.imageUrl
                                  ? `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url(${op.imageUrl})`
                                  : undefined,
                                backgroundColor: op.imageUrl ? undefined : 'var(--pd-color-primary-soft)',
                              }}
                              onClick={() => goNext('compania', op.id, op.imageUrl)}
                            >
                              <span className="aventura-cuadrante-label">{op.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Paso 4: tipo de experiencia */}
                    {paso === 3 && !completado && preguntaPorId('experiencia') && (
                      <>
                        <div className="pd-step-header">
                          <span className="pd-step-emoji">✨</span>
                          <div>
                            <h3 className="pd-step-title">{preguntaPorId('experiencia')!.label}</h3>
                          </div>
                        </div>
                        <div className="aventura-grid">
                          {preguntaPorId('experiencia')!.opciones.map((op) => (
                            <button
                              key={op.id}
                              type="button"
                              className={`aventura-cuadrante${respuestas.experiencia === op.id ? ' aventura-cuadrante--selected' : ''}`}
                              data-has-image={op.imageUrl ? 'true' : undefined}
                              style={{
                                backgroundImage: op.imageUrl
                                  ? `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url(${op.imageUrl})`
                                  : undefined,
                                backgroundColor: op.imageUrl ? undefined : 'var(--pd-color-primary-soft)',
                              }}
                              onClick={() => goNext('experiencia', op.id, op.imageUrl)}
                            >
                              <span className="aventura-cuadrante-label">{op.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Paso 5: comida */}
                    {paso === 4 && !completado && preguntaPorId('comida_pref') && (
                      <>
                        <div className="pd-step-header">
                          <span className="pd-step-emoji">🍽️</span>
                          <div>
                            <h3 className="pd-step-title">{preguntaPorId('comida_pref')!.label}</h3>
                          </div>
                        </div>
                        <div className="aventura-grid">
                          {preguntaPorId('comida_pref')!.opciones.map((op) => (
                            <button
                              key={op.id}
                              type="button"
                              className={`aventura-cuadrante${respuestas.comida_pref === op.id ? ' aventura-cuadrante--selected' : ''}`}
                              data-has-image={op.imageUrl ? 'true' : undefined}
                              style={{
                                backgroundImage: op.imageUrl
                                  ? `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url(${op.imageUrl})`
                                  : undefined,
                                backgroundColor: op.imageUrl ? undefined : 'var(--pd-color-primary-soft)',
                              }}
                              onClick={() => goNext('comida_pref', op.id, op.imageUrl)}
                            >
                              <span className="aventura-cuadrante-label">{op.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Paso 6: presupuesto (slider) */}
                    {paso === 5 && !completado && (
                      <>
                        <div className="pd-step-header">
                          <span className="pd-step-emoji">💰</span>
                          <div>
                            <h3 className="pd-step-title">Presupuesto del viaje</h3>
                            <p className="pd-step-sub">¿Cuánto pensás gastar en total (aprox.)?</p>
                          </div>
                        </div>
                        <div className="pd-slider-display">
                          <span className="pd-slider-ars">
                            {fmtARS(presupuesto)}<small> ARS</small>
                          </span>
                          <span className="pd-slider-usd">{fmtUSD(presupuesto)}</span>
                        </div>
                        <input
                          type="range"
                          className="pd-range-input"
                          min={PRESUPUESTO_MIN}
                          max={PRESUPUESTO_MAX}
                          step={10_000}
                          value={presupuesto}
                          aria-label="Presupuesto en ARS"
                          style={{
                            background: `linear-gradient(to right, var(--pd-color-primary) ${sliderPct}%, var(--pd-border) ${sliderPct}%)`,
                          }}
                          onChange={(e) => setPresupuesto(Number(e.target.value))}
                        />
                        <div className="pd-slider-labels">
                          <span>Económico</span>
                          <span>Sin límite</span>
                        </div>
                        <button
                          type="button"
                          className="pd-continuar-btn"
                          onClick={() => {
                            setStepKey((k) => k + 1);
                            setPaso(6);
                          }}
                        >
                          Continuar →
                        </button>
                      </>
                    )}

                    {/* Paso 7: época del año */}
                    {paso === 6 && !completado && (
                      <>
                        <div className="pd-step-header">
                          <span className="pd-step-emoji">📅</span>
                          <div>
                            <h3 className="pd-step-title">Época del año</h3>
                            <p className="pd-step-sub">¿Cuándo pensás viajar? (hemisferio sur)</p>
                          </div>
                        </div>
                        <div className="pd-chips">
                          {TEMPORADAS.map((op) => (
                            <button
                              key={op.id}
                              type="button"
                              className={`pd-chip${respuestas.temporada === op.id ? ' pd-chip--selected' : ''}`}
                              onClick={() => {
                                setRespuestas((prev) => ({ ...prev, temporada: op.id }));
                                changeSectionBg(TEMP_BG[op.id] ?? '');
                                setCompletado(true);
                              }}
                            >
                              <span className="pd-chip-label">{op.label}</span>
                              <span className="pd-chip-sub">{op.sub}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Completed */}
                    {completado && (
                      <div className="pd-completado">
                        <p className="pd-completado-text">
                          ¡Listo! Ya tenemos tu recomendación.
                        </p>
                        <div className="pd-completado-actions">
                          <button className="pd-resultado-btn" onClick={handleVerResultado}>
                            Ver resultado completo →
                          </button>
                          <button className="pd-sorprendeme-btn" onClick={handleSorprendeme}>
                            🎲 Sorpréndeme
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Back button */}
                  {paso > 0 && !completado && (
                    <button className="pd-back-btn" onClick={goBack}>
                      ← Volver
                    </button>
                  )}
                  {completado && (
                    <button
                      type="button"
                      className="pd-back-btn"
                      onClick={() => {
                        setPaso(6);
                        setCompletado(false);
                        setStepKey((k) => k + 1);
                      }}
                    >
                      ← Cambiar respuestas
                    </button>
                  )}
                </div>
              </div>

              {/* Right: real-time destination preview */}
              <div className="pd-aventura-preview-panel">
                {mejorDestino ? (
                  <div className="pd-preview-card" key={mejorDestino.id}>
                    <div
                      className="pd-preview-img"
                      style={{ backgroundImage: `url(${mejorDestino.imageUrl ?? ''})` }}
                    >
                      <div className="pd-preview-img-overlay" />
                    </div>
                    <div className="pd-preview-body">
                      <h3 className="pd-preview-nombre">{mejorDestino.nombre}</h3>
                      <p className="pd-preview-desc">{mejorDestino.descripcionCorta}</p>
                      {paso >= 5 && (
                        <div className="pd-preview-budget">
                          <span className="pd-preview-budget-label">Presupuesto aprox:</span>
                          <span className="pd-preview-budget-value">{fmtARS(presupuesto)} ARS</span>
                        </div>
                      )}
                      <Link
                        to={`/destino/${mejorDestino.slug}`}
                        className="pd-preview-cta"
                      >
                        Ver guía completa
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="pd-preview-placeholder">
                    <div className="pd-preview-placeholder-icon">🗺️</div>
                    <p>Elegí tus preferencias para ver un destino recomendado en tiempo real</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* ── Prepará tu viaje (ancla: scroll 100dvh) ── */}
        <section
          id="prepara-tu-viaje"
          className="pd-prep-v2"
          role="region"
          aria-label="Prepará tu viaje"
        >
          <div className="pd-content pd-prep-v2-content">
            <h2 className="pd-section-title">Prepará tu viaje</h2>
            <div className="pd-prep-grid-v2">
              {PREP_CARDS.map((card) => (
                <Link key={card.to} to={card.to} className="pd-prep-card-v2">
                  <span className="pd-prep-icon">{card.icon}</span>
                  <span className="pd-prep-card-label">{card.label}</span>
                  <span className="pd-prep-card-desc">{card.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="pd-footer-v2">
          <div className="pd-content">
            <div className="pd-footer-links">
              <Link to="/guias">Preguntas frecuentes</Link>
              <span>·</span>
              <a href="mailto:contacto@paradonde.com.ar">Contacto</a>
              <span>·</span>
              <Link to="/guias">Política de privacidad</Link>
              <span>·</span>
              <Link to="/guias">Términos y condiciones</Link>
            </div>
          </div>
        </footer>

      </IonContent>
    </IonPage>
  );
}
