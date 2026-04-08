import { useEffect, useReducer } from 'react';
import {
  isFavoriteDestino,
  toggleFavoriteDestino,
} from '../logic/destinosFavoritosStorage';

type Props = {
  slug: string;
  /** 'compact' para barras; 'full' texto largo */
  variant?: 'full' | 'compact';
  className?: string;
};

export function PdFavoritoDestinoButton({
  slug,
  variant = 'full',
  className = '',
}: Props) {
  const [, bump] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const onFav = () => bump();
    window.addEventListener('pd-favoritos-changed', onFav);
    return () => window.removeEventListener('pd-favoritos-changed', onFav);
  }, []);

  const on = slug ? isFavoriteDestino(slug) : false;

  const label =
    variant === 'compact'
      ? on
        ? 'Guardado'
        : 'Guardar'
      : on
        ? 'En Mis viajes'
        : 'Guardar en Mis viajes';

  return (
    <button
      type="button"
      className={`pd-fav-destino-btn${on ? ' pd-fav-destino-btn--on' : ''} ${className}`.trim()}
      aria-pressed={on}
      aria-label={on ? 'Quitar de Mis viajes' : 'Guardar en Mis viajes'}
      onClick={() => {
        if (!slug) return;
        toggleFavoriteDestino(slug);
        bump();
      }}
    >
      <span className="pd-fav-destino-btn-icon" aria-hidden>
        {on ? '★' : '☆'}
      </span>
      <span className="pd-fav-destino-btn-label">{label}</span>
    </button>
  );
}
