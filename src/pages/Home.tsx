import { useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/react';
import { Link } from 'react-router-dom';

export default function Home() {
  useEffect(() => {
    document.title = 'Para Dónde? – Guía de viajes';
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Para Dónde?</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="pd-content">
        <h1 style={{ marginTop: '1rem', color: 'var(--pd-color-text)' }}>
          ¿Para dónde?
        </h1>
        <p style={{ color: 'var(--pd-color-text-muted)', marginBottom: '1.5rem' }}>
          Tu guía para planificar el viaje: elegí tu aventura, consultá guías prácticas y calculá gastos.
        </p>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Elige tu aventura</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Respondé unas preguntas y te sugerimos destinos en Argentina según tu estilo.</p>
            <Link to="/aventura">
              <IonButton expand="block">Comenzar</IonButton>
            </Link>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Guías prácticas</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Documentación, vuelos cancelados, equipaje, qué llevar, pagar en el exterior.</p>
            <Link to="/guias">
              <IonButton expand="block" fill="outline">Ver guías</IonButton>
            </Link>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Calculadora dólar tarjeta</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>¿Gastaste USD con la tarjeta? Calculá cuánto te llega en pesos al resumen.</p>
            <Link to="/calculadora-dolar">
              <IonButton expand="block" fill="outline">Calcular</IonButton>
            </Link>
          </IonCardContent>
        </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
