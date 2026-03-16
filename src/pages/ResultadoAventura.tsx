import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonButtons } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
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
        <h2 style={{ marginBottom: '1rem', color: 'var(--pd-color-text)' }}>
          Destinos sugeridos para vos
        </h2>
        {sugeridos.length === 0 ? (
          <p style={{ color: 'var(--pd-color-text-muted)' }}>
            No encontramos destinos que coincidan exactamente. Probá cambiar algunas respuestas en{' '}
            <Link to="/aventura">Elige tu aventura</Link>.
          </p>
        ) : (
          sugeridos.map((d) => (
            <IonCard key={d.id}>
              <IonCardHeader>
                <IonCardTitle>{d.nombre}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{d.descripcionCorta}</p>
                <Link to={`/destino/${d.slug}`}>
                  <IonButton expand="block" size="small" style={{ marginTop: '0.75rem' }}>
                    Ver guía de {d.nombre}
                  </IonButton>
                </Link>
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
