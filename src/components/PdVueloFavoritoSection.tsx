import { useCallback, useEffect, useState } from 'react';
import { isFavoriteDestino } from '../logic/destinosFavoritosStorage';
import {
  clearVuelosFavoritos,
  getVuelosFavoritos,
  removeVueloFavorito,
  upsertVueloFavorito,
  type VueloFavoritoDisplay,
  type VueloFavoritoGuardado,
} from '../logic/vueloFavoritoStorage';
import { getDestinoBySlug } from '../data/destinos';
import { vueloCoincideConDestino } from '../logic/vueloDestinoCoincidencia';
import {
  fetchFlightByIata,
  getAviationStackAccessKey,
  normalizeFlightIata,
  rowToDisplay,
} from '../services/aviationStack';

type Props = {
  destinoSlug: string;
};

function localDateYmd(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const STATUS_ES: Record<string, string> = {
  scheduled: 'Programado',
  active: 'En vuelo',
  landed: 'Aterrizó',
  cancelled: 'Cancelado',
  incident: 'Incidencia',
  diverted: 'Desviado',
  unknown: 'Sin estado',
};

function fmtDateAr(ymd: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return ymd;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

function fmtClock24(iso?: string): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return null;
  }
}

function fmtTimeHs(iso?: string): string | null {
  const t = fmtClock24(iso);
  return t ? `${t} hs` : null;
}

function fmtUpdatedClock(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return '';
  }
}

function formatFlightLabel(iataFull: string): string {
  const s = iataFull.replace(/\s/g, '').toUpperCase();
  if (s.length >= 3) return `${s.slice(0, 2)} ${s.slice(2)}`;
  return s;
}

function isDepartureDelayed(d: VueloFavoritoDisplay): boolean {
  if (d.depDelayMin != null && d.depDelayMin > 0) return true;
  if (d.depScheduled && d.depEstimated) {
    const t1 = new Date(d.depScheduled).getTime();
    const t2 = new Date(d.depEstimated).getTime();
    if (!Number.isNaN(t1) && !Number.isNaN(t2) && t2 > t1 + 90 * 1000) return true;
  }
  return false;
}

function statusCssClass(status: string): string {
  const s = status.toLowerCase();
  if (['scheduled', 'active', 'landed', 'cancelled', 'incident', 'diverted', 'unknown'].includes(s)) return s;
  return 'unknown';
}

function VueloSnapshotCard({
  d,
  updatedAt,
  onRefresh,
  refreshing,
  refreshDisabled,
  onRemove,
}: {
  d: VueloFavoritoDisplay;
  updatedAt: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  refreshDisabled?: boolean;
  onRemove?: () => void;
}) {
  const sc = statusCssClass(d.status);
  const statusLabel = STATUS_ES[sc] ?? d.status;
  const delayed = isDepartureDelayed(d);
  const partidaClock = fmtClock24(d.depScheduled);
  const demoradoClock = delayed ? fmtClock24(d.depEstimated ?? d.depScheduled) : null;
  const llegadaHs = fmtTimeHs(d.arrEstimated ?? d.arrScheduled);
  const updatedClock = fmtUpdatedClock(updatedAt);
  const flightLabel = formatFlightLabel(d.flightIata);
  const airlineLine = [d.airlineName, d.airlineIata && `(${d.airlineIata})`].filter(Boolean).join(' ');

  const metaItems: { k: string; v: string }[] = [];
  if (d.depTerminal?.trim()) metaItems.push({ k: 'Terminal', v: d.depTerminal.trim() });
  if (d.depGate?.trim()) metaItems.push({ k: 'Puerta', v: d.depGate.trim() });

  return (
    <div className="pd-vuelo-card">
      <div className="pd-vuelo-card-head">
        <div className="pd-vuelo-card-airline">
          {airlineLine ? <span className="pd-vuelo-card-airline-name">{airlineLine}</span> : null}
          <span className="pd-vuelo-card-flight-num">{flightLabel}</span>
        </div>
        {updatedClock ? (
          <p className="pd-vuelo-card-updated">
            Actualizado {updatedClock}
            <span className="pd-vuelo-card-updated-icon" aria-hidden>
              ↻
            </span>
          </p>
        ) : null}
      </div>

      <p className="pd-vuelo-card-date">{fmtDateAr(d.flightDate)}</p>

      <div className="pd-vuelo-card-route">
        <div className="pd-vuelo-card-end">
          <span className="pd-vuelo-card-iata">{d.depIata ?? '—'}</span>
          <span className="pd-vuelo-card-airport-name">{d.depAirport ?? ''}</span>
        </div>
        <div className="pd-vuelo-card-track" aria-hidden>
          <span className="pd-vuelo-card-track-dots" />
          <span className="pd-vuelo-card-plane">✈</span>
          <span className="pd-vuelo-card-track-dots" />
        </div>
        <div className="pd-vuelo-card-end pd-vuelo-card-end--arr">
          <span className="pd-vuelo-card-iata">{d.arrIata ?? '—'}</span>
          <span className="pd-vuelo-card-airport-name">{d.arrAirport ?? ''}</span>
        </div>
      </div>

      <div className="pd-vuelo-card-times">
        <div className="pd-vuelo-card-partida">
          {partidaClock ? (
            <>
              <span className="pd-vuelo-card-partida-lbl">Partida</span>{' '}
              <strong className="pd-vuelo-card-partida-time">{partidaClock} hs</strong>
            </>
          ) : (
            <span className="pd-vuelo-card-partida-lbl">Horario de salida pendiente</span>
          )}
        </div>
        {delayed && demoradoClock ? (
          <span className="pd-vuelo-card-badge pd-vuelo-card-badge--delay">Demorado {demoradoClock}</span>
        ) : (
          <span className={`pd-vuelo-card-badge pd-vuelo-fav-status pd-vuelo-fav-status--${sc}`}>
            {statusLabel}
          </span>
        )}
      </div>

      {llegadaHs ? (
        <p className="pd-vuelo-card-llegada">
          Llegada estimada <strong>{llegadaHs}</strong>
          {d.arrIata ? <span className="pd-vuelo-card-llegada-iata"> · {d.arrIata}</span> : null}
        </p>
      ) : null}

      {metaItems.length > 0 ? (
        <div className="pd-vuelo-card-meta-row">
          {metaItems.map((item) => (
            <div key={item.k} className="pd-vuelo-card-meta-cell">
              <span className="pd-vuelo-card-meta-k">{item.k}</span>
              <span className="pd-vuelo-card-meta-v">{item.v}</span>
            </div>
          ))}
        </div>
      ) : null}

      {(d.arrTerminal?.trim() || d.arrGate?.trim()) && (
        <div className="pd-vuelo-card-meta-row pd-vuelo-card-meta-row--arr">
          {d.arrTerminal?.trim() ? (
            <div className="pd-vuelo-card-meta-cell">
              <span className="pd-vuelo-card-meta-k">Llegada · terminal</span>
              <span className="pd-vuelo-card-meta-v">{d.arrTerminal.trim()}</span>
            </div>
          ) : null}
          {d.arrGate?.trim() ? (
            <div className="pd-vuelo-card-meta-cell">
              <span className="pd-vuelo-card-meta-k">Llegada · puerta</span>
              <span className="pd-vuelo-card-meta-v">{d.arrGate.trim()}</span>
            </div>
          ) : null}
        </div>
      )}

      {onRefresh || onRemove ? (
        <div className="pd-vuelo-card-footer">
          {onRefresh ? (
            <button
              type="button"
              className="pd-vuelo-card-refresh"
              disabled={Boolean(refreshDisabled || refreshing)}
              onClick={() => onRefresh()}
            >
              {refreshing ? 'Actualizando…' : 'Actualizar datos'}
            </button>
          ) : null}
          {onRemove ? (
            <button type="button" className="pd-vuelo-card-remove" onClick={onRemove}>
              Quitar este vuelo
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function prefillFormFromList(list: VueloFavoritoGuardado[]): { flight: string; date: string } {
  if (list.length === 1) {
    return { flight: list[0].flightIata, date: list[0].flightDate };
  }
  return { flight: '', date: localDateYmd() };
}

export function PdVueloFavoritoSection({ destinoSlug }: Props) {
  const [isFav, setIsFav] = useState(() => isFavoriteDestino(destinoSlug));
  const initialList = getVuelosFavoritos(destinoSlug);
  const initialForm = prefillFormFromList(initialList);
  const [flightInput, setFlightInput] = useState(initialForm.flight);
  const [dateInput, setDateInput] = useState(initialForm.date);
  const [loading, setLoading] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [savedList, setSavedList] = useState<VueloFavoritoGuardado[]>(initialList);

  const persistFetchedFlight = useCallback(
    async (
      iata: string,
      dateYmd: string,
    ): Promise<{ ok: true } | { ok: false; error: string }> => {
      const { row, errorMessage } = await fetchFlightByIata(iata, dateYmd);
      if (!row) {
        return { ok: false, error: errorMessage ?? 'No se pudo obtener la información.' };
      }
      const destino = getDestinoBySlug(destinoSlug);
      if (destino && !vueloCoincideConDestino(destino, row)) {
        return {
          ok: false,
          error:
            'Este vuelo no corresponde a este destino: en la salida o en la llegada no figura este lugar. Revisá el número o guardalo desde la ficha correcta.',
        };
      }
      const display = rowToDisplay(row, iata, dateYmd);
      upsertVueloFavorito(destinoSlug, {
        flightIata: iata,
        flightDate: dateYmd,
        updatedAt: new Date().toISOString(),
        display,
      });
      setSavedList(getVuelosFavoritos(destinoSlug));
      return { ok: true };
    },
    [destinoSlug],
  );

  const syncFromStorage = useCallback(() => {
    setIsFav(isFavoriteDestino(destinoSlug));
    const list = getVuelosFavoritos(destinoSlug);
    setSavedList(list);
    const { flight, date } = prefillFormFromList(list);
    setFlightInput(flight);
    setDateInput(date);
    setErr(null);
  }, [destinoSlug]);

  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  useEffect(() => {
    const h = () => syncFromStorage();
    window.addEventListener('pd-favoritos-changed', h);
    window.addEventListener('pd-vuelo-favorito-changed', h);
    return () => {
      window.removeEventListener('pd-favoritos-changed', h);
      window.removeEventListener('pd-vuelo-favorito-changed', h);
    };
  }, [syncFromStorage]);

  if (!destinoSlug.trim() || !isFav) return null;

  const hasKey = Boolean(getAviationStackAccessKey());

  const runFetch = async () => {
    setErr(null);
    const iata = normalizeFlightIata(flightInput);
    if (!iata) {
      setErr('Ingresá el código del vuelo (ej. AR1304, LA800).');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      setErr('Elegí una fecha válida.');
      return;
    }
    setLoading(true);
    try {
      const r = await persistFetchedFlight(iata, dateInput);
      if (!r.ok) {
        setErr(r.error);
        return;
      }
      setFlightInput('');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCard = async (v: VueloFavoritoGuardado) => {
    setErr(null);
    setRefreshingId(v.id);
    try {
      const r = await persistFetchedFlight(v.flightIata, v.flightDate);
      if (!r.ok) setErr(r.error);
    } finally {
      setRefreshingId(null);
    }
  };

  const handleRemoveOne = (id: string) => {
    removeVueloFavorito(destinoSlug, id);
    const next = getVuelosFavoritos(destinoSlug);
    setSavedList(next);
    const { flight, date } = prefillFormFromList(next);
    setFlightInput(flight);
    setDateInput(date);
    setErr(null);
  };

  const handleClearAll = () => {
    clearVuelosFavoritos(destinoSlug);
    setSavedList([]);
    setErr(null);
    setFlightInput('');
    setDateInput(localDateYmd());
  };

  return (
    <div className="pd-destino-glass-section pd-vuelo-fav-section">
      <h2 className="pd-destino-glass-title">✈️ Tus vuelos</h2>

      {savedList.length > 0 ? (
        <div className="pd-vuelo-fav-cards">
          {savedList.map((v) => (
            <VueloSnapshotCard
              key={v.id}
              d={v.display}
              updatedAt={v.updatedAt}
              onRefresh={hasKey ? () => void handleRefreshCard(v) : undefined}
              refreshing={refreshingId === v.id}
              refreshDisabled={loading}
              onRemove={() => handleRemoveOne(v.id)}
            />
          ))}
        </div>
      ) : null}

      <div className="pd-vuelo-fav-form">
        <p className="pd-destino-doc-lead pd-vuelo-fav-lead">
          Podés sumar varios vuelos (ida, vuelta u otras piernas): consultá con el número y la fecha. Si repetís el
          mismo vuelo y fecha, se actualiza. Todo queda guardado solo en este dispositivo.
        </p>
        <label className="pd-vuelo-fav-label" htmlFor="pd-vuelo-iata">
          Número de vuelo
        </label>
        <input
          id="pd-vuelo-iata"
          className="pd-vuelo-fav-input"
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          placeholder="ej. AR1304"
          value={flightInput}
          onChange={(e) => setFlightInput(e.target.value)}
          disabled={loading || !hasKey}
        />
        <label className="pd-vuelo-fav-label" htmlFor="pd-vuelo-date">
          Fecha del vuelo
        </label>
        <input
          id="pd-vuelo-date"
          className="pd-vuelo-fav-input"
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          disabled={loading || !hasKey}
        />
        <div className="pd-vuelo-fav-actions">
          <button
            type="button"
            className="pd-vuelo-fav-btn-primary"
            disabled={loading || !hasKey}
            onClick={() => void runFetch()}
          >
            {loading ? 'Consultando…' : 'Guardar vuelo'}
          </button>
          {savedList.length > 0 ? (
            <div className="pd-vuelo-fav-clear-wrap">
              <button
                type="button"
                className="pd-vuelo-fav-btn-quiet pd-vuelo-fav-btn-quiet--centered"
                disabled={loading || refreshingId != null}
                onClick={handleClearAll}
              >
                Quitar todos los vuelos
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {!hasKey ? (
        <p className="pd-vuelo-fav-hint">La consulta de vuelo no está disponible en este momento.</p>
      ) : null}

      {err ? <p className="pd-vuelo-fav-error">{err}</p> : null}
    </div>
  );
}
