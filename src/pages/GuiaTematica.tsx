import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { getGuiaBySlug } from '../data/guias';
import { PdSubpageChrome } from '../components/PdSubpageChrome';

const sectionHeadingStyle: React.CSSProperties = {
  color: 'var(--pd-color-primary)',
  fontSize: '1.125rem',
  fontWeight: 600,
  marginTop: '1.5rem',
  marginBottom: '0.5rem',
};
const blockStyle: React.CSSProperties = {
  whiteSpace: 'pre-wrap',
  color: 'var(--pd-color-text)',
  lineHeight: 1.6,
  marginBottom: '0.5rem',
};

function renderContenidoConTitulos(contenido: string): React.ReactNode[] {
  const lines = contenido.split('\n');
  const out: React.ReactNode[] = [];
  let i = 0;
  let block: string[] = [];
  const flush = () => {
    if (block.length) {
      const text = block.join('\n').trim();
      if (text) out.push(<div key={i++} style={blockStyle}>{text}</div>);
      block = [];
    }
  };
  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush();
      out.push(<h2 key={i++} style={sectionHeadingStyle}>{line.slice(3).trim()}</h2>);
    } else {
      block.push(line);
    }
  }
  flush();
  return out;
}

export default function GuiaTematica() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const guia = slug ? getGuiaBySlug(slug) : undefined;

  useEffect(() => {
    if (guia) document.title = `${guia.titulo} – Para Dónde?`;
  }, [guia]);

  if (!guia) {
    return (
      <IonPage>
        <PdSubpageChrome onBack={() => navigate('/guias')} />
        <IonContent className="ion-padding">
          <div className="pd-content pd-subpage-inner">
            <p>No encontramos esa guía.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const hasSecciones = guia.secciones && guia.secciones.length > 0;

  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate(-1)} />
      <IonContent className="ion-padding">
        <div className="pd-content pd-guia-content pd-subpage-inner">
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
              {renderContenidoConTitulos(guia.contenido)}
              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Enlaces oficiales</h3>
              <ul style={{ paddingLeft: '1.25rem' }}>
                {guia.linksOficiales.map((l) => (
                  <li key={l.url} style={{ marginBottom: '0.25rem' }}>
                    {l.url.startsWith('/') ? (
                      <Link to={l.url}>{l.label}</Link>
                    ) : (
                      <a href={l.url} target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </a>
                    )}
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
