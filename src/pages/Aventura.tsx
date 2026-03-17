import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { arrowBack, sunny, moon } from 'ionicons/icons';
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
  const [temaOscuro, setTemaOscuro] = useState(false);

  const pregunta = preguntasAventura[pasoActual];
  const esUltima = pasoActual === preguntasAventura.length - 1;

  const handleSeleccionOpcion = (opcionId: string) => {
    if (!pregunta) return;
    const nuevasRespuestas = { ...respuestas, [pregunta.id]: opcionId };
    setRespuestas(nuevasRespuestas);

    if (esUltima) {
      setRespuestasInStorage(nuevasRespuestas);
      const params = new URLSearchParams(nuevasRespuestas).toString();
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

  useEffect(() => {
    document.title = 'Elige tu aventura – Para Dónde?';
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (temaOscuro) {
      root.classList.add('pd-theme-dark');
    } else {
      root.classList.remove('pd-theme-dark');
    }
  }, [temaOscuro]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleAtras} aria-label="Volver" fill="clear">
              <IonIcon icon={arrowBack} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              onClick={() => navigate('/')}
              fill="clear"
              aria-label="Volver al inicio"
            >
              Inicio
            </IonButton>
            <IonButton
              onClick={() => setTemaOscuro((v) => !v)}
              fill="clear"
              aria-label={temaOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            >
              <IonIcon icon={temaOscuro ? sunny : moon} slot="icon-only" />
            </IonButton>
          </IonButtons>
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
            <p style={{ marginTop: '-0.75rem', marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--pd-color-text-muted)' }}>
              Tocá una opción para continuar.
            </p>
            <div className="aventura-grid">
              {pregunta.opciones.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  className={`aventura-cuadrante ${valorActual === op.id ? 'aventura-cuadrante--selected' : ''}`}
                  data-has-image={op.imageUrl ? 'true' : undefined}
                  style={{
                    backgroundImage: op.imageUrl ? `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url(${op.imageUrl})` : undefined,
                    backgroundColor: op.imageUrl ? undefined : 'var(--pd-color-primary-soft)',
                  }}
                  onClick={() => handleSeleccionOpcion(op.id)}
                >
                  <span className="aventura-cuadrante-label">{op.label}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: '2rem' }} />
          </>
        )}
        </div>
      </IonContent>
    </IonPage>
  );
}
