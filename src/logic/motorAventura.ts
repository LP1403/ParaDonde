import type { Destino } from '../data/destinos';

export type RespuestasAventura = Record<string, string>;

export function filtrarDestinosPorRespuestas(
  destinos: Destino[],
  respuestas: RespuestasAventura
): Destino[] {
  const resultado = destinos
    .map((destino) => {
      let coincidencias = 0;
      for (const [preguntaId, opcionId] of Object.entries(respuestas)) {
        const opciones = destino.atributos[preguntaId as keyof typeof destino.atributos];
        if (Array.isArray(opciones) && opciones.includes(opcionId)) {
          coincidencias++;
        }
      }
      return { destino, coincidencias };
    })
    .filter(({ coincidencias }) => coincidencias > 0)
    .sort((a, b) => b.coincidencias - a.coincidencias)
    .map(({ destino }) => destino);

  return resultado.slice(0, 3);
}
