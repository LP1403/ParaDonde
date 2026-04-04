import { useNavigate } from 'react-router-dom';

const BASE_QS = {
  origen_pais: 'ar',
  edad_viajero: 'adulto_18_64',
  compania: 'pareja',
  comida_pref: 'parrilla',
  presupuesto: 'medio',
  temporada: 'flexible',
  presupuesto_ars: '600000',
} as const;

const ITEMS = [
  { label: 'Playa', icon: '🏖️', experiencia: 'playa_relax' },
  { label: 'Montaña', icon: '⛰️', experiencia: 'montana_naturaleza' },
  { label: 'Ciudad', icon: '🏙️', experiencia: 'ciudad_cultura' },
  { label: 'Fiesta', icon: '🎉', experiencia: 'aventura_deporte' },
] as const;

export function HomeExploreCategories() {
  const navigate = useNavigate();

  return (
    <section className="pd-home-hub-section" aria-labelledby="pd-hub-explore-title">
      <h2 id="pd-hub-explore-title" className="pd-home-hub-section-title pd-home-hub-section-title--solo">
        Explorar
      </h2>
      <div className="pd-home-hub-cat-row" role="list">
        {ITEMS.map((item) => (
          <button
            key={item.experiencia}
            type="button"
            role="listitem"
            className="pd-home-hub-cat-btn"
            onClick={() => {
              const params = new URLSearchParams({
                ...BASE_QS,
                experiencia: item.experiencia,
              });
              navigate(`/aventura/resultado?${params.toString()}`);
            }}
          >
            <span className="pd-home-hub-cat-icon" aria-hidden>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
