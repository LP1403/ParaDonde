import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonCard, IonCardContent } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { arrowBack, locationOutline } from 'ionicons/icons';
import { getDestinoBySlug } from '../data/destinos';
import { DestinoCarousel } from './ResultadoAventura';

export default function Destino() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const destino = slug ? getDestinoBySlug(slug) : undefined;

  useEffect(() => {
    if (destino) document.title = `${destino.nombre} – Guía y reseñas – Para Dónde?`;
  }, [destino]);

  if (!destino) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Destino</IonTitle>
          </IonToolbar>
        </IonHeader>
<IonContent className="ion-padding">
          <div className="pd-content">
            <p>No encontramos ese destino.</p>
            <Link to="/">Volver al inicio</Link>
          </div>
        </IonContent>
        </IonPage>
      );
    }

  const ta = destino.reseñasExternas.tripadvisor;
  const book = destino.reseñasExternas.booking;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => (window.history.length > 2 ? navigate(-1) : navigate('/'))} aria-label="Volver">
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{destino.nombre}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="pd-content">
        <div style={{ marginBottom: '1rem', borderRadius: 'var(--pd-radius-lg)', overflow: 'hidden' }}>
          <DestinoCarousel destino={destino} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h1 style={{ color: 'var(--pd-color-text)', margin: 0 }}>
            {destino.nombre}
          </h1>
          <IonButton
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destino.nombre + ', Argentina')}`}
            target="_blank"
            rel="noopener noreferrer"
            fill="clear"
            size="small"
            aria-label={`Ver mapa de ${destino.nombre}`}
          >
            <IonIcon icon={locationOutline} slot="start" />
            Ver mapa
          </IonButton>
        </div>
        <p style={{ color: 'var(--pd-color-text-muted)', marginBottom: '1.5rem' }}>
          {destino.descripcionCorta}
        </p>

        {(ta || book) && (
          <IonCard style={{ marginBottom: '1rem' }}>
            <IonCardContent>
              <strong style={{ color: 'var(--pd-color-text)' }}>Reseñas</strong>
              {ta && (
                <p style={{ marginTop: '0.5rem', color: 'var(--pd-color-text)' }}>
                  En TripAdvisor: {ta.puntaje}/5 ({ta.cantidad.toLocaleString()} opiniones).{' '}
                  <a href={ta.url} target="_blank" rel="noopener noreferrer">
                    Ver más reseñas
                  </a>
                </p>
              )}
              {book && (
                <p style={{ marginTop: '0.25rem', color: 'var(--pd-color-text)' }}>
                  En Booking: {book.puntaje}/5 ({book.cantidad.toLocaleString()} opiniones).{' '}
                  <a href={book.url} target="_blank" rel="noopener noreferrer">
                    Ver alojamientos
                  </a>
                </p>
              )}
            </IonCardContent>
          </IonCard>
        )}

          <IonCard>
          <IonCardContent>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--pd-color-text)' }}>Qué ver</h3>
            <p style={{ color: 'var(--pd-color-text)' }}>{destino.guia.queVer}</p>
            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--pd-color-text)' }}>Cuándo ir</h3>
            <p style={{ color: 'var(--pd-color-text)' }}>{destino.guia.cuandoIr}</p>
            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--pd-color-text)' }}>Cuántos días</h3>
            <p style={{ color: 'var(--pd-color-text)' }}>{destino.guia.cuantosDias}</p>
            {destino.guia.requisitos && (
              <>
                <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--pd-color-text)' }}>Requisitos</h3>
                <p style={{ color: 'var(--pd-color-text)' }}>{destino.guia.requisitos}</p>
              </>
            )}
            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--pd-color-text)' }}>Tips</h3>
            <p style={{ color: 'var(--pd-color-text)' }}>{destino.guia.tips}</p>
          </IonCardContent>
        </IonCard>

        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer">
            Ver alojamientos en Booking
          </a>{' '}
          (enlace de afiliado).
        </p>
        <Link to="/guias/que-llevar">
          <span style={{ color: 'var(--pd-color-primary)' }}>Armar mi checklist para este viaje</span>
        </Link>
        </div>
      </IonContent>
    </IonPage>
  );
}
