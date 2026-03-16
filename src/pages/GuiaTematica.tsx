import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons } from '@ionic/react';
import { getGuiaBySlug } from '../data/guias';

export default function GuiaTematica() {
  const { slug } = useParams<{ slug: string }>();
  const guia = slug ? getGuiaBySlug(slug) : undefined;

  useEffect(() => {
    if (guia) document.title = `${guia.titulo} – Para Dónde?`;
  }, [guia]);

  if (!guia) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Guía</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="pd-content">
            <p>No encontramos esa guía.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const hasSecciones = guia.secciones && guia.secciones.length > 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/guias" />
          </IonButtons>
          <IonTitle>{guia.titulo}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="pd-content pd-guia-content">
          <h1 style={{ color: 'var(--pd-color-text)', marginBottom: '1rem' }}>
            {guia.titulo}
          </h1>

          {hasSecciones ? (
            guia.secciones!.map((sec, i) => (
              <section key={i} style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--pd-color-primary)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>
                  {sec.titulo}
                </h2>
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    color: 'var(--pd-color-text)',
                    lineHeight: 1.6,
                    marginBottom: '0.75rem',
                  }}
                >
                  {sec.cuerpo}
                </div>
                <p style={{ marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.95rem' }}>
                  Enlaces útiles:
                </p>
                <ul style={{ paddingLeft: '1.25rem', marginTop: 0 }}>
                  {sec.links.map((l) => (
                    <li key={l.url} style={{ marginBottom: '0.35rem' }}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <>
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  color: 'var(--pd-color-text)',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                }}
              >
                {guia.contenido}
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Enlaces oficiales</h3>
              <ul style={{ paddingLeft: '1.25rem' }}>
                {guia.linksOficiales.map((l) => (
                  <li key={l.url} style={{ marginBottom: '0.25rem' }}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
