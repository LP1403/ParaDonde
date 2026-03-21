import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonButtons,
} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import {
  arrowBack, locationOutline, flagOutline,
  chevronBackOutline, chevronForwardOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { destinos } from '../data/destinos';
import { filtrarDestinosPorRespuestas } from '../logic/motorAventura';
import type { Destino } from '../data/destinos';

/* ─────────────────────────────────────────── Carousel ── */

export function DestinoCarousel({ destino }: { destino: Destino }) {
  const images = (destino.imageUrls && destino.imageUrls.length > 0)
    ? destino.imageUrls
    : destino.imageUrl
      ? [destino.imageUrl]
      : [];
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;
  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  return (
    <div className="pd-destino-carousel">
      <div
        className="pd-destino-carousel-track"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.45)), url(${images[index]})`,
        }}
      />
      {images.length > 1 && (
        <>
          <button type="button" className="pd-destino-carousel-btn pd-destino-carousel-btn--prev" onClick={prev} aria-label="Foto anterior">
            <IonIcon icon={chevronBackOutline} />
          </button>
          <button type="button" className="pd-destino-carousel-btn pd-destino-carousel-btn--next" onClick={next} aria-label="Foto siguiente">
            <IonIcon icon={chevronForwardOutline} />
          </button>
          <div className="pd-destino-carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`pd-destino-carousel-dot ${i === index ? 'pd-destino-carousel-dot--active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Ir a foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────── Seguro Block ── */

const SEGUROS = [
  {
    nombre: 'Assist Card',
    logo: '🛡️',
    desc: 'Cobertura médica integral',
    url: 'https://www.assistcard.com/ar?utm_source=paradonde',
  },
  {
    nombre: 'Universal',
    logo: '🌐',
    desc: 'Asistencia global 24h',
    url: 'https://www.universal-assistance.com/?utm_source=paradonde',
  },
  {
    nombre: 'AXA',
    logo: '🔵',
    desc: 'Seguro internacional',
    url: 'https://www.axaassistance.com.ar/?utm_source=paradonde',
  },
];

export function SeguroBlock({ forDestino }: { forDestino?: Destino }) {
  const showSeguro = !forDestino || forDestino.documentacion.seguroRecomendado || (forDestino.region !== 'argentina');
  if (!showSeguro) return null;

  return (
    <div className="pd-seguro-block">
      <div className="pd-seguro-header">
        <IonIcon icon={shieldCheckmarkOutline} className="pd-seguro-icon" />
        <div>
          <p className="pd-seguro-title">Protegé tu viaje ante imprevistos</p>
          <p className="pd-seguro-sub">Un seguro de viaje te cubre si algo sale mal.</p>
        </div>
      </div>
      <div className="pd-seguro-benefits">
        {['Cobertura médica de emergencia', 'Cancelaciones e interrupciones', 'Pérdida de equipaje'].map((b) => (
          <span key={b} className="pd-seguro-benefit">
            <span className="pd-seguro-benefit-dot">✓</span> {b}
          </span>
        ))}
      </div>
      <div className="pd-seguro-ctas">
        {SEGUROS.map((s) => (
          <a
            key={s.nombre}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pd-seguro-company"
            aria-label={`Cotizar con ${s.nombre}`}
          >
            <span className="pd-seguro-company-logo">{s.logo}</span>
            <span className="pd-seguro-company-name">{s.nombre}</span>
            <span className="pd-seguro-company-desc">{s.desc}</span>
          </a>
        ))}
      </div>
      <a
        href="https://www.assistcard.com/ar?utm_source=paradonde"
        target="_blank"
        rel="noopener noreferrer"
        className="pd-seguro-cta-btn"
      >
        Cotizar seguro de viaje →
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────── ¿Por qué? Block ── */

function generarExplicacion(
  _destino: Destino,
  respuestas: Record<string, string>,
): string {
  const partes: string[] = [];

  const expMap: Record<string, string> = {
    montana_naturaleza: 'naturaleza y montaña',
    ciudad_cultura: 'ciudad y cultura',
    playa_relax: 'playa y relax',
    aventura_deporte: 'aventura y deporte',
    gastronomia_vino: 'gastronomía y vino',
    termas_relax: 'termas y relax',
  };
  if (respuestas.experiencia && expMap[respuestas.experiencia]) {
    partes.push(`buscás ${expMap[respuestas.experiencia]}`);
  }

  const compMap: Record<string, string> = {
    solo: 'viajás solo/a',
    pareja: 'viajás en pareja',
    amigos: 'viajás con amigos',
    familia: 'viajás con familia',
  };
  if (respuestas.compania && compMap[respuestas.compania]) {
    partes.push(compMap[respuestas.compania]);
  }

  const presMap: Record<string, string> = {
    economico: 'tu presupuesto es ajustado',
    medio: 'tu presupuesto es moderado',
    sin_mirar: 'tu presupuesto es amplio',
  };
  if (respuestas.presupuesto && presMap[respuestas.presupuesto]) {
    partes.push(presMap[respuestas.presupuesto]);
  }

  const ars = Number(respuestas.presupuesto_ars);
  if (Number.isFinite(ars) && ars > 0) {
    partes.push(`tu presupuesto estimado es de unos $${ars.toLocaleString('es-AR')} ARS`);
  }

  const tempMap: Record<string, string> = {
    verano: 'querés viajar en verano austral',
    otono: 'querés viajar en otoño',
    invierno: 'querés viajar en invierno austral',
    primavera: 'querés viajar en primavera',
    flexible: 'tenés fechas flexibles',
  };
  if (respuestas.temporada && tempMap[respuestas.temporada]) {
    partes.push(tempMap[respuestas.temporada]);
  }

  const diasMap: Record<string, string> = {
    fin_semana: 'solo tenés un fin de semana',
    una_semana: 'disponés de una semana',
    dos_o_mas: 'tenés dos semanas o más',
  };
  if (respuestas.dias && diasMap[respuestas.dias]) {
    partes.push(diasMap[respuestas.dias]);
  }

  if (partes.length === 0) return '';
  if (partes.length === 1) return `Porque ${partes[0]}.`;
  const last = partes.pop()!;
  return `Porque ${partes.join(', ')} y ${last}.`;
}

function PorQueBlock({ destino, respuestas }: { destino: Destino; respuestas: Record<string, string> }) {
  const explicacion = generarExplicacion(destino, respuestas);
  if (!explicacion) return null;
  return (
    <div className="pd-porque-block">
      <span className="pd-porque-icon">💡</span>
      <div>
        <p className="pd-porque-label">¿Por qué te recomendamos {destino.nombre}?</p>
        <p className="pd-porque-text">{explicacion}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── fmtARS ── */

function fmtARS(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace('.0', '')} M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)} K`;
  return `$${n}`;
}

/* ─────────────────────────────────────────── Page ── */

export default function ResultadoAventura() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const respuestas: Record<string, string> = {};
  searchParams.forEach((v, k) => { respuestas[k] = v; });

  const sugeridos = filtrarDestinosPorRespuestas(destinos, respuestas);

  const diasSeleccionados = respuestas['dias'];
  const temporadaSel = respuestas['temporada'];
  const descripcionDuracion =
    temporadaSel === 'verano'    ? 'un viaje en verano austral' :
    temporadaSel === 'otono'     ? 'un viaje en otoño' :
    temporadaSel === 'invierno'  ? 'un viaje en invierno austral' :
    temporadaSel === 'primavera' ? 'un viaje en primavera' :
    temporadaSel === 'flexible' ? 'un viaje con fechas flexibles' :
    diasSeleccionados === 'fin_semana'   ? 'una escapada corta de fin de semana' :
    diasSeleccionados === 'una_semana'   ? 'un viaje de alrededor de una semana' :
    diasSeleccionados === 'dos_o_mas'    ? 'un viaje más largo, de dos semanas o más' :
    'un viaje según tus preferencias';

  const hayInternacional = sugeridos.some((d) => d.region !== 'argentina');

  useEffect(() => {
    document.title = 'Tu resultado – Para Dónde?';
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => navigate('/')} aria-label="Volver">
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Tu resultado</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="pd-content">

          {/* Intro */}
          <h2 style={{ marginBottom: '0.25rem', color: 'var(--pd-color-text)' }}>
            Destinos sugeridos para vos
          </h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--pd-color-text-muted)', fontSize: '0.9rem' }}>
            Pensando en {descripcionDuracion}, estos destinos encajan con tu forma de viajar.
          </p>

          {sugeridos.length === 0 ? (
            <p style={{ color: 'var(--pd-color-text-muted)' }}>
              No encontramos destinos que coincidan exactamente. Probá cambiar algunas respuestas en{' '}
              <Link to="/">Elige tu aventura</Link>.
            </p>
          ) : (
            sugeridos.map((d, idx) => (
              <IonCard key={d.id}>
                {/* Imagen */}
                <DestinoCarousel destino={d} />

                {/* Cabecera */}
                <IonCardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div>
                      <IonCardTitle style={{ margin: 0 }}>{d.nombre}</IonCardTitle>
                      {d.pais && d.region !== 'argentina' && (
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.78rem', color: 'var(--pd-color-text-muted)' }}>
                          {d.pais}
                          {d.region === 'europa' ? ' · Europa' :
                           d.region === 'norteamerica' ? ' · América del Norte' :
                           d.region === 'sudamerica' ? ' · Sudamérica' :
                           d.region === 'asia' ? ' · Asia' : ''}
                        </p>
                      )}
                    </div>
                    <IonButton
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.nombre + (d.pais ? ', ' + d.pais : ', Argentina'))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      fill="clear"
                      size="small"
                      aria-label={`Ver mapa de ${d.nombre}`}
                    >
                      <IonIcon icon={locationOutline} slot="start" />
                      Ver mapa
                    </IonButton>
                  </div>
                </IonCardHeader>

                <IonCardContent>
                  <p style={{ marginBottom: '0.5rem' }}>{d.descripcionCorta}</p>

                  {/* ¿Por qué te lo recomendamos? */}
                  {idx === 0 && <PorQueBlock destino={d} respuestas={respuestas} />}

                  {/* Presupuesto estimado */}
                  {d.presupuestoEstimado && (
                    <div className="pd-resultado-budget">
                      <span className="pd-resultado-budget-label">Presupuesto estimado</span>
                      <span className="pd-resultado-budget-range">
                        {fmtARS(d.presupuestoEstimado.minARS)} – {fmtARS(d.presupuestoEstimado.maxARS)} ARS
                      </span>
                    </div>
                  )}

                  {/* Mejor época */}
                  <p style={{ fontSize: '0.85rem', color: 'var(--pd-color-text-muted)', marginTop: '0.5rem' }}>
                    <strong>Mejor época:</strong> {d.guia.cuandoIr}
                  </p>

                  {/* Itinerario rápido */}
                  {d.itinerario && (
                    <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Tu viaje, en resumen</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--pd-color-text-muted)', marginBottom: '0.5rem' }}>
                        Distancia aprox.: {d.itinerario.distanciaTotalKm.toLocaleString()} km · {d.itinerario.duracionDias} días
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                          <div style={{ width: '2rem', height: '2rem', borderRadius: '999px', background: 'var(--pd-color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pd-color-primary)', marginBottom: '0.25rem' }}>
                            <IonIcon icon={locationOutline} />
                          </div>
                          <p style={{ fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>Inicio</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '0', gap: '0.5rem' }}>
                          {d.itinerario.paradas.map((p, idx2) => (
                            <div key={idx2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '90px' }}>
                              <div style={{ width: '100%', height: '2px', background: 'var(--pd-border)', marginBottom: '0.25rem' }} />
                              <div style={{ width: '1rem', height: '1rem', borderRadius: '999px', background: 'var(--pd-color-accent-soft)', border: '2px solid var(--pd-color-accent)', marginBottom: '0.25rem' }} />
                              <p style={{ fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>Día {idx2 + 1}</p>
                              <p style={{ fontSize: '0.8rem', textAlign: 'center', margin: 0, marginTop: '0.1rem', color: 'var(--pd-color-text-muted)' }}>{p}</p>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                          <div style={{ width: '2rem', height: '2rem', borderRadius: '0.75rem', border: '2px solid var(--pd-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pd-color-primary)', marginBottom: '0.25rem' }}>
                            <IonIcon icon={flagOutline} />
                          </div>
                          <p style={{ fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>Final</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botones */}
                  <Link to={`/destino/${d.slug}`}>
                    <IonButton expand="block" size="small" style={{ marginTop: '0.75rem' }}>
                      Ver guía completa de {d.nombre}
                    </IonButton>
                  </Link>

                  {d.reseñasExternas?.tripadvisor && (
                    <IonButton
                      expand="block"
                      size="small"
                      fill="outline"
                      style={{ marginTop: '0.5rem' }}
                      href={d.reseñasExternas.tripadvisor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="pd-tripadvisor-btn">
                        <span className="pd-tripadvisor-icon">T</span>
                        <span>Ver en TripAdvisor · {d.reseñasExternas.tripadvisor.puntaje}/5</span>
                      </span>
                    </IonButton>
                  )}
                </IonCardContent>
              </IonCard>
            ))
          )}

          {/* Bloque de seguro – siempre que haya resultados */}
          {sugeridos.length > 0 && <SeguroBlock forDestino={hayInternacional ? sugeridos[0] : undefined} />}

          <Link to="/">
            <IonButton fill="outline" expand="block" style={{ marginTop: '1rem' }}>
              ← Volver a elegir destino
            </IonButton>
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
}
