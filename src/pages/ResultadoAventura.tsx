import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonButtons } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { arrowBack, locationOutline } from 'ionicons/icons';
import { destinos } from '../data/destinos';
import { filtrarDestinosPorRespuestas } from '../logic/motorAventura';

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
              {d.imageUrl && (
                <div
                  style={{
                    width: '100%',
                    paddingTop: '42%',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.5)), url(${d.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              )}
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
                    aria-label={`Ver ${d.nombre} en Google Maps`}
                  >
                    <IonIcon icon={locationOutline} slot="icon-only" />
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
                    <p style={{ fontSize: '0.85rem', color: 'var(--pd-color-text-muted)', marginBottom: '0.25rem' }}>
                      Distancia aprox.: {d.itinerario.distanciaTotalKm} km · {d.itinerario.duracionDias} días
                    </p>
                    <div
                      style={{
                        borderLeft: '2px solid var(--pd-border)',
                        paddingLeft: '0.75rem',
                        marginTop: '0.25rem',
                      }}
                    >
                      <p style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                        <strong>Comienzo:</strong> {d.itinerario.inicio}
                      </p>
                      {d.itinerario.paradas.map((p, idx) => (
                        <p key={idx} style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                          <strong>Paso {idx + 1}:</strong> {p}
                        </p>
                      ))}
                      <p style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>
                        <strong>Final:</strong> {d.itinerario.fin}
                      </p>
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
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        style={{
                          width: '1.2rem',
                          height: '1.2rem',
                          borderRadius: '999px',
                          background: '#34e0a1',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}
                      >
                        T
                      </span>
                      <span>Ir a Tripadvisor</span>
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
