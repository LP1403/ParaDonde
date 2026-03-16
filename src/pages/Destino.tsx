import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonCard, IonCardContent } from '@ionic/react';
import { getDestinoBySlug } from '../data/destinos';

export default function Destino() {
  const { slug } = useParams<{ slug: string }>();
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
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{destino.nombre}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="pd-content">
        <h1 style={{ color: 'var(--pd-color-text)', marginBottom: '0.5rem' }}>
          {destino.nombre}
        </h1>
        <p style={{ color: 'var(--pd-color-text-muted)', marginBottom: '1.5rem' }}>
          {destino.descripcionCorta}
        </p>

        {(ta || book) && (
          <IonCard style={{ marginBottom: '1rem' }}>
            <IonCardContent>
              <strong>Reseñas</strong>
              {ta && (
                <p style={{ marginTop: '0.5rem' }}>
                  En TripAdvisor: {ta.puntaje}/5 ({ta.cantidad.toLocaleString()} opiniones).{' '}
                  <a href={ta.url} target="_blank" rel="noopener noreferrer">
                    Ver más reseñas
                  </a>
                </p>
              )}
              {book && (
                <p style={{ marginTop: '0.25rem' }}>
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
            <h3 style={{ marginBottom: '0.5rem' }}>Qué ver</h3>
            <p>{destino.guia.queVer}</p>
            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Cuándo ir</h3>
            <p>{destino.guia.cuandoIr}</p>
            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Cuántos días</h3>
            <p>{destino.guia.cuantosDias}</p>
            {destino.guia.requisitos && (
              <>
                <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Requisitos</h3>
                <p>{destino.guia.requisitos}</p>
              </>
            )}
            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Tips</h3>
            <p>{destino.guia.tips}</p>
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
