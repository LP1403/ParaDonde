import type { Destino } from '../../data/destinos';

export function fmtARSCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace('.0', '')} M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)} K`;
  return `$${n}`;
}

export function presupuestoChip(d: Destino): string | null {
  const r = d.presupuestoEstimado ?? d.presupuestoRangos?.[0];
  if (!r) return null;
  return `${fmtARSCompact(r.minARS)} – ${fmtARSCompact(r.maxARS)} ARS`;
}

export function duracionChip(d: Destino): string | null {
  const dias = d.itinerario?.duracionDias;
  if (dias == null || dias <= 0) return null;
  return `${dias} días`;
}

export function tripAdvisorChip(d: Destino): string | null {
  const ta = d.reseñasExternas?.tripadvisor;
  if (ta == null) return null;
  return `${ta.puntaje.toFixed(1)} / 5 TripAdvisor`;
}
