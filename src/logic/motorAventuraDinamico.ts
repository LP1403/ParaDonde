/**
 * Puente entre respuestas del wizard (URL / estado) y el motor de recomendación.
 */
import {
  acumularImpactoDinamico,
  buscarOpcion,
  ID_PREGUNTA_INICIO,
  preguntasDinamicas,
} from '../data/aventuraDinamica';
import type { Destino } from '../data/destinos';
import type { InputMotorRecomendacion, TemporadaId } from './motorAventura';

export function armarInputDesdeRespuestasUrl(
  respuestas: Record<string, string>,
  presupuestoARS: number,
  temporada: TemporadaId,
): InputMotorRecomendacion {
  const dyn = acumularImpactoDinamico(respuestas);
  const experienciaId =
    (respuestas.experiencia && respuestas.experiencia.trim()) || dyn.experienciaMotor;

  return {
    experienciaId,
    compania: respuestas.compania ?? '',
    presupuestoARS,
    temporada,
    tagsBoost: dyn.tagsBoost.length ? dyn.tagsBoost : undefined,
    regionesPreferidas: dyn.regionesPreferidas.length ? dyn.regionesPreferidas : undefined,
    experienciasBoost: dyn.experienciasBoost.length ? dyn.experienciasBoost : undefined,
  };
}

function labelOpcion(preguntaId: string, valor: string): string | undefined {
  return buscarOpcion(preguntaId, valor)?.label;
}

/**
 * Texto introductorio para la pantalla de resultados (tono conversacional).
 */
export function generarFeedback(
  respuestas: Record<string, string>,
  topDestinos: Destino[],
): string {
  const nombres = topDestinos.slice(0, 5).map((d) => d.nombre);
  if (nombres.length === 0) {
    return 'No encontramos coincidencias claras; probá ajustar presupuesto o época del año.';
  }

  const partes: string[] = [];
  const vibra = respuestas.vibra;
  const matiz = respuestas.matiz;
  if (vibra) {
    const lv = labelOpcion(ID_PREGUNTA_INICIO, vibra);
    if (lv) partes.push(`elegiste “${lv}”`);
  }
  if (matiz && vibra) {
    const subId = buscarOpcion(ID_PREGUNTA_INICIO, vibra)?.siguientePreguntaId;
    if (subId && preguntasDinamicas[subId]) {
      const lm = labelOpcion(subId, matiz);
      if (lm) partes.push(`con matices de “${lm}”`);
    }
  }

  const comp = respuestas.compania;
  const compFrase =
    comp === 'pareja'
      ? 'en pareja'
      : comp === 'solo'
        ? 'solo/a'
        : comp === 'amigos'
          ? 'con amigos'
          : comp === 'familia'
            ? 'en familia'
            : '';

  const intro =
    partes.length > 0
      ? `Como ${partes.join(' y ')}`
      : 'Según lo que marcaste';

  const conQuien = compFrase ? ` y vas ${compFrase}` : '';

  if (nombres.length === 1) {
    return `${intro}${conQuien}, ${nombres[0]} encaja muy bien con lo que buscás.`;
  }
  return `${intro}${conQuien}, estos destinos van como piña: ${nombres.join(', ')}.`;
}
