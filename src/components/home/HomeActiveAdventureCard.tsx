import { useNavigate } from 'react-router-dom';
import type { AventuraProgress } from '../../logic/aventuraStorage';

type Props = {
  progress: AventuraProgress;
  totalPasos: number;
};

export function HomeActiveAdventureCard({ progress, totalPasos }: Props) {
  const navigate = useNavigate();
  const pasoUi = progress.pasoActual + 1;
  const cover =
    progress.lastCoverUrl ??
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80';

  return (
    <section className="pd-home-hub-section pd-home-hub-active-wrap" aria-labelledby="pd-hub-active-title">
      <h2 id="pd-hub-active-title" className="pd-home-hub-section-title pd-home-hub-section-title--solo">
        Tu aventura activa
      </h2>
      <div className="pd-home-hub-active-card">
        <div
          className="pd-home-hub-active-cover"
          style={{ backgroundImage: `url(${cover})` }}
        >
          <div className="pd-home-hub-active-cover-overlay" />
          <div className="pd-home-hub-active-inner">
            <p className="pd-home-hub-active-kicker">En progreso</p>
            <p className="pd-home-hub-active-step">
              Paso {pasoUi} de {totalPasos}
            </p>
            <div className="pd-home-hub-active-dots" aria-hidden>
              {Array.from({ length: totalPasos }).map((_, i) => (
                <span
                  key={i}
                  className={`pd-home-hub-active-dot${
                    i < progress.pasoActual ? ' pd-home-hub-active-dot--done' : ''
                  }${i === progress.pasoActual ? ' pd-home-hub-active-dot--on' : ''}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="pd-home-hub-active-cta"
              onClick={() => navigate('/aventura')}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
