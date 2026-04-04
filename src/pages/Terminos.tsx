import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';
import { TERMINOS_Y_CONDICIONES } from '../data/terminos';

export default function Terminos() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Términos y condiciones – Para Dónde?';
  }, []);

  const blocks = TERMINOS_Y_CONDICIONES.split(/\n(?=## )/);

  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
      <IonContent className="ion-padding" {...ionScrollProps}>
        <div className="pd-content pd-subpage-inner pd-terminos">
          <h1 className="pd-auth-page-title">Términos y condiciones</h1>
          <p className="pd-auth-lead pd-terminos-disclaimer">
            Texto de ejemplo para desarrollo. Reemplazar por cláusulas revisadas por asesoría legal antes de publicar en tiendas.
          </p>
          <div className="pd-terminos-body">
            {blocks.map((chunk, i) => {
              const lines = chunk.trim().split('\n');
              const first = lines[0] ?? '';
              if (first.startsWith('## ')) {
                return (
                  <section key={i} className="pd-terminos-section">
                    <h2 className="pd-terminos-h2">{first.replace(/^##\s+/, '')}</h2>
                    {lines.slice(1).map((line, j) => (
                      <p key={j} className="pd-terminos-p">
                        {line}
                      </p>
                    ))}
                  </section>
                );
              }
              return (
                <p key={i} className="pd-terminos-p">
                  {chunk.trim()}
                </p>
              );
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
