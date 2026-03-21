import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonButtons } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { arrowBack, locationOutline, flagOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { destinos } from '../data/destinos';
import { filtrarDestinosPorRespuestas } from '../logic/motorAventura';
import type { Destino } from '../data/destinos';

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

export default function ResultadoAventura() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const respuestas: Record<string, string> = {};
  searchParams.forEach((v, k) => {
    respuestas[k] = v;
  });
  const sugeridos = filtrarDestinosPorRespuestas(destinos, respuestas);

  const diasSeleccionados = respuestas['dias'];
  const descripcionDuracion =
    diasSeleccionados === 'fin_semana'
      ? 'una escapada corta de fin de semana'
      : diasSeleccionados === 'una_semana'
      ? 'un viaje de alrededor de una semana'
      : diasSeleccionados === 'dos_o_mas'
      ? 'un viaje más largo, de dos semanas o más'
      : 'un viaje flexible en cantidad de días';

  useEffect(() => {
    document.title = 'Tu resultado – Para Dónde?';
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => navigate('/aventura')} aria-label="Volver">
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Tu resultado</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="pd-content">
        <h2 style={{ marginBottom: '0.25rem', color: 'var(--pd-color-text)' }}>
          Destinos sugeridos para vos
        </h2>
        <p style={{ marginBottom: '1rem', color: 'var(--pd-color-text-muted)', fontSize: '0.9rem' }}>
          Pensando en {descripcionDuracion}, estos destinos encajan con tu forma de viajar. Revisá el clima recomendado y abrí Tripadvisor para ver paquetes, vuelos y hospedajes.
        </p>
        {sugeridos.length === 0 ? (
          <p style={{ color: 'var(--pd-color-text-muted)' }}>
            No encontramos destinos que coincidan exactamente. Probá cambiar algunas respuestas en{' '}
            <Link to="/aventura">Elige tu aventura</Link>.
          </p>
        ) : (
          sugeridos.map((d) => (
            <IonCard key={d.id}>
              <DestinoCarousel destino={d} />
              <IonCardHeader>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <IonCardTitle style={{ margin: 0 }}>{d.nombre}</IonCardTitle>
                  <IonButton
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.nombre + ', Argentina')}`}
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
                <p>{d.descripcionCorta}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--pd-color-text-muted)', marginTop: '0.35rem' }}>
                  <strong>Clima y mejor época:</strong> {d.guia.cuandoIr}
                </p>
                {d.itinerario && (
                  <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                      Tu viaje, en resumen
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--pd-color-text-muted)', marginBottom: '0.5rem' }}>
                      Distancia aprox.: {d.itinerario.distanciaTotalKm} km · {d.itinerario.duracionDias} días
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        overflowX: 'auto',
                        paddingBottom: '0.25rem',
                      }}
                    >
                      {/* Inicio */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                        <div
                          style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '999px',
                            background: 'var(--pd-color-primary-soft)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--pd-color-primary)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          <IonIcon icon={locationOutline} />
                        </div>
                        <p style={{ fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>Inicio</p>
                      </div>
                      {/* Línea + paradas */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flex: 1,
                          minWidth: '0',
                          gap: '0.5rem',
                        }}
                      >
                        {d.itinerario.paradas.map((p, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              flex: 1,
                              minWidth: '90px',
                            }}
                          >
                            <div
                              style={{
                                width: '100%',
                                height: '2px',
                                background: 'var(--pd-border)',
                                marginBottom: '0.25rem',
                              }}
                            />
                            <div
                              style={{
                                width: '1rem',
                                height: '1rem',
                                borderRadius: '999px',
                                background: 'var(--pd-color-accent-soft)',
                                border: '2px solid var(--pd-color-accent)',
                                marginBottom: '0.25rem',
                              }}
                            />
                            <p style={{ fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>
                              Paso {idx + 1}
                            </p>
                            <p
                              style={{
                                fontSize: '0.8rem',
                                textAlign: 'center',
                                margin: 0,
                                marginTop: '0.1rem',
                                color: 'var(--pd-color-text-muted)',
                              }}
                            >
                              {p}
                            </p>
                          </div>
                        ))}
                      </div>
                      {/* Final */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                        <div
                          style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '0.75rem',
                            border: '2px solid var(--pd-color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--pd-color-primary)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          <IonIcon icon={flagOutline} />
                        </div>
                        <p style={{ fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>Final</p>
                      </div>
                    </div>
                  </div>
                )}
                <Link to={`/destino/${d.slug}`}>
                  <IonButton expand="block" size="small" style={{ marginTop: '0.75rem' }}>
                    Ver guía de {d.nombre}
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
                    aria-label="Ver en TripAdvisor"
                  >
                    <span className="pd-tripadvisor-btn">
                      <span className="pd-tripadvisor-icon">T</span>
                      <span>Ver en TripAdvisor</span>
                    </span>
                  </IonButton>
                )}
              </IonCardContent>
            </IonCard>
          ))
        )}
        <Link to="/aventura">
          <IonButton fill="outline" expand="block" style={{ marginTop: '1rem' }}>
            Volver a elegir
          </IonButton>
        </Link>
        </div>
      </IonContent>
    </IonPage>
  );
}
