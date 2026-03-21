import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Link, useNavigate } from 'react-router-dom';
import { destinos } from '../data/destinos';
import { filtrarDestinosPorRespuestas } from '../logic/motorAventura';

/* ---------- Constants ---------- */

const HERO_BG_DARK =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80';
const HERO_BG_LIGHT =
  'https://images.unsplash.com/photo-1516302350523-4c918cc75af8?auto=format&fit=crop&w=1920&q=80';

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

const DIAS = [
  { id: 'fin_semana',  label: 'Fin de semana',     sub: '2 – 3 días' },
  { id: 'una_semana',  label: 'Una semana',         sub: '5 – 7 días' },
  { id: 'dos_o_mas',   label: 'Dos semanas o más',  sub: '14+ días' },
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

const DIAS_BG: Record<string, string> = {
  fin_semana: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80',
  una_semana: 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1920&q=80',
  dos_o_mas:  'https://images.unsplash.com/photo-1519817650390-64a93db511aa?auto=format&fit=crop&w=1920&q=80',
};

const PREP_CARDS = [
  { icon: '📋', label: 'Documentación',    desc: 'Pasaporte, visa y requisitos',    to: '/guias/documentacion-viajar' },
  { icon: '🧳', label: 'Equipaje',         desc: 'Qué llevar y cómo empacar',       to: '/guias/que-llevar' },
  { icon: '✈️', label: 'Vuelos cancelados', desc: 'Tus derechos y pasos a seguir',   to: '/guias/vuelo-cancelado-demorado' },
  { icon: '💳', label: 'Pagos en exterior', desc: 'Dólar tarjeta y alternativas',    to: '/guias/pagar-exterior' },
];

const PRESUPUESTO_MIN = 50_000;
const PRESUPUESTO_MAX = 1_000_000;
const PRESUPUESTO_DEFAULT = 350_000;
const USD_RATE = 900;

/* ---------- Helpers ---------- */

function presupuestoCategoria(ars: number): string {
  if (ars < 220_000) return 'economico';
  if (ars < 600_000) return 'medio';
  return 'sin_mirar';
}

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

  /* Real-time best destination */
  const mejorDestino = useMemo(() => {
    const r: Record<string, string> = { ...respuestas };
    if (paso >= 2) r.presupuesto = presupuestoCategoria(presupuesto);
    const list = filtrarDestinosPorRespuestas(destinos, r);
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
    const params: Record<string, string> = {
      ...respuestas,
      presupuesto: presupuestoCategoria(presupuesto),
    };
    navigate(`/aventura/resultado?${new URLSearchParams(params)}`);
  };

  const handleSorprendeme = () => {
    const r = {
      experiencia: TIPO_VIAJE[Math.floor(Math.random() * TIPO_VIAJE.length)].id,
      compania:    COMPANIA[Math.floor(Math.random() * COMPANIA.length)].id,
      dias:        DIAS[Math.floor(Math.random() * DIAS.length)].id,
      presupuesto: ['economico', 'medio', 'sin_mirar'][Math.floor(Math.random() * 3)],
    };
    navigate(`/aventura/resultado?${new URLSearchParams(r)}`);
  };

  const sliderPct = Math.round(
    ((presupuesto - PRESUPUESTO_MIN) / (PRESUPUESTO_MAX - PRESUPUESTO_MIN)) * 100,
  );

  const heroBg = isDark ? HERO_BG_DARK : HERO_BG_LIGHT;

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
          <div
            className="pd-hero-bg-img"
            style={{ backgroundImage: `url(${heroBg})` }}
            role="img"
            aria-label="Paisaje argentino"
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

                    {/* Step 4: días */}
                    {paso === 3 && !completado && (
                      <>
                        <div className="pd-step-header">
                          <span className="pd-step-emoji">📅</span>
                          <div>
                            <h3 className="pd-step-title">Época del año</h3>
                            <p className="pd-step-sub">¿Cuánto tiempo tenés disponible?</p>
                          </div>
                        </div>
                        <div className="pd-chips">
                          {DIAS.map((op) => (
                            <button
                              key={op.id}
                              className={`pd-chip${respuestas.dias === op.id ? ' pd-chip--selected' : ''}`}
                              onClick={() => {
                                setRespuestas((prev) => ({ ...prev, dias: op.id }));
                                changeSectionBg(DIAS_BG[op.id] ?? '');
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
