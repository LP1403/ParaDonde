type Props = {
  variant: 'cold' | 'hub';
  isDark: boolean;
  heroSrc: string;
  imgKey: string;
  onImgError: () => void;
  /** Hub: primer nombre o "viajero" */
  greetingFirstName?: string;
  hasActiveAventura?: boolean;
  /** Cold: scroll to wizard. Hub: navigate o scroll a tarjeta activa */
  onColdCta: () => void;
  onHubPrimaryCta: () => void;
  /** Hub: si hay destinos guardados, segundo CTA que scrollea a la sección */
  showMisDestinos?: boolean;
  onMisDestinos?: () => void;
};

export function HomeHeroHub({
  variant,
  isDark,
  heroSrc,
  imgKey,
  onImgError,
  greetingFirstName = 'viajero',
  hasActiveAventura = false,
  onColdCta,
  onHubPrimaryCta,
  showMisDestinos = false,
  onMisDestinos,
}: Props) {
  const isCold = variant === 'cold';

  return (
    <section className="pd-hero-v2" aria-labelledby="home-hero-title">
      <img
        key={imgKey}
        className="pd-hero-bg-img"
        src={heroSrc}
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={onImgError}
      />
      <div className={`pd-hero-overlay pd-hero-overlay--${isDark ? 'dark' : 'light'}`} />
      <div className="pd-hero-body">
        {isCold ? (
          <>
            <h1 id="home-hero-title" className="pd-hero-title">
              ¿Para dónde?
            </h1>
            <p className="pd-hero-subtitle">
              Descubrí tu próximo viaje en menos de <strong>60 segundos</strong>
            </p>
            <button type="button" className="pd-hero-cta" onClick={onColdCta}>
              ✨ Empezar mi aventura
            </button>
          </>
        ) : (
          <>
            <h1 id="home-hero-title" className="pd-hero-title">
              Hola, {greetingFirstName} <span aria-hidden>✨</span>
            </h1>
            <p className="pd-hero-subtitle">¿Listo para tu próxima aventura?</p>
            <div className="pd-hero-cta-stack">
              <button type="button" className="pd-hero-cta" onClick={onHubPrimaryCta}>
                {hasActiveAventura ? 'Continuar aventura' : 'Empezar nueva aventura'}
              </button>
              {showMisDestinos && onMisDestinos ? (
                <button
                  type="button"
                  className="pd-hero-cta pd-hero-cta--secondary"
                  onClick={onMisDestinos}
                >
                  Mis destinos
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
      {isCold ? (
        <>
          <button
            className="pd-scroll-indicator"
            onClick={onColdCta}
            aria-label="Ir a la sección de aventura"
          >
            ↓
          </button>
        </>
      ) : null}
    </section>
  );
}
