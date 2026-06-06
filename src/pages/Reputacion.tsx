import { useEffect, useReducer, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';
import { useAuth } from '../context/AuthContext';
import { NivelProgresion } from '../components/reputacion/NivelProgresion';
import { ReferidosPanel } from '../components/reputacion/ReferidosPanel';
import { HistorialModal } from '../components/reputacion/HistorialModal';
import {
  getPuntuacionLocal,
  getMisionesCompletadasLocal,
  syncPuntuacionDesdeFirestore,
} from '../logic/puntuacionStorage';
import {
  getNivelParaPuntos,
  NIVELES_REPUTACION,
  PUNTOS_MISION_FACIL,
  PUNTOS_MISION_MEDIO,
  PUNTOS_MISION_DIFICIL,
  PUNTOS_VUELO,
  PUNTOS_REFERIDO_NUEVO,
} from '../data/reputacion';
import { getFavoriteDestinoSlugs } from '../logic/destinosFavoritosStorage';
import { getDestinoBySlug } from '../data/destinos';
import { getMisionesPorDestino } from '../data/misiones';
import { getBeneficiosPorNivel } from '../data/beneficios';
import type { PuntuacionGlobal } from '../services/firestoreService';

export default function Reputacion() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const [syncing, setSyncing] = useState(false);
  const [historialOpen, setHistorialOpen] = useState(false);

  useEffect(() => {
    document.title = 'Programa Afiliado – Para Dónde?';
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
          <div className="pd-content pd-subpage-inner pd-afil-unauth">
            <div className="pd-afil-unauth-icon" aria-hidden>🔐</div>
            <h1 className="pd-afil-unauth-title">Programa Afiliado</h1>
            <p className="pd-afil-unauth-lead">
              Completá misiones, acumulá puntos y accedé a beneficios exclusivos en cada destino.
              Solo para usuarios registrados.
            </p>
            <div className="pd-auth-form pd-cuenta-auth-choice">
              <Link to="/login" className="pd-auth-submit">Iniciar sesión</Link>
              <Link to="/registro" className="pd-auth-submit pd-auth-submit--outline">Crear cuenta</Link>
            </div>
            <div className="pd-afil-niveles-preview">
              {NIVELES_REPUTACION.map((n) => (
                <div
                  key={n.id}
                  className="pd-afil-nivel-prev"
                  style={{ '--nivel-color': n.color } as React.CSSProperties}
                >
                  <div className="pd-afil-nivel-prev-hex">
                    <span aria-hidden>{n.emoji}</span>
                  </div>
                  <span className="pd-afil-nivel-prev-nombre">{n.nombre}</span>
                </div>
              ))}
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

  // Misiones activas = primera misión incompleta de cada destino guardado
  const misionesActivas = destinosConMisiones
    .flatMap(({ slug, destino, misiones }) =>
      misiones
        .filter((m) => !misionesCompletadas[m.id])
        .slice(0, 1)
        .map((m) => ({ mision: m, destino, slug }))
    )
    .slice(0, 3);

  // Beneficios desbloqueados del nivel actual
  const beneficiosActuales = getBeneficiosPorNivel(nivel.id).slice(0, 2);

  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
      {historialOpen && (
        <HistorialModal puntuacion={puntuacion} onClose={() => setHistorialOpen(false)} />
      )}
      <IonContent {...ionScrollProps} className="ion-padding">
        <div className="pd-content pd-subpage-inner pd-afil-page">

          {/* ── Header ── */}
          <div className="pd-afil-header">
            <div className="pd-afil-header-text">
              <h1 className="pd-afil-titulo">Programa Afiliado</h1>
              <p className="pd-afil-subtitulo">Viajá, completá misiones y ganá puntos</p>
            </div>
            <div className="pd-afil-pts-badge" aria-label={`${totalPuntos} puntos totales`}>
              <span className="pd-afil-pts-badge-icon" aria-hidden>🪙</span>
              <span className="pd-afil-pts-badge-num">{totalPuntos.toLocaleString('es-AR')}</span>
              <span className="pd-afil-pts-badge-label">pts</span>
            </div>
          </div>

          {syncing && <p className="pd-rep-syncing">Sincronizando…</p>}

          {/* ── Progresión de nivel ── */}
          <div className="pd-afil-card">
            <NivelProgresion nivelActual={nivel} totalPuntos={totalPuntos} />
          </div>

          {/* ── Grid principal ── */}
          <div className="pd-afil-grid">

            {/* Columna principal */}
            <div className="pd-afil-col-main">

              {/* Mis misiones activas */}
              <section className="pd-afil-card pd-afil-misiones-activas">
                <div className="pd-afil-section-head">
                  <h2 className="pd-afil-section-title">Mis misiones activas</h2>
                  {destinosConMisiones.length > 0 && (
                    <Link to={`/misiones/${destinosConMisiones[0].slug}`} className="pd-afil-ver-todas">
                      Ver todas →
                    </Link>
                  )}
                </div>

                {misionesActivas.length === 0 ? (
                  <div className="pd-afil-empty">
                    <p className="pd-afil-empty-text">
                      {destinosConMisiones.length === 0
                        ? <>Agregá destinos a <Link to="/viajes" className="pd-rep-link">Mis viajes</Link> para desbloquear misiones.</>
                        : '¡Todas las misiones de tus destinos están completadas! 🎉'}
                    </p>
                  </div>
                ) : (
                  <div className="pd-afil-misiones-list">
                    {misionesActivas.map(({ mision, destino, slug }) => (
                      <Link key={mision.id} to={`/misiones/${slug}`} className="pd-afil-mision-card">
                        {mision.imagenUrl && (
                          <div className="pd-afil-mision-img-wrap">
                            <img
                              src={mision.imagenUrl}
                              alt={destino.nombre}
                              className="pd-afil-mision-img"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="pd-afil-mision-body">
                          <p className="pd-afil-mision-lugar">
                            <span aria-hidden>📍</span> {destino.nombre}
                          </p>
                          <h3 className="pd-afil-mision-titulo">{mision.titulo}</h3>
                          <p className="pd-afil-mision-desc">{mision.descripcion}</p>
                          <div className="pd-afil-mision-footer">
                            <span className="pd-afil-mision-pts">+{mision.puntos} pts</span>
                            <span
                              className={`pd-afil-mision-dif pd-afil-mision-dif--${mision.dificultad}`}
                            >
                              {mision.dificultad === 'facil' ? 'Fácil' : mision.dificultad === 'medio' ? 'Media' : 'Difícil'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Reputación por destino */}
              {destinosConMisiones.length > 0 && (
                <section className="pd-afil-card">
                  <div className="pd-afil-section-head">
                    <h2 className="pd-afil-section-title">Tu reputación por destino</h2>
                  </div>
                  <ul className="pd-afil-destinos-list">
                    {destinosConMisiones.map(({ slug, destino, misiones, completadas }) => (
                      <li key={slug}>
                        <Link to={`/misiones/${slug}`} className="pd-afil-destino-row">
                          {destino.imageUrl && (
                            <img src={destino.imageUrl} alt="" className="pd-afil-destino-thumb" aria-hidden />
                          )}
                          <div className="pd-afil-destino-info">
                            <p className="pd-afil-destino-pais">{destino.pais ?? 'Argentina'}</p>
                            <p className="pd-afil-destino-nombre">{destino.nombre}</p>
                            {misiones.length > 0 && (
                              <>
                                <div className="pd-afil-destino-barra-wrap">
                                  <div
                                    className="pd-afil-destino-barra"
                                    style={{ width: `${(completadas / misiones.length) * 100}%` }}
                                  />
                                </div>
                                <p className="pd-afil-destino-prog">
                                  {completadas}/{misiones.length} misiones
                                </p>
                              </>
                            )}
                          </div>
                          <span className="pd-afil-destino-arrow" aria-hidden>›</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Columna lateral */}
            <div className="pd-afil-col-side">

              {/* Tus puntos + Cómo ganar — card fusionada */}
              <div className="pd-afil-card pd-afil-puntos-card">
                <h2 className="pd-afil-section-title">Tus puntos</h2>
                <div className="pd-afil-puntos-row">
                  <p className="pd-afil-puntos-total">
                    {totalPuntos.toLocaleString('es-AR')} <span>pts</span>
                  </p>
                  <button
                    type="button"
                    className="pd-afil-historial-btn"
                    onClick={() => setHistorialOpen(true)}
                  >
                    Historial <span aria-hidden>›</span>
                  </button>
                </div>

                <div className="pd-afil-puntos-divider" />

                <h3 className="pd-afil-como-subtitle">Cómo ganar puntos</h3>
                <ul className="pd-afil-como-list">
                  <li className="pd-afil-como-item">
                    <span className="pd-afil-como-icon pd-afil-como-icon--mision" aria-hidden>🎯</span>
                    <span className="pd-afil-como-label">Completar misiones</span>
                    <span className="pd-afil-como-pts">+{PUNTOS_MISION_FACIL}–{PUNTOS_MISION_DIFICIL} pts</span>
                  </li>
                  <li className="pd-afil-como-item">
                    <span className="pd-afil-como-icon pd-afil-como-icon--vuelo" aria-hidden>✈️</span>
                    <span className="pd-afil-como-label">Cargar código de vuelo</span>
                    <span className="pd-afil-como-pts">+{PUNTOS_VUELO} pts</span>
                  </li>
                  <li className="pd-afil-como-item">
                    <span className="pd-afil-como-icon pd-afil-como-icon--ref" aria-hidden>🔗</span>
                    <span className="pd-afil-como-label">Referir amigos</span>
                    <span className="pd-afil-como-pts">+{PUNTOS_REFERIDO_NUEVO} pts</span>
                  </li>
                </ul>
              </div>

              {/* Canjeá tus puntos */}
              {beneficiosActuales.length > 0 && (
                <div className="pd-afil-card">
                  <div className="pd-afil-section-head">
                    <h2 className="pd-afil-section-title">Canjeá tus puntos</h2>
                    <Link to={`/misiones/${slugs[0] ?? ''}`} className="pd-afil-ver-todas">
                      Ver todos →
                    </Link>
                  </div>
                  <div className="pd-afil-beneficios-list">
                    {beneficiosActuales.map((b) => (
                      <div key={b.id} className="pd-afil-beneficio-row">
                        <div className="pd-afil-beneficio-icon-wrap" aria-hidden>
                          <span className="pd-afil-beneficio-icon">{b.icono}</span>
                        </div>
                        <div className="pd-afil-beneficio-info">
                          <p className="pd-afil-beneficio-titulo">{b.titulo}</p>
                          <p className="pd-afil-beneficio-prov">{b.proveedor}</p>
                          <p className="pd-afil-beneficio-valor">{b.valor}</p>
                        </div>
                        <div className="pd-afil-beneficio-codigo">
                          <code>{b.codigoPromo}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Referidos ── */}
          <ReferidosPanel
            uid={user.uid}
            displayName={user.displayName}
            puntuacion={puntuacion}
            onPuntuacionChanged={() => bump()}
          />

        </div>
      </IonContent>
    </IonPage>
  );
}
