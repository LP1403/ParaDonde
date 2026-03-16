import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonButtons, IonButton } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { guiasTematicas } from '../data/guias';

export default function GuiasTematicas() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Guías prácticas – Para Dónde?';
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
          <IonTitle>Guías prácticas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="pd-content">
        <p style={{ color: 'var(--pd-color-text-muted)', marginBottom: '1rem' }}>
          Documentación, derechos y tips para viajar con menos sorpresas.
        </p>
        <IonList>
          {guiasTematicas.map((g) => (
            <Link key={g.id} to={`/guias/${g.slug}`} style={{ textDecoration: 'none' }}>
              <IonItem>
                <IonLabel>
                  <h2>{g.titulo}</h2>
                  <p>{g.descripcionCorta}</p>
                </IonLabel>
              </IonItem>
            </Link>
          ))}
        </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
}
