import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Link, useNavigate } from 'react-router-dom';
import { destinos } from '../data/destinos';
import { recomendarDestinos, type TemporadaId } from '../logic/motorAventura';

/* ---------- Constants ---------- */

/** Montaña / cordillera de noche (tema oscuro) */
const HERO_BG_DARK =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80';
const HERO_BG_DARK_FALLBACK =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80';
const HERO_BG_LIGHT =
  'https://images.unsplash.com/photo-1516302350523-4c918cc75af8?auto=format&fit=crop&w=1920&q=80';
/** Respaldo si el CDN principal falla (red, referrer, etc.) */
const HERO_BG_LIGHT_FALLBACK =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80';

const TIPO_VIAJE = [
  { id: 'montana_naturaleza', label: 'Naturaleza', icon: '🏔️' },
  { id: 'ciudad_cultura',     label: 'Ciudad',     icon: '🏙️' },
  { id: 'playa_relax',        label: 'Relax',      icon: '🧘' },
  { id: 'aventura_deporte',   label: 'Aventura',   icon: '🧗' },
];

const COMPANIA = [
  { id: 'solo',    label: 'Solo/a',          icon: '🧍' },
  { id: 'pareja',  label: 'En pareja',       icon: '💑' },
  { id: 'amigos',  label: 'Con amigos',      icon: '👫' },
  { id: 'familia', label: 'Con familia',     icon: '👨‍👩‍👧' },
];

const TEMPORADAS: { id: TemporadaId; label: string; sub: string }[] = [
  { id: 'verano',    label: 'Verano',     sub: 'Dic – mar (hem. sur)' },
  { id: 'otono',     label: 'Otoño',      sub: 'Mar – jun' },
  { id: 'invierno',  label: 'Invierno',   sub: 'Jun – sep' },
  { id: 'primavera', label: 'Primavera',  sub: 'Sep – dic' },
  { id: 'flexible',  label: 'Me da igual', sub: 'Cualquier época' },
];

/* Images triggered by each selector option */
const TIPO_BG: Record<string, string> = {
  montana_naturaleza:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80',
  ciudad_cultura:
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1920&q=80',
  playa_relax:
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1920&q=80',
  aventura_deporte:
    'https://images.unsplash.com/photo-1500043201641-4f4e6da1cd8e?auto=format&fit=crop&w=1920&q=80',
};

const COMPANIA_BG: Record<string, string> = {
  solo:    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
  pareja:  'https://images.unsplash.com/photo-1517840933442-d2d1a05edb84?auto=format&fit=crop&w=1920&q=80',
  amigos:  'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=1920&q=80',
  familia: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1920&q=80',
};

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

/* ---------- Component ---------- */

export default function Home() {
  const navigate = useNavigate();

  /* Dark mode: dark by default, persisted */
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('pd-theme') !== 'light';
  });

  /* Adventure flow */
  const [paso, setPaso] = useState(0);
  const [stepKey, setStepKey] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [presupuesto, setPresupuesto] = useState(PRESUPUESTO_DEFAULT);
  const [completado, setCompletado] = useState(false);
  const [heroLightFallback, setHeroLightFallback] = useState(false);

  const aventuraRef = useRef<HTMLElement>(null);
  const bgTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalPasos = 4;

  /* Section background: crossfade on option pick */
  const [sectionBg, setSectionBg]       = useState('');
  const [sectionBgOpacity, setBgOpacity] = useState(0);

  const changeSectionBg = useCallback((url: string) => {
    if (!url) return;
    if (bgTimerRef.current) clearTimeout(bgTimerRef.current);
    setBgOpacity(0);
    bgTimerRef.current = setTimeout(() => {
      setSectionBg(url);
      setBgOpacity(1);
    }, 220);
  }, []);

  /* Apply theme class to <html> */
  useEffect(() => {
    document.title = 'Para Dónde? – Guía de viajes';
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('pd-light');
      localStorage.setItem('pd-theme', 'dark');
    } else {
      root.classList.add('pd-light');
      localStorage.setItem('pd-theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    setHeroLightFallback(false);
  }, [isDark]);

  /* Vista previa: mismo motor que el resultado, con defaults hasta completar pasos */
  const mejorDestino = useMemo(() => {
    if (!respuestas.experiencia) return null;
    const list = recomendarDestinos(
      destinos,
      {
        experienciaId: respuestas.experiencia,
        compania: respuestas.compania ?? '',
        presupuestoARS: paso >= 2 ? presupuesto : 400_000,
        temporada: (respuestas.temporada as TemporadaId) || 'flexible',
      },
      { max: 1 },
    );
    return list[0] ?? null;
  }, [respuestas, presupuesto, paso]);

  /* When completed & a destination is known, show its image in the bg */
  useEffect(() => {
    if (completado && mejorDestino?.imageUrl) {
      changeSectionBg(mejorDestino.imageUrl);
    }
  }, [completado, mejorDestino, changeSectionBg]);

  /* Navigate forward (auto-advance) */
  const goNext = (key: string, value: string) => {
    const next = { ...respuestas, [key]: value };
    setRespuestas(next);

    // Update section background based on what was picked
    if (key === 'experiencia') changeSectionBg(TIPO_BG[value] ?? '');
    if (key === 'compania')    changeSectionBg(COMPANIA_BG[value] ?? '');

    if (paso < totalPasos - 1) {
      setStepKey((k) => k + 1);
      setPaso((p) => p + 1);
    } else {
      setCompletado(true);
    }
  };

  const goBack = () => {
    if (paso > 0) {
      setStepKey((k) => k + 1);
      setPaso((p) => p - 1);
      setCompletado(false);
    }
  };

  const handleVerResultado = () => {
    const params = new URLSearchParams({
      experiencia: respuestas.experiencia ?? '',
      compania: respuestas.compania ?? '',
      temporada: respuestas.temporada ?? 'flexible',
      presupuesto_ars: String(Math.min(Math.max(presupuesto, PRESUPUESTO_MIN), PRESUPUESTO_MAX)),
    });
    navigate(`/aventura/resultado?${params}`);
  };

  const handleSorprendeme = () => {
    const temps: TemporadaId[] = ['invierno', 'primavera', 'verano', 'otono', 'flexible'];
    const rndArs = [120_000, 350_000, 800_000, 1_800_000, 3_500_000][Math.floor(Math.random() * 5)];
    const r = {
      experiencia: TIPO_VIAJE[Math.floor(Math.random() * TIPO_VIAJE.length)].id,
      compania: COMPANIA[Math.floor(Math.random() * COMPANIA.length)].id,
      temporada: temps[Math.floor(Math.random() * temps.length)],
      presupuesto_ars: String(rndArs),
    };
    navigate(`/aventura/resultado?${new URLSearchParams(r)}`);
  };

  const sliderPct = Math.round(
    ((presupuesto - PRESUPUESTO_MIN) / (PRESUPUESTO_MAX - PRESUPUESTO_MIN)) * 100,
  );

  const heroSrc = isDark
    ? HERO_BG_DARK
    : heroLightFallback
      ? HERO_BG_LIGHT_FALLBACK
      : HERO_BG_LIGHT;

  return (
    <IonPage>
      <IonContent fullscreen className="pd-home-v2">

        {/* ── Dark/light toggle (fixed) ── */}
        <div className="pd-toggle-wrapper" slot="fixed">
          <button
            className="pd-toggle-btn"
            onClick={() => setIsDark((v) => !v)}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <span className="pd-toggle-icon">{isDark ? '🌙' : '☀️'}</span>
            <span className={`pd-toggle-track${isDark ? ' pd-toggle-track--dark' : ''}`}>
              <span className="pd-toggle-thumb" />
            </span>
            <span className="pd-toggle-icon">{isDark ? '☀️' : '🌙'}</span>
          </button>
        </div>

        {/* ── Hero ── */}
        <section className="pd-hero-v2" aria-labelledby="home-hero-title">
          <img
            key={`${isDark ? 'd' : 'l'}-${heroLightFallback ? 'fb' : '1'}`}
            className="pd-hero-bg-img"
            src={heroSrc}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => {
              if (!isDark && !heroLightFallback) setHeroLightFallback(true);
            }}
          />
          <div className={`pd-hero-overlay pd-hero-overlay--${isDark ? 'dark' : 'light'}`} />
          <div className="pd-hero-body">
            <h1 id="home-hero-title" className="pd-hero-title">
              ¿Para dónde?
            </h1>
            <p className="pd-hero-subtitle">
              Descubrí tu próximo viaje en menos de <strong>60 segundos</strong>
            </p>
            <button
              className="pd-hero-cta"
              onClick={() => aventuraRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              ✨ Empezar mi aventura
            </button>
          </div>
          <button
            className="pd-scroll-indicator"
            onClick={() => aventuraRef.current?.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Ir a la sección de aventura"
          >
            ↓
          </button>
        </section>

        {/* ── Elige tu aventura ── */}
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
                            i < paso ? ' pd-flow-dot--done' :
                            i === paso && !completado ? ' pd-flow-dot--active' : ''
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

                    {/* Step 1: tipo de viaje */}
                    {paso === 0 && !completado && (
                      <>
                        <div className="pd-step-header">
                          <span className="pd-step-emoji">🗺️</span>
                          <div>
                            <h3 className="pd-step-title">¿Qué tipo de viaje buscás?</h3>
                          </div>
                        </div>
                        <div className="pd-tipo-grid">
                          {TIPO_VIAJE.map((op) => (
                            <button
                              key={op.id}
                              className={`pd-tipo-btn${respuestas.experiencia === op.id ? ' pd-tipo-btn--selected' : ''}`}
                              onClick={() => goNext('experiencia', op.id)}
                            >
                              <span className="pd-tipo-icon">{op.icon}</span>
                              <span>{op.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Step 2: compañía */}
                    {paso === 1 && !completado && (
                      <>
                        <div className="pd-step-header">
                          <span className="pd-step-emoji">👥</span>
                          <div>
                            <h3 className="pd-step-title">¿Con quién viajás?</h3>
                          </div>
                        </div>
                        <div className="pd-pills">
                          {COMPANIA.map((op) => (
                            <button
                              key={op.id}
                              className={`pd-pill${respuestas.compania === op.id ? ' pd-pill--selected' : ''}`}
                              onClick={() => goNext('compania', op.id)}
                            >
                              <span>{op.icon}</span>
                              <span>{op.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Step 3: presupuesto (slider) */}
                    {paso === 2 && !completado && (
                      <>
                        <div className="pd-step-header">
                          <span className="pd-step-emoji">💰</span>
                          <div>
                            <h3 className="pd-step-title">Presupuesto</h3>
                            <p className="pd-step-sub">¿Cuál es tu presupuesto para el viaje?</p>
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
                          className="pd-continuar-btn"
                          onClick={() => {
                            setStepKey((k) => k + 1);
                            setPaso(3);
                          }}
                        >
                          Continuar →
                        </button>
                      </>
                    )}

                    {/* Step 4: época del año */}
                    {paso === 3 && !completado && (
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
                      className="pd-back-btn"
                      onClick={() => {
                        setPaso(3);
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
                      {paso >= 2 && (
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

        {/* ── Prepará tu viaje ── */}
        <section className="pd-prep-v2">
          <div className="pd-content">
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
