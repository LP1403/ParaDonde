import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { guiasTematicas } from '../data/guias';
import { PdSubpageChrome } from '../components/PdSubpageChrome';

export default function GuiasTematicas() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Guías prácticas – Para Dónde?';
  }, []);
  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate('/')} />
      <IonContent className="ion-padding">
        <div className="pd-content pd-subpage-inner">
        <h1 style={{ color: 'var(--pd-color-text)', marginBottom: '0.35rem', fontSize: '1.35rem' }}>
          Guías prácticas
        </h1>
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
