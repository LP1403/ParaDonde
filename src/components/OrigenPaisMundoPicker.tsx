import { useEffect, useMemo, useState } from 'react';
import { IonSearchbar } from '@ionic/react';
import { buscarPaisesMundo, paisMundoPorIso, type PaisMundo } from '../data/paisesMundo';

type Props = {
  onPick: (iso2: string) => void;
  onCancel: () => void;
};

function regionSugeridaDesdeLocale(): PaisMundo | null {
  try {
    const loc = Intl.DateTimeFormat().resolvedOptions().locale ?? '';
    const part = loc.split(/[-_]/)[1];
    if (!part || part.length !== 2) return null;
    return paisMundoPorIso(part) ?? null;
  } catch {
    return null;
  }
}

export function OrigenPaisMundoPicker({ onPick, onCancel }: Props) {
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const sugerido = useMemo(() => regionSugeridaDesdeLocale(), []);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q), 180);
    return () => window.clearTimeout(t);
  }, [q]);

  const lista = useMemo(() => buscarPaisesMundo(debounced, 120), [debounced]);

  return (
    <div className="pd-origen-mundo-picker" role="search">
      <div className="pd-origen-mundo-picker-head">
        <h2 className="pd-origen-mundo-picker-title">Buscá tu país</h2>
        <p className="pd-origen-mundo-picker-lead">
          Lista oficial ISO en español. No hace falta iniciar sesión ni cuenta de Google: elegís el país y listo.
        </p>
        {sugerido ? (
          <button
            type="button"
            className="pd-origen-mundo-picker-sugerencia"
            onClick={() => onPick(sugerido.iso2)}
          >
            <span className="pd-origen-mundo-picker-sugerencia-label">Sugerencia según tu sistema</span>
            <span className="pd-origen-mundo-picker-sugerencia-pais">{sugerido.nombre}</span>
          </button>
        ) : null}
      </div>

      <IonSearchbar
        className="pd-origen-mundo-search"
        value={q}
        placeholder="Nombre del país o código (ej. JP, Japón)"
        debounce={0}
        inputMode="search"
        enterkeyhint="search"
        onIonInput={(e) => setQ(String(e.detail.value ?? ''))}
      />

      <ul className="pd-origen-mundo-list" aria-label="Países">
        {lista.map((p) => (
          <li key={p.iso2}>
            <button type="button" className="pd-origen-mundo-item" onClick={() => onPick(p.iso2)}>
              <span className="pd-origen-mundo-item-iso" aria-hidden>
                {p.iso2}
              </span>
              <span className="pd-origen-mundo-item-nombre">{p.nombre}</span>
            </button>
          </li>
        ))}
      </ul>

      {lista.length === 0 ? (
        <p className="pd-origen-mundo-empty">No hay coincidencias. Probá con otro término.</p>
      ) : null}

      <button type="button" className="pd-origen-mundo-cancel" onClick={onCancel}>
        Volver a la lista corta
      </button>
    </div>
  );
}
