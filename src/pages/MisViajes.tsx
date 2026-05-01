import { useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import { getDestinoBySlug } from '../data/destinos';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';
import {
  getFavoriteDestinoSlugs,
  removeFavoriteDestino,
} from '../logic/destinosFavoritosStorage';
import { primeraImagenDestinoLista } from '../utils/destinoImagenes';

export default function MisViajes() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const navigate = useNavigate();
  const [, bump] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    document.title = 'Mis viajes – Para Dónde?';
  }, []);

  useEffect(() => {
    const h = () => bump();
    window.addEventListener('pd-favoritos-changed', h);
    return () => window.removeEventListener('pd-favoritos-changed', h);
  }, []);

  const slugs = getFavoriteDestinoSlugs();
  const items = slugs
    .map((slug) => {
      const d = getDestinoBySlug(slug);
      return d ? { slug, d } : null;
    })
    .filter(Boolean) as { slug: string; d: NonNullable<ReturnType<typeof getDestinoBySlug>> }[];

  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
      <IonContent className="ion-padding" {...ionScrollProps}>
        <div className="pd-content pd-subpage-inner">
          <h1 className="pd-auth-page-title">Mis viajes</h1>
          <p className="pd-auth-lead pd-misviajes-lead">
            Destinos que guardaste desde el resultado de tu aventura o desde la ficha. Se guardan en este
            dispositivo; más adelante podremos sincronizarlos con tu cuenta.
          </p>

          {items.length === 0 ? (
            <div className="pd-misviajes-empty">
              <p className="pd-misviajes-empty-text">
                Todavía no tenés ninguno guardado. Cuando veas un destino que te guste, tocá{' '}
                <strong>Guardar en Mis viajes</strong> en la ficha o en el resultado.
              </p>
              <Link to="/aventura" className="pd-misviajes-cta">
                Elegir una aventura →
              </Link>
            </div>
          ) : (
            <ul className="pd-misviajes-list" aria-label="Viajes guardados">
              {items.map(({ slug, d }) => {
                const hero = primeraImagenDestinoLista(d);
                const openDestino = () => navigate(`/destino/${slug}`);
                return (
                  <li
                    key={slug}
                    className="pd-misviajes-card"
                    style={hero ? { backgroundImage: `url(${hero})` } : undefined}
                    data-has-bg={hero ? 'true' : 'false'}
                    role="link"
                    tabIndex={0}
                    aria-label={`Ver ficha de ${d.nombre}`}
                    onClick={openDestino}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openDestino();
                      }
                    }}
                  >
                    <span className="pd-misviajes-card-bg-overlay" aria-hidden="true" />
                    <div className="pd-misviajes-card-main">
                      <p className="pd-misviajes-card-kicker">{d.pais ?? 'Argentina'}</p>
                      <h2 className="pd-misviajes-card-title">{d.nombre}</h2>
                      <p className="pd-misviajes-card-desc">{d.descripcionCorta}</p>
                    </div>
                    <div className="pd-misviajes-card-actions">
                      <Link
                        to={`/destino/${slug}`}
                        className="pd-misviajes-link-primary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver
                      </Link>
                      <button
                        type="button"
                        className="pd-misviajes-link-quiet"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavoriteDestino(slug);
                        }}
                      >
                        Quitar de la lista
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
