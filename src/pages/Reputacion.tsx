import { useEffect, useReducer, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';
import { useAuth } from '../context/AuthContext';
import { NivelBadge } from '../components/reputacion/NivelBadge';
import { ReferidosPanel } from '../components/reputacion/ReferidosPanel';
import {
  getPuntuacionLocal,
  getMisionesCompletadasLocal,
  syncPuntuacionDesdeFirestore,
} from '../logic/puntuacionStorage';
import { getNivelParaPuntos, NIVELES_REPUTACION } from '../data/reputacion';
import { getFavoriteDestinoSlugs } from '../logic/destinosFavoritosStorage';
import { getDestinoBySlug } from '../data/destinos';
import { getMisionesPorDestino } from '../data/misiones';
import type { PuntuacionGlobal } from '../services/firestoreService';

export default function Reputacion() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    document.title = 'Mi reputación – Para Dónde?';
  }, []);

  useEffect(() => {
    if (!user) return;
    setSyncing(true);
    syncPuntuacionDesdeFirestore(user.uid)
      .then(() => bump())
      .finally(() => setSyncing(false));
  }, [user]);

  useEffect(() => {
    const h = () => bump();
    window.addEventListener('pd-puntuacion-changed', h);
    window.addEventListener('pd-misiones-changed', h);
    return () => {
      window.removeEventListener('pd-puntuacion-changed', h);
      window.removeEventListener('pd-misiones-changed', h);
    };
  }, []);

  if (!ready) {
    return (
      <IonPage>
        <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
        <IonContent {...ionScrollProps} className="ion-padding">
          <div className="pd-content pd-subpage-inner">
            <p className="pd-auth-lead">Cargando…</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!user) {
    return (
      <IonPage>
        <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
        <IonContent {...ionScrollProps} className="ion-padding">
          <div className="pd-content pd-subpage-inner pd-rep-unauthenticated">
            <div className="pd-rep-lock-icon" aria-hidden>🔐</div>
            <h1 className="pd-auth-page-title">Mi reputación</h1>
            <p className="pd-auth-lead">
              El programa de reputación es exclusivo para usuarios registrados. Creá una cuenta
              para acumular puntos, completar misiones y acceder a beneficios exclusivos en cada destino.
            </p>
            <div className="pd-auth-form pd-cuenta-auth-choice">
              <Link to="/login" className="pd-auth-submit">Iniciar sesión</Link>
              <Link to="/registro" className="pd-auth-submit pd-auth-submit--outline">Crear cuenta</Link>
            </div>
            <div className="pd-rep-preview-niveles">
              <h2 className="pd-rep-preview-title">Niveles que podés alcanzar</h2>
              <div className="pd-rep-niveles-list">
                {NIVELES_REPUTACION.map((n) => (
                  <div key={n.id} className="pd-rep-nivel-preview"
                    style={{ '--nivel-color': n.color } as React.CSSProperties}>
                    <span className="pd-rep-nivel-preview-emoji" aria-hidden>{n.emoji}</span>
                    <span className="pd-rep-nivel-preview-nombre">{n.nombre}</span>
                    <span className="pd-rep-nivel-preview-apodo">{n.descripcion.split('.')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const puntuacion: PuntuacionGlobal | null = getPuntuacionLocal();
  const misionesCompletadas = getMisionesCompletadasLocal();
  const totalPuntos = puntuacion?.totalPuntos ?? 0;
  const nivel = getNivelParaPuntos(totalPuntos);
  const slugs = getFavoriteDestinoSlugs();

  const destinosConMisiones = slugs
    .map((slug) => {
      const destino = getDestinoBySlug(slug);
      if (!destino) return null;
      const misiones = getMisionesPorDestino(slug);
      const completadas = misiones.filter((m) => Boolean(misionesCompletadas[m.id])).length;
      return { slug, destino, misiones, completadas };
    })
    .filter(Boolean) as {
      slug: string;
      destino: NonNullable<ReturnType<typeof getDestinoBySlug>>;
      misiones: ReturnType<typeof getMisionesPorDestino>;
      completadas: number;
    }[];

  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
      <IonContent {...ionScrollProps} className="ion-padding">
        <div className="pd-content pd-subpage-inner pd-rep-page">
          <h1 className="pd-rep-page-title">Mi reputación</h1>

          {syncing && <p className="pd-rep-syncing">Sincronizando…</p>}

          {/* Nivel global */}
          <section className="pd-rep-hero-section">
            <NivelBadge nivel={nivel} puntos={totalPuntos} mostrarProgreso size="lg" />
            <div className="pd-rep-fuentes">
              <div className="pd-rep-fuente">
                <span className="pd-rep-fuente-icon" aria-hidden>🎯</span>
                <span className="pd-rep-fuente-num">{puntuacion?.porFuente.misiones ?? 0}</span>
                <span className="pd-rep-fuente-lbl">por misiones</span>
              </div>
              <div className="pd-rep-fuente">
                <span className="pd-rep-fuente-icon" aria-hidden>✈️</span>
                <span className="pd-rep-fuente-num">{puntuacion?.porFuente.vuelos ?? 0}</span>
                <span className="pd-rep-fuente-lbl">por vuelos</span>
              </div>
              <div className="pd-rep-fuente">
                <span className="pd-rep-fuente-icon" aria-hidden>🔗</span>
                <span className="pd-rep-fuente-num">{puntuacion?.porFuente.referidos ?? 0}</span>
                <span className="pd-rep-fuente-lbl">por referidos</span>
              </div>
            </div>
          </section>

          {/* Referidos */}
          <ReferidosPanel
            uid={user.uid}
            displayName={user.displayName}
            puntuacion={puntuacion}
            onPuntuacionChanged={() => bump()}
          />

          {/* Destinos */}
          <section className="pd-rep-destinos-section">
            <h2 className="pd-rep-section-title">Misiones por destino</h2>
            {destinosConMisiones.length === 0 ? (
              <div className="pd-rep-empty">
                <p className="pd-rep-empty-text">
                  Agregá destinos a{' '}
                  <Link to="/viajes" className="pd-rep-link">Mis viajes</Link>{' '}
                  para desbloquear misiones y acumular puntos.
                </p>
              </div>
            ) : (
              <ul className="pd-rep-destinos-list" aria-label="Destinos con misiones">
                {destinosConMisiones.map(({ slug, destino, misiones, completadas }) => (
                  <li key={slug} className="pd-rep-destino-card">
                    <div className="pd-rep-destino-card-info">
                      <p className="pd-rep-destino-card-pais">{destino.pais ?? 'Argentina'}</p>
                      <h3 className="pd-rep-destino-card-nombre">{destino.nombre}</h3>
                      <p className="pd-rep-destino-card-prog">
                        {misiones.length === 0
                          ? 'Sin misiones disponibles aún'
                          : `${completadas} / ${misiones.length} misiones completadas`}
                      </p>
                      {misiones.length > 0 && (
                        <div className="pd-rep-destino-card-barra-wrap">
                          <div
                            className="pd-rep-destino-card-barra"
                            style={{ width: `${misiones.length > 0 ? (completadas / misiones.length) * 100 : 0}%` }}
                          />
                        </div>
                      )}
                    </div>
                    {misiones.length > 0 && (
                      <Link
                        to={`/misiones/${slug}`}
                        className="pd-rep-destino-card-btn"
                        aria-label={`Ver misiones de ${destino.nombre}`}
                      >
                        Ver misiones →
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Cómo ganar puntos */}
          <section className="pd-rep-como-section">
            <h2 className="pd-rep-section-title">Cómo ganar puntos</h2>
            <ul className="pd-rep-como-list">
              <li className="pd-rep-como-item">
                <span aria-hidden>📷</span>
                <div>
                  <strong>Completar misiones</strong>
                  <p>Subí una foto desde el destino. Ganás entre 50 y 200 puntos por misión.</p>
                </div>
              </li>
              <li className="pd-rep-como-item">
                <span aria-hidden>✈️</span>
                <div>
                  <strong>Registrar un vuelo</strong>
                  <p>Cada vuelo que cargás en la sección de vuelos te da 30 puntos.</p>
                </div>
              </li>
              <li className="pd-rep-como-item">
                <span aria-hidden>🔗</span>
                <div>
                  <strong>Referir amigos</strong>
                  <p>Compartí tu código y ambos ganan 500 puntos. A partir del 6° referido, 350 pts cada uno.</p>
                </div>
              </li>
            </ul>
          </section>

          {/* Niveles */}
          <section className="pd-rep-niveles-section">
            <h2 className="pd-rep-section-title">Niveles de reputación</h2>
            <div className="pd-rep-niveles-grid">
              {NIVELES_REPUTACION.map((n) => (
                <div
                  key={n.id}
                  className={`pd-rep-nivel-item ${nivel.id === n.id ? 'pd-rep-nivel-item--activo' : ''}`}
                  style={{ '--nivel-color': n.color, '--nivel-fondo': n.colorFondo } as React.CSSProperties}
                >
                  <span className="pd-rep-nivel-emoji" aria-hidden>{n.emoji}</span>
                  <strong className="pd-rep-nivel-nombre">{n.nombre}</strong>
                  <span className="pd-rep-nivel-apodo">{n.descripcion}</span>
                  <span className="pd-rep-nivel-pts">
                    {n.puntosMax != null ? `${n.puntosMin}–${n.puntosMax}` : `${n.puntosMin}+`} pts
                  </span>
                  <p className="pd-rep-nivel-desc">{n.descripcion}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
}
