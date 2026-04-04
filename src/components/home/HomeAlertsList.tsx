import { Link } from 'react-router-dom';

/** Placeholder hasta API; copy breve y no intrusivo. */
const SAMPLE_ALERTS = [
  { id: '1', icon: '💱', text: 'Tip: revisá el dólar tarjeta antes de reservar.', to: '/calculadora-dolar' },
  { id: '2', icon: '🌤️', text: 'En temporada alta conviene reservar alojamiento con anticipación.', to: '/guias' },
] as const;

export function HomeAlertsList() {
  return (
    <section className="pd-home-hub-section" aria-label="Avisos">
      <h2 className="pd-home-hub-section-title pd-home-hub-section-title--solo">Actualizaciones</h2>
      <ul className="pd-home-hub-alerts">
        {SAMPLE_ALERTS.map((a) => (
          <li key={a.id}>
            <Link to={a.to} className="pd-home-hub-alert">
              <span className="pd-home-hub-alert-icon" aria-hidden>
                {a.icon}
              </span>
              <span className="pd-home-hub-alert-text">{a.text}</span>
              <span className="pd-home-hub-alert-chevron" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
