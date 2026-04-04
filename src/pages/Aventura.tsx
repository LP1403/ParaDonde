import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import {
  clearAventuraProgress,
  getAventuraProgress,
  getPersistedOrigenPaisId,
  lastCoverFromRespuestas,
  setAventuraProgress,
  setPersistedOrigenPaisId,
  setRespuestasInStorage,
} from '../logic/aventuraStorage';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';
import { preguntasAventura } from '../data/aventura';
import { AventuraOrigenPaisResumen } from '../components/AventuraOrigenPaisResumen';

function buildInitialAventuraState(): {
  respuestas: Record<string, string>;
  pasoActual: number;
} {
  const progress = getAventuraProgress();
  let respuestas: Record<string, string> = { ...(progress?.respuestas ?? {}) };
  const p0 = preguntasAventura[0];
  const persisted = getPersistedOrigenPaisId();
  if (!respuestas.origen_pais && persisted && p0?.id === 'origen_pais') {
    const valid = p0.opciones.some((o) => o.id === persisted);
    if (valid) respuestas = { ...respuestas, origen_pais: persisted };
  }
  return {
    respuestas,
    pasoActual: progress?.pasoActual ?? 0,
  };
}

export default function Aventura() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const navigate = useNavigate();

  const initial = useMemo(() => buildInitialAventuraState(), []);
  const [respuestas, setRespuestas] = useState<Record<string, string>>(() => ({
    ...initial.respuestas,
  }));
  const [pasoActual, setPasoActual] = useState(() => initial.pasoActual);
  const [editandoOrigenPais, setEditandoOrigenPais] = useState(false);

  const pregunta = preguntasAventura[pasoActual];
  const esUltima = pasoActual === preguntasAventura.length - 1;
  const esPasoOrigenPais = pasoActual === 0 && pregunta?.id === 'origen_pais';
  const origenId = respuestas.origen_pais;
  const origenOpcionValida =
    Boolean(origenId) &&
    preguntasAventura[0]?.id === 'origen_pais' &&
    Boolean(preguntasAventura[0].opciones.some((o) => o.id === origenId));
  const mostrarResumenOrigen = esPasoOrigenPais && origenOpcionValida && !editandoOrigenPais;
  const mostrarGridOrigen = esPasoOrigenPais && (!origenOpcionValida || editandoOrigenPais);

  const handleContinuarDesdeResumenPais = () => {
    const id = respuestas.origen_pais;
    if (!id) return;
    setPersistedOrigenPaisId(id);
    setPasoActual(1);
    setAventuraProgress({
      respuestas,
      pasoActual: 1,
      lastCoverUrl: lastCoverFromRespuestas(respuestas),
    });
  };

  const handleSeleccionOpcion = (opcionId: string, imageUrl?: string) => {
    if (!pregunta) return;

    if (pregunta.id === 'origen_pais') {
      setPersistedOrigenPaisId(opcionId);
      const prev = respuestas.origen_pais;
      let nuevasRespuestas: Record<string, string> = { ...respuestas, origen_pais: opcionId };
      if (prev && prev !== opcionId) {
        for (const q of preguntasAventura.slice(1)) {
          delete nuevasRespuestas[q.id];
        }
      }
      if (prev === opcionId && editandoOrigenPais) {
        setEditandoOrigenPais(false);
        setRespuestas(nuevasRespuestas);
        setAventuraProgress({
          respuestas: nuevasRespuestas,
          pasoActual: 0,
          lastCoverUrl: undefined,
        });
        return;
      }
      setRespuestas(nuevasRespuestas);
      setEditandoOrigenPais(false);
      const next = 1;
      setPasoActual(next);
      setAventuraProgress({
        respuestas: nuevasRespuestas,
        pasoActual: next,
        lastCoverUrl: imageUrl ?? lastCoverFromRespuestas(nuevasRespuestas),
      });
      return;
    }

    const nuevasRespuestas = { ...respuestas, [pregunta.id]: opcionId };
    setRespuestas(nuevasRespuestas);

    if (esUltima) {
      clearAventuraProgress();
      setRespuestasInStorage(nuevasRespuestas);
      const params = new URLSearchParams(nuevasRespuestas).toString();
      navigate(`/aventura/resultado?${params}`);
    } else {
      const next = pasoActual + 1;
      setPasoActual(next);
      const cover = imageUrl ?? lastCoverFromRespuestas(nuevasRespuestas);
      setAventuraProgress({
        respuestas: nuevasRespuestas,
        pasoActual: next,
        lastCoverUrl: cover,
      });
    }
  };

  const handleAtras = () => {
    if (pasoActual > 0) {
      const next = pasoActual - 1;
      setPasoActual(next);
      setAventuraProgress({
        respuestas,
        pasoActual: next,
        lastCoverUrl: lastCoverFromRespuestas(respuestas),
      });
      return;
    }
    if (editandoOrigenPais) {
      setEditandoOrigenPais(false);
      return;
    }
    navigate('/');
  };

  const valorActual = pregunta ? respuestas[pregunta.id] : undefined;

  useEffect(() => {
    document.title = 'Elige tu aventura – Para Dónde?';
  }, []);

  return (
    <IonPage>
      <PdSubpageChrome onBack={handleAtras} chromeVisible={chromeVisible} />
      <IonContent className="ion-padding" {...ionScrollProps}>
        <div className="pd-content pd-subpage-inner">
          <h1
            style={{ color: 'var(--pd-color-text)', marginBottom: '0.25rem', fontSize: '1.35rem' }}
          >
            Elige tu aventura
          </h1>
          {pregunta && (
            <>
              <p style={{ marginBottom: '1rem', color: 'var(--pd-color-text-muted)' }}>
                Pregunta {pasoActual + 1} de {preguntasAventura.length}
              </p>

              {mostrarResumenOrigen && respuestas.origen_pais ? (
                <AventuraOrigenPaisResumen
                  opcionId={respuestas.origen_pais}
                  onContinuar={handleContinuarDesdeResumenPais}
                  onCambiar={() => setEditandoOrigenPais(true)}
                />
              ) : mostrarGridOrigen ? (
                <>
                  <h2 style={{ marginBottom: '1.5rem', color: 'var(--pd-color-text)' }}>
                    {editandoOrigenPais
                      ? 'Elegí tu país de residencia'
                      : pregunta.label}
                  </h2>
                  <p
                    style={{
                      marginTop: '-0.75rem',
                      marginBottom: '1.25rem',
                      fontSize: '0.9rem',
                      color: 'var(--pd-color-text-muted)',
                    }}
                  >
                    {editandoOrigenPais
                      ? 'Tocá el país donde vivís. Si cambias de país, se borran las respuestas siguientes de esta aventura.'
                      : 'Tocá una opción para continuar.'}
                  </p>
                  <div className="pd-origen-pais-grid" role="list">
                    {pregunta.opciones.map((op) => (
                      <button
                        key={op.id}
                        type="button"
                        role="listitem"
                        className={`pd-origen-pais-btn ${valorActual === op.id ? 'pd-origen-pais-btn--selected' : ''}`}
                        onClick={() => handleSeleccionOpcion(op.id, op.imageUrl)}
                      >
                        <span className="pd-origen-pais-flag" aria-hidden>
                          {op.bandera ?? '🏳️'}
                        </span>
                        <span className="pd-origen-pais-sep" aria-hidden>
                          —
                        </span>
                        <span className="pd-origen-pais-nombre">{op.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ marginBottom: '1.5rem', color: 'var(--pd-color-text)' }}>
                    {pregunta.label}
                  </h2>
                  <p
                    style={{
                      marginTop: '-0.75rem',
                      marginBottom: '1.25rem',
                      fontSize: '0.9rem',
                      color: 'var(--pd-color-text-muted)',
                    }}
                  >
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
                          backgroundImage: op.imageUrl
                            ? `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url(${op.imageUrl})`
                            : undefined,
                          backgroundColor: op.imageUrl ? undefined : 'var(--pd-color-primary-soft)',
                        }}
                        onClick={() => handleSeleccionOpcion(op.id, op.imageUrl)}
                      >
                        <span className="aventura-cuadrante-label">{op.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div style={{ marginTop: '2rem' }} />
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
