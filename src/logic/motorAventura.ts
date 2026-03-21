import type { Destino, TagDestinoMotor } from '../data/destinos';
import { TEMPORADAS_POR_DESTINO } from '../data/destinoMetadatosMotor';
import { armarInputDesdeRespuestasUrl } from './motorAventuraDinamico';

export type RespuestasAventura = Record<string, string>;

export type TemporadaId = 'invierno' | 'primavera' | 'verano' | 'otono' | 'flexible';

export interface RangoPresupuestoARS {
  minARS: number;
  maxARS: number;
}

export interface InputMotorRecomendacion {
  experienciaId: string;
  compania: string;
  presupuestoARS: number;
  temporada: TemporadaId;
  /** Ponderación extra desde wizard dinámico (tags / región / experiencias) */
  tagsBoost?: TagDestinoMotor[];
  regionesPreferidas?: string[];
  experienciasBoost?: string[];
}

/** Tipo de viaje del UI (4 opciones) → tag canónico */
const EXPERIENCIA_A_TAG: Record<string, string> = {
  montana_naturaleza: 'naturaleza',
  ciudad_cultura: 'ciudad',
  playa_relax: 'relax',
  aventura_deporte: 'aventura',
};

/** Tags que el usuario “activa” según su elección de experiencia (incl. flujo legacy /aventura) */
export function tagsDesdeExperienciaUsuario(experienciaId: string): string[] {
  const t = EXPERIENCIA_A_TAG[experienciaId];
  if (t) return [t];
  if (experienciaId === 'gastronomia_vino') return ['ciudad'];
  if (experienciaId === 'termas_relax') return ['relax'];
  return [];
}

/** Tags del destino: explícitos o derivados de atributos.experiencia */
export function tagsDestino(d: Destino): string[] {
  if (d.tags?.length) return d.tags;
  const s = new Set<string>();
  for (const e of d.atributos.experiencia) {
    if (e === 'montana_naturaleza') s.add('naturaleza');
    if (e === 'ciudad_cultura' || e === 'gastronomia_vino') s.add('ciudad');
    if (e === 'playa_relax' || e === 'termas_relax') s.add('relax');
    if (e === 'aventura_deporte') s.add('aventura');
  }
  return [...s];
}

export function rangosPresupuestoDestino(d: Destino): RangoPresupuestoARS[] {
  if (d.presupuestoRangos?.length) {
    return d.presupuestoRangos.map((r) => ({ minARS: r.minARS, maxARS: r.maxARS }));
  }
  if (d.presupuestoEstimado) {
    return [{ minARS: d.presupuestoEstimado.minARS, maxARS: d.presupuestoEstimado.maxARS }];
  }
  return [{ minARS: 80_000, maxARS: 2_000_000 }];
}

export function temporadasDestino(d: Destino): string[] {
  if (d.temporadas?.length) return d.temporadas;
  const t = TEMPORADAS_POR_DESTINO[d.id];
  if (t?.length) return t;
  return ['todo_ano'];
}

function interseccionTags(usuario: string[], destino: string[]): boolean {
  return usuario.some((t) => destino.includes(t));
}

function puntajePresupuesto(ars: number, rangos: RangoPresupuestoARS[]): number {
  let mejor = 0;
  for (const r of rangos) {
    const { minARS: min, maxARS: max } = r;
    if (ars >= min && ars <= max) mejor = Math.max(mejor, 28);
    else if (ars >= min * 0.72 && ars <= max * 1.4) mejor = Math.max(mejor, 20);
    else if (ars >= min * 0.5) mejor = Math.max(mejor, 12);
    if (ars > max) mejor = Math.max(mejor, 18);
  }
  return mejor;
}

function puntajeTemporada(temp: TemporadaId, destTemps: string[]): number {
  if (temp === 'flexible') return 14;
  if (destTemps.includes('todo_ano')) return 14;
  if (destTemps.includes(temp)) return 14;
  return 4;
}

export interface ResultadoScored {
  destino: Destino;
  puntaje: number;
  desglose: {
    tags: number;
    compania: number;
    presupuesto: number;
    temporada: number;
    dinamico?: number;
  };
}

/** Score numérico para un destino (útil para tests / UI) */
export function calcularScore(destino: Destino, input: InputMotorRecomendacion): number {
  const r = rankearDestinos([destino], input, { max: 1 });
  return r[0]?.puntaje ?? 0;
}

/**
 * Motor principal: rankea destinos por relevancia.
 */
export function recomendarDestinos(
  lista: Destino[],
  input: InputMotorRecomendacion,
  opts?: { max?: number }
): Destino[] {
  return rankearDestinos(lista, input, opts).map((r) => r.destino);
}

export function rankearDestinos(
  lista: Destino[],
  input: InputMotorRecomendacion,
  opts?: { max?: number }
): ResultadoScored[] {
  const max = opts?.max ?? 12;
  const userTags = tagsDesdeExperienciaUsuario(input.experienciaId);
  const ars = Math.max(0, input.presupuestoARS || 0);

  const scored: ResultadoScored[] = lista.map((destino) => {
    const dTags = tagsDestino(destino);
    const rangos = rangosPresupuestoDestino(destino);
    const temps = temporadasDestino(destino);

    let pTags = 0;
    if (userTags.length === 0) pTags = 25;
    else if (interseccionTags(userTags, dTags)) pTags = 42;
    else pTags = 6;

    let pComp = 0;
    if (!input.compania) pComp = 20;
    else if (destino.atributos.compania.includes(input.compania)) pComp = 26;
    else pComp = 4;

    const pPres = puntajePresupuesto(ars, rangos);
    const pTemp = puntajeTemporada(input.temporada, temps);

    let pDin = 0;
    const boostTags = input.tagsBoost ?? [];
    for (const t of boostTags) {
      if (dTags.includes(t)) pDin += 8;
    }
    pDin = Math.min(pDin, 24);
    const boostExp = input.experienciasBoost ?? [];
    for (const e of boostExp) {
      if (destino.atributos.experiencia.includes(e)) pDin += 5;
    }
    pDin = Math.min(pDin, 38);
    const prefs = input.regionesPreferidas ?? [];
    if (prefs.length && destino.region && prefs.includes(destino.region)) {
      pDin += 14;
    }

    const puntaje = pTags + pComp + pPres + pTemp + pDin;
    return {
      destino,
      puntaje,
      desglose: {
        tags: pTags,
        compania: pComp,
        presupuesto: pPres,
        temporada: pTemp,
        dinamico: pDin,
      },
    };
  });

  scored.sort((a, b) => b.puntaje - a.puntaje);
  return scored.slice(0, max);
}

/** Convierte categoría legacy a ARS representativo */
export function categoriaPresupuestoToARS(cat?: string): number {
  if (cat === 'economico') return 150_000;
  if (cat === 'medio') return 450_000;
  if (cat === 'sin_mirar') return 2_800_000;
  return 400_000;
}

function parseTemporada(v: string | undefined): TemporadaId {
  const ok: TemporadaId[] = ['invierno', 'primavera', 'verano', 'otono', 'flexible'];
  if (v && (ok as string[]).includes(v)) return v as TemporadaId;
  return 'flexible';
}

/**
 * Compatibilidad con query params (Home + /aventura).
 * Acepta: presupuesto_ars (número), temporada, y/o legacy presupuesto + dias.
 */
export function filtrarDestinosPorRespuestas(
  todos: Destino[],
  respuestas: RespuestasAventura
): Destino[] {
  const rawArs = respuestas.presupuesto_ars;
  const parsed = rawArs != null && rawArs !== '' ? Number(rawArs) : NaN;
  const presupuestoARS = Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, 5_000_000)
    : categoriaPresupuestoToARS(respuestas.presupuesto);

  const temporada = parseTemporada(respuestas.temporada);
  const input = armarInputDesdeRespuestasUrl(respuestas, presupuestoARS, temporada);

  return recomendarDestinos(todos, input, { max: 5 });
}
