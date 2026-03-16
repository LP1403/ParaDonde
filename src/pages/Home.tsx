import { useEffect } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Link } from 'react-router-dom';

export default function Home() {
  useEffect(() => {
    document.title = 'Para Dónde? – Guía de viajes';
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <header className="pd-home-hero">
          <h1>¿Para dónde?</h1>
          <p>Tu guía para planificar el viaje: elegí tu aventura, consultá guías prácticas y calculá gastos en pesos.</p>
        </header>

        <section className="pd-home-cards" aria-label="Accesos rápidos">
          <Link to="/aventura" className="pd-home-card pd-home-card--aventura">
            <div className="pd-home-card-icon" aria-hidden="true">🧭</div>
            <h2>Elige tu aventura</h2>
            <p>Respondé unas preguntas y te sugerimos destinos en Argentina según tu estilo.</p>
          </Link>

          <Link to="/guias" className="pd-home-card pd-home-card--guias">
            <div className="pd-home-card-icon" aria-hidden="true">📋</div>
            <h2>Guías prácticas</h2>
            <p>Documentación, vuelos cancelados, equipaje, qué llevar, pagar en el exterior.</p>
          </Link>

          <Link to="/calculadora-dolar" className="pd-home-card pd-home-card--dolar">
            <div className="pd-home-card-icon" aria-hidden="true">💳</div>
            <h2>Calculadora dólar tarjeta</h2>
            <p>¿Gastaste USD con la tarjeta? Calculá cuánto te llega en pesos al resumen.</p>
          </Link>
        </section>
      </IonContent>
    </IonPage>
  );
}
