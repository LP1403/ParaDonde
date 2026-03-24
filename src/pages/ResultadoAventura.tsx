import { useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { shieldCheckmarkOutline } from 'ionicons/icons';
import { destinos } from '../data/destinos';
import { filtrarDestinosPorRespuestas } from '../logic/motorAventura';
import { generarFeedback } from '../logic/motorAventuraDinamico';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { DestinoResultadoBlock } from '../components/DestinoResultadoBlock';
import { scrollElementToTopInScrollParent } from '../utils/scrollIntoScrollParent';
import type { Destino } from '../data/destinos';

/* ─────────────────────────────────────────── Seguro Block ── */

const SEGUROS = [
  {
    nombre: 'Assist Card',
    logo: '🛡️',
    desc: 'Cobertura médica integral',
    url: 'https://www.assistcard.com/ar?utm_source=paradonde',
  },
  {
    nombre: 'Universal',
    logo: '🌐',
    desc: 'Asistencia global 24h',
    url: 'https://www.universal-assistance.com/?utm_source=paradonde',
  },
  {
    nombre: 'AXA',
    logo: '🔵',
    desc: 'Seguro internacional',
    url: 'https://www.axa-asistenciaviaje.com.ar/?utm_source=paradonde',
  },
];

export function SeguroBlock({ forDestino }: { forDestino?: Destino }) {
  const showSeguro = !forDestino || forDestino.documentacion.seguroRecomendado || forDestino.region !== 'argentina';
  if (!showSeguro) return null;

  return (
    <div className="pd-seguro-block">
      <div className="pd-seguro-header">
        <IonIcon icon={shieldCheckmarkOutline} className="pd-seguro-icon" />
        <div>
          <p className="pd-seguro-title">Protegé tu viaje ante imprevistos</p>
          <p className="pd-seguro-sub">Un seguro de viaje te cubre si algo sale mal.</p>
        </div>
      </div>
      <div className="pd-seguro-benefits">
        {['Cobertura médica de emergencia', 'Cancelaciones e interrupciones', 'Pérdida de equipaje'].map((b) => (
          <span key={b} className="pd-seguro-benefit">
            <span className="pd-seguro-benefit-dot">✓</span> {b}
          </span>
        ))}
      </div>
      <div className="pd-seguro-ctas">
        {SEGUROS.map((s) => (
          <a
            key={s.nombre}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pd-seguro-company"
            aria-label={`Cotizar con ${s.nombre}`}
          >
            <span className="pd-seguro-company-logo">{s.logo}</span>
            <span className="pd-seguro-company-name">{s.nombre}</span>
            <span className="pd-seguro-company-desc">{s.desc}</span>
          </a>
        ))}
      </div>
      <a
        href="https://www.assistcard.com/ar?utm_source=paradonde"
        target="_blank"
        rel="noopener noreferrer"
        className="pd-seguro-cta-btn"
      >
        Cotizar seguro de viaje →
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────── ¿Por qué? Block ── */

function generarExplicacion(
  _destino: Destino,
  respuestas: Record<string, string>,
): string {
  const partes: string[] = [];

  const expMap: Record<string, string> = {
    montana_naturaleza: 'naturaleza y montaña',
    ciudad_cultura: 'ciudad y cultura',
    playa_relax: 'playa y relax',
    aventura_deporte: 'aventura y deporte',
    gastronomia_vino: 'gastronomía y vino',
    termas_relax: 'termas y relax',
  };
  if (respuestas.experiencia && expMap[respuestas.experiencia]) {
    partes.push(`buscás ${expMap[respuestas.experiencia]}`);
  }

  const compMap: Record<string, string> = {
    solo: 'viajás solo/a',
    pareja: 'viajás en pareja',
    amigos: 'viajás con amigos',
    familia: 'viajás con familia',
  };
  if (respuestas.compania && compMap[respuestas.compania]) {
    partes.push(compMap[respuestas.compania]);
  }

  const presMap: Record<string, string> = {
    economico: 'tu presupuesto es ajustado',
    medio: 'tu presupuesto es moderado',
    sin_mirar: 'tu presupuesto es amplio',
  };
  if (respuestas.presupuesto && presMap[respuestas.presupuesto]) {
    partes.push(presMap[respuestas.presupuesto]);
  }

  const ars = Number(respuestas.presupuesto_ars);
  if (Number.isFinite(ars) && ars > 0) {
    partes.push(`tu presupuesto estimado es de unos $${ars.toLocaleString('es-AR')} ARS`);
  }

  const tempMap: Record<string, string> = {
    verano: 'querés viajar en verano austral',
    otono: 'querés viajar en otoño',
    invierno: 'querés viajar en invierno austral',
    primavera: 'querés viajar en primavera',
    flexible: 'tenés fechas flexibles',
  };
  if (respuestas.temporada && tempMap[respuestas.temporada]) {
    partes.push(tempMap[respuestas.temporada]);
  }

  const diasMap: Record<string, string> = {
    fin_semana: 'solo tenés un fin de semana',
    una_semana: 'disponés de una semana',
    dos_o_mas: 'tenés dos semanas o más',
  };
  if (respuestas.dias && diasMap[respuestas.dias]) {
    partes.push(diasMap[respuestas.dias]);
  }

  if (partes.length === 0) return '';
  if (partes.length === 1) return `Porque ${partes[0]}.`;
  const last = partes.pop()!;
  return `Porque ${partes.join(', ')} y ${last}.`;
}

function PorQueBlock({ destino, respuestas }: { destino: Destino; respuestas: Record<string, string> }) {
  const explicacion = generarExplicacion(destino, respuestas);
  if (!explicacion) return null;
  return (
    <div className="pd-porque-block">
      <span className="pd-porque-icon">💡</span>
      <div>
        <p className="pd-porque-label">¿Por qué te recomendamos {destino.nombre}?</p>
        <p className="pd-porque-text">{explicacion}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── Page ── */

export default function ResultadoAventura() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const respuestas: Record<string, string> = {};
  searchParams.forEach((v, k) => {
    respuestas[k] = v;
  });

  const sugeridos = filtrarDestinosPorRespuestas(destinos, respuestas);
  const feedbackIntro = generarFeedback(respuestas, sugeridos);

  const diasSeleccionados = respuestas['dias'];
  const temporadaSel = respuestas['temporada'];
  const descripcionDuracion =
    temporadaSel === 'verano'
      ? 'un viaje en verano austral'
      : temporadaSel === 'otono'
        ? 'un viaje en otoño'
        : temporadaSel === 'invierno'
          ? 'un viaje en invierno austral'
          : temporadaSel === 'primavera'
            ? 'un viaje en primavera'
            : temporadaSel === 'flexible'
              ? 'un viaje con fechas flexibles'
              : diasSeleccionados === 'fin_semana'
                ? 'una escapada corta de fin de semana'
                : diasSeleccionados === 'una_semana'
                  ? 'un viaje de alrededor de una semana'
                  : diasSeleccionados === 'dos_o_mas'
                    ? 'un viaje más largo, de dos semanas o más'
                    : 'un viaje según tus preferencias';

  const hayInternacional = sugeridos.some((d) => d.region !== 'argentina');

  const primerDestinoWrapRef = useRef<HTMLDivElement>(null);

  const irAPrimerDestino = () => {
    scrollElementToTopInScrollParent(primerDestinoWrapRef.current);
  };

  useEffect(() => {
    document.title = 'Tu resultado – Para Dónde?';
  }, []);

  const haySugeridos = sugeridos.length > 0;

  return (
    <IonPage className="pd-destino-page">
      <PdSubpageChrome onBack={() => navigate('/')} />
      <IonContent fullscreen className="pd-resultado-ion-content">
        {/* Hero inicial: sin spoilers (sin nombres ni fotos de destinos) */}
        <section className="pd-resultado-list-hero" aria-labelledby="pd-resultado-list-hero-title">
          <div className="pd-resultado-list-hero-bg" aria-hidden="true" />
          <div className="pd-resultado-list-hero-inner">
            <p className="pd-resultado-list-hero-kicker">
              {haySugeridos ? '✨ Listo' : 'Ups'}
            </p>
            <h1 id="pd-resultado-list-hero-title" className="pd-resultado-list-hero-title">
              {haySugeridos ? 'Tenemos ideas para tu próximo viaje' : 'No encontramos coincidencias claras'}
            </h1>
            <p className="pd-resultado-list-hero-lead">
              {haySugeridos ? (
                <>
                  Armamos opciones con lo que contaste
                  {descripcionDuracion !== 'un viaje según tus preferencias'
                    ? ` (pensando en ${descripcionDuracion})`
                    : ''}
                  . Abajo están las fichas completas: mapas, fotos y tips.{' '}
                  <strong>Sin spoilearte nada desde acá.</strong>
                </>
              ) : (
                <>
                  Probá ajustar presupuesto, época o tipo de viaje en el inicio. A veces un pequeño cambio
                  abre destinos que no habíamos puesto arriba del todo.
                </>
              )}
            </p>
            {haySugeridos ? (
              <button type="button" className="pd-resultado-list-hero-cta" onClick={irAPrimerDestino}>
                <span>¡Tus destinos!</span>
                <span className="pd-resultado-list-hero-cta-arrow pd-resultado-list-hero-cta-arrow--bounce" aria-hidden>
                  ↓
                </span>
              </button>
            ) : (
              <Link to="/" className="pd-resultado-list-hero-cta pd-resultado-list-hero-cta--link">
                <span>Volver a elegir aventura</span>
                <span className="pd-resultado-list-hero-cta-arrow" aria-hidden>
                  →
                </span>
              </Link>
            )}
          </div>
        </section>

        <div className="pd-resultado-page-intro pd-subpage-inner">
          <h2
            style={{
              marginBottom: '0.35rem',
              color: 'var(--pd-color-text)',
              fontSize: '1.35rem',
            }}
          >
            Tu resultado
          </h2>
          <p
            style={{
              marginBottom: '0.75rem',
              color: 'var(--pd-color-text-muted)',
              fontSize: '0.9rem',
              lineHeight: 1.45,
            }}
          >
            <strong style={{ color: 'var(--pd-color-text)' }}>Destinos sugeridos para vos.</strong>{' '}
            Pensando en {descripcionDuracion}, estos lugares encajan con tu forma de viajar.
          </p>
          {feedbackIntro && (
            <p
              style={{
                marginBottom: '0.5rem',
                color: 'var(--pd-color-text)',
                fontSize: '0.95rem',
                lineHeight: 1.45,
                fontWeight: 500,
              }}
            >
              {feedbackIntro}
            </p>
          )}
        </div>

        {haySugeridos ? (
          sugeridos.map((d, idx) => (
            <div key={d.id} ref={idx === 0 ? primerDestinoWrapRef : undefined} className="pd-resultado-primer-destino-anchor">
              <DestinoResultadoBlock destino={d}>
                {idx === 0 && <PorQueBlock destino={d} respuestas={respuestas} />}
              </DestinoResultadoBlock>
            </div>
          ))
        ) : (
          <div className="pd-resultado-page-intro pd-subpage-inner" style={{ paddingBottom: '2rem' }}>
            <p style={{ color: 'var(--pd-color-text-muted)' }}>
              Si querés, tocá el botón de arriba o este enlace:{' '}
              <Link to="/">Elige tu aventura</Link>.
            </p>
          </div>
        )}

        {sugeridos.length > 0 && (
          <div className="pd-resultado-footer-wrap">
            <SeguroBlock forDestino={hayInternacional ? sugeridos[0] : undefined} />
            <Link to="/" style={{ display: 'block', marginTop: '1rem' }}>
              <IonButton fill="outline" expand="block">
                ← Volver a elegir destino
              </IonButton>
            </Link>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}
