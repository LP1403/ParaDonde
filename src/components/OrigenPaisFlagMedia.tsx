import { flagImageUrlForOrigenPaisId } from '../utils/origenPaisFlags';

type Props = {
  opcionId: string;
  /** Clase del contenedor: `pd-origen-pais-flag` o `pd-origen-pais-resumen-flag` */
  className?: string;
};

export function OrigenPaisFlagMedia({ opcionId, className = 'pd-origen-pais-flag' }: Props) {
  const url = flagImageUrlForOrigenPaisId(opcionId);
  if (!url) {
    return (
      <span className={`${className} pd-origen-pais-flag--emoji-only`} aria-hidden>
        {opcionId === 'otros' ? '🌍' : '🏳️'}
      </span>
    );
  }
  return (
    <span className={className} aria-hidden>
      <img
        className="pd-origen-pais-flag-img"
        src={url}
        alt=""
        width={40}
        height={30}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
