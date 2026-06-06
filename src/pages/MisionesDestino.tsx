import { useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';
import { useAuth } from '../context/AuthContext';
import { MisionCard } from '../components/reputacion/MisionCard';
import { BeneficioCard } from '../components/reputacion/BeneficioCard';
import { NivelBadge } from '../components/reputacion/NivelBadge';
import { CelebracionModal } from '../components/reputacion/CelebracionModal';
import {
  getPuntuacionLocal,
  getMisionesCompletadasLocal,
  completarMision,
} from '../logic/puntuacionStorage';
import { getNivelParaPuntos } from '../data/reputacion';
import { getBeneficiosPorNivel } from '../data/beneficios';
import { getMisionesPorDestino } from '../data/misiones';
import { getDestinoBySlug } from '../data/destinos';
import { NIVELES_REPUTACION } from '../data/reputacion';
import type { NivelMetal } from '../data/reputacion';

export default function MisionesDestino() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { user, ready } = useAuth();
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const [celebracion, setCelebracion] = useState<{ puntosGanados: number; totalPuntos: number } | null>(null);

  const destino = slug ? getDestinoBySlug(slug) : null;
  const misiones = slug ? getMisionesPorDestino(slug) : [];

  useEffect(() => {
    if (destino) document.title = `Misiones en ${destino.nombre} – Para Dónde?`;
  }, [destino]);

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
          <div className="pd-content pd-subpage-inner"><p className="pd-auth-lead">Cargando…</p></div>
        </IonContent>
      </IonPage>
    );
  }

  if (!destino || !slug) {
    return (
      <IonPage>
        <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
        <IonContent {...ionScrollProps} className="ion-padding">
          <div className="pd-content pd-subpage-inner">
            <p className="pd-auth-lead">Destino no encontrado.</p>
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
            <h1 className="pd-auth-page-title">Misiones en {destino.nombre}</h1>
            <p className="pd-auth-lead">
              Iniciá sesión para completar misiones, acumular puntos y acceder a beneficios exclusivos.
            </p>
            <div className="pd-auth-form pd-cuenta-auth-choice">
              <Link to="/login" className="pd-auth-submit">Iniciar sesión</Link>
              <Link to="/registro" className="pd-auth-submit pd-auth-submit--outline">Crear cuenta</Link>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const puntuacion = getPuntuacionLocal();
  const misionesCompletadas = getMisionesCompletadasLocal();
  const totalPuntos = puntuacion?.totalPuntos ?? 0;
  const nivel = getNivelParaPuntos(totalPuntos);
  const beneficios = getBeneficiosPorNivel(nivel.id);
  const todosBeneficios = getBeneficiosPorNivel('diamante');

  const handleCompletar = async (misionId: string, puntosGanados: number, fotoThumb?: string) => {
    await completarMision(user.uid, misionId, slug, puntosGanados, fotoThumb);
    const totalActual = getPuntuacionLocal()?.totalPuntos ?? 0;
    setCelebracion({ puntosGanados, totalPuntos: totalActual });
    bump();
  };

  const completadasCount = misiones.filter((m) => Boolean(misionesCompletadas[m.id])).length;
  const totalPuntosMisiones = misiones
    .filter((m) => Boolean(misionesCompletadas[m.id]))
    .reduce((acc, m) => acc + m.puntos, 0);

  // Agrupar por dificultad
  const faciles = misiones.filter((m) => m.dificultad === 'facil');
  const medias = misiones.filter((m) => m.dificultad === 'medio');
  const dificiles = misiones.filter((m) => m.dificultad === 'dificil');

  const nivelesOrden: NivelMetal[] = ['bronce', 'plata', 'oro', 'platino', 'diamante'];

  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
      {celebracion && destino && (
        <CelebracionModal
          puntosGanados={celebracion.puntosGanados}
          totalPuntos={celebracion.totalPuntos}
          destinoNombre={destino.nombre}
          onClose={() => setCelebracion(null)}
        />
      )}
      <IonContent {...ionScrollProps} className="ion-padding">
        <div className="pd-content pd-subpage-inner pd-misiones-page">

          {/* Header */}
          <div className="pd-misiones-header">
            <p className="pd-misiones-pais">{destino.pais ?? 'Argentina'}</p>
            <h1 className="pd-misiones-titulo">{destino.nombre}</h1>
            <div className="pd-misiones-stats">
              <span className="pd-misiones-stat">
                {completadasCount}/{misiones.length} completadas
              </span>
              <span className="pd-misiones-stat-sep" aria-hidden>·</span>
              <span className="pd-misiones-stat">{totalPuntosMisiones} pts ganados</span>
            </div>
            {misiones.length > 0 && (
              <div className="pd-misiones-prog-wrap">
                <div
                  className="pd-misiones-prog-bar"
                  style={{ width: `${(completadasCount / misiones.length) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Nivel actual global */}
          <NivelBadge nivel={nivel} puntos={totalPuntos} mostrarProgreso className="pd-misiones-nivel-badge" />

          {/* Misiones */}
          <section className="pd-misiones-section">
            <h2 className="pd-misiones-section-title">Misiones disponibles</h2>

            {misiones.length === 0 ? (
              <p className="pd-rep-empty-text">
                Todavía no hay misiones para este destino. Volvé pronto.
              </p>
            ) : (
              <>
                {faciles.length > 0 && (
                  <div className="pd-misiones-grupo">
                    <h3 className="pd-misiones-grupo-titulo">
                      <span className="pd-misiones-dif-dot pd-misiones-dif-dot--facil" aria-hidden /> Fáciles (+150 pts)
                    </h3>
                    <div className="pd-misiones-grid">
                      {faciles.map((m) => (
                        <MisionCard
                          key={m.id}
                          mision={m}
                          completada={Boolean(misionesCompletadas[m.id])}
                          fotoThumb={misionesCompletadas[m.id]?.fotoThumb}
                          uid={user.uid}

                          onCompletar={(foto) => handleCompletar(m.id, m.puntos, foto)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {medias.length > 0 && (
                  <div className="pd-misiones-grupo">
                    <h3 className="pd-misiones-grupo-titulo">
                      <span className="pd-misiones-dif-dot pd-misiones-dif-dot--medio" aria-hidden /> Medias (+250 pts)
                    </h3>
                    <div className="pd-misiones-grid">
                      {medias.map((m) => (
                        <MisionCard
                          key={m.id}
                          mision={m}
                          completada={Boolean(misionesCompletadas[m.id])}
                          fotoThumb={misionesCompletadas[m.id]?.fotoThumb}
                          uid={user.uid}

                          onCompletar={(foto) => handleCompletar(m.id, m.puntos, foto)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {dificiles.length > 0 && (
                  <div className="pd-misiones-grupo">
                    <h3 className="pd-misiones-grupo-titulo">
                      <span className="pd-misiones-dif-dot pd-misiones-dif-dot--dificil" aria-hidden /> Difíciles (+400 pts)
                    </h3>
                    <div className="pd-misiones-grid">
                      {dificiles.map((m) => (
                        <MisionCard
                          key={m.id}
                          mision={m}
                          completada={Boolean(misionesCompletadas[m.id])}
                          fotoThumb={misionesCompletadas[m.id]?.fotoThumb}
                          uid={user.uid}

                          onCompletar={(foto) => handleCompletar(m.id, m.puntos, foto)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Beneficios */}
          <section className="pd-misiones-beneficios-section">
            <h2 className="pd-misiones-section-title">Beneficios por nivel</h2>
            <p className="pd-misiones-beneficios-lead">
              Acumulá puntos para desbloquear beneficios en {destino.nombre} y en toda la red.
            </p>

            {/* Tabs de nivel */}
            <div className="pd-misiones-beneficios-niveles">
              {nivelesOrden.map((nid) => {
                const nivelDef = NIVELES_REPUTACION.find((n) => n.id === nid)!;
                const desbloqueado = nivelesOrden.indexOf(nivel.id) >= nivelesOrden.indexOf(nid);
                const beneficiosNivel = todosBeneficios.filter((b) => b.nivelMinimo === nid);
                if (beneficiosNivel.length === 0) return null;
                return (
                  <div
                    key={nid}
                    className={`pd-misiones-nivel-bloque ${desbloqueado ? 'pd-misiones-nivel-bloque--desbloqueado' : 'pd-misiones-nivel-bloque--bloqueado'}`}
                    style={{ '--nivel-color': nivelDef.color } as React.CSSProperties}
                  >
                    <div className="pd-misiones-nivel-bloque-header">
                      <span aria-hidden>{nivelDef.emoji}</span>
                      <strong>{nivelDef.nombre}</strong>
                      {!desbloqueado && (
                        <span className="pd-misiones-nivel-bloque-lock" aria-hidden>🔒</span>
                      )}
                    </div>
                    <div className="pd-misiones-beneficios-grid">
                      {beneficiosNivel.map((b) => (
                        <BeneficioCard key={b.id} beneficio={b} desbloqueado={desbloqueado} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="pd-misiones-footer-link">
            <Link to="/reputacion" className="pd-rep-link">← Volver a Mi reputación</Link>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
