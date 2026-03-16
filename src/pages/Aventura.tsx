import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton } from '@ionic/react';
import { preguntasAventura } from '../data/aventura';

const STORAGE_KEY = 'paradonde_aventura_respuestas';

export function getRespuestasFromStorage(): Record<string, string> {
  try {
    const s = sessionStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

export function setRespuestasInStorage(r: Record<string, string>) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(r));
}

export default function Aventura() {
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState<Record<string, string>>(getRespuestasFromStorage);
  const [pasoActual, setPasoActual] = useState(0);

  const pregunta = preguntasAventura[pasoActual];
  const esUltima = pasoActual === preguntasAventura.length - 1;

  const handleSiguiente = () => {
    if (esUltima) {
      setRespuestasInStorage(respuestas);
      const params = new URLSearchParams(respuestas).toString();
      navigate(`/aventura/resultado?${params}`);
    } else {
      setPasoActual((p) => p + 1);
    }
  };

  const handleAtras = () => {
    if (pasoActual > 0) setPasoActual((p) => p - 1);
    else navigate('/');
  };

  const valorActual = pregunta ? respuestas[pregunta.id] : undefined;
  const puedeContinuar = !!valorActual;

  useEffect(() => {
    document.title = 'Elige tu aventura – Para Dónde?';
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Elige tu aventura</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="pd-content">
        {pregunta && (
          <>
            <p style={{ marginBottom: '1rem', color: 'var(--pd-color-text-muted)' }}>
              Pregunta {pasoActual + 1} de {preguntasAventura.length}
            </p>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--pd-color-text)' }}>
              {pregunta.label}
            </h2>
            <div className="aventura-grid">
              {pregunta.opciones.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  className={`aventura-cuadrante ${valorActual === op.id ? 'aventura-cuadrante--selected' : ''}`}
                  style={{
                    backgroundImage: op.imageUrl ? `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url(${op.imageUrl})` : undefined,
                    backgroundColor: op.imageUrl ? undefined : 'var(--pd-color-primary-soft)',
                  }}
                  onClick={() =>
                    setRespuestas((r) => ({ ...r, [pregunta.id]: op.id }))
                  }
                >
                  <span className="aventura-cuadrante-label">{op.label}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
              <IonButton fill="outline" onClick={handleAtras}>
                Atrás
              </IonButton>
              <IonButton disabled={!puedeContinuar} onClick={handleSiguiente}>
                {esUltima ? 'Ver resultados' : 'Siguiente'}
              </IonButton>
            </div>
          </>
        )}
        </div>
      </IonContent>
    </IonPage>
  );
}
