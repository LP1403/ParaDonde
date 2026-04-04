import { useNavigate } from 'react-router-dom';
import { clearAventuraProgress } from '../../logic/aventuraStorage';

type Props = {
  /** Si true, limpia progreso antes de ir a /aventura (nueva partida). */
  resetAventura?: boolean;
};

export function HomeBottomCta({ resetAventura }: Props) {
  const navigate = useNavigate();

  return (
    <div className="pd-home-hub-bottom-cta-wrap">
      <button
        type="button"
        className="pd-hero-cta pd-home-hub-bottom-cta"
        onClick={() => {
          if (resetAventura) clearAventuraProgress();
          navigate('/aventura');
        }}
      >
        ✨ Crear nueva aventura
      </button>
    </div>
  );
}
