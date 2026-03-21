/**
 * Preguntas tipo “elegí tu aventura”: ramas según primera respuesta + matiz.
 * Compatible con el motor en motorAventura (experiencia, tags, región).
 */
import type { AtributosDestino, TagDestinoMotor } from './destinos';

/** Fin del bloque dinámico → paso fijo compañía */
export const ID_SIGUIENTE_FIJAS = '__fijas__';

export interface ImpactoOpcion {
  tags?: TagDestinoMotor[];
  atributos?: Partial<AtributosDestino>;
  /** Regiones del modelo Destino.region */
  regiones?: string[];
  presupuesto?: string[];
  /** Valor para query `experiencia` (motor legacy) */
  experienciaMotor?: string;
  /** Imagen de fondo sección aventura (opcional) */
  imagenFondo?: string;
}

export interface OpcionPreguntaDinamica {
  valor: string;
  label: string;
  icon?: string;
  impacto: ImpactoOpcion;
  /** Siguiente nodo del grafo o ID_SIGUIENTE_FIJAS */
  siguientePreguntaId: string;
}

export interface PreguntaDinamica {
  id: string;
  texto: string;
  tipo: 'single_choice';
  opciones: OpcionPreguntaDinamica[];
}

export const preguntasDinamicas: Record<string, PreguntaDinamica> = {
  vibra: {
    id: 'vibra',
    texto: '¿Qué te vibra más ahora mismo?',
    tipo: 'single_choice',
    opciones: [
      {
        valor: 'naturaleza',
        label: 'Naturaleza y aire libre',
        icon: '🏔️',
        impacto: {
          tags: ['naturaleza'],
          experienciaMotor: 'montana_naturaleza',
          imagenFondo:
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: 'sub_naturaleza',
      },
      {
        valor: 'ciudad',
        label: 'Ciudad y energía',
        icon: '🏙️',
        impacto: {
          tags: ['ciudad'],
          experienciaMotor: 'ciudad_cultura',
          imagenFondo:
            'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: 'sub_ciudad',
      },
      {
        valor: 'relax',
        label: 'Desconectar y relax total',
        icon: '🧘',
        impacto: {
          tags: ['relax'],
          experienciaMotor: 'playa_relax',
          imagenFondo:
            'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: 'sub_relax',
      },
      {
        valor: 'aventura',
        label: 'Adrenalina y aventura',
        icon: '🧗',
        impacto: {
          tags: ['aventura'],
          experienciaMotor: 'aventura_deporte',
          imagenFondo:
            'https://images.unsplash.com/photo-1500043201641-4f4e6da1cd8e?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: 'sub_aventura',
      },
    ],
  },

  sub_naturaleza: {
    id: 'sub_naturaleza',
    texto: '¿Qué faceta de la naturaleza te tira más?',
    tipo: 'single_choice',
    opciones: [
      {
        valor: 'nieve',
        label: 'Nieve, ski o montaña fría',
        icon: '❄️',
        impacto: {
          tags: ['naturaleza', 'aventura'],
          experienciaMotor: 'montana_naturaleza',
          imagenFondo:
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: ID_SIGUIENTE_FIJAS,
      },
      {
        valor: 'trekking',
        label: 'Trekking y senderos',
        icon: '🥾',
        impacto: {
          tags: ['naturaleza', 'aventura'],
          experienciaMotor: 'montana_naturaleza',
          imagenFondo:
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: ID_SIGUIENTE_FIJAS,
      },
      {
        valor: 'playa_nat',
        label: 'Playa pero sin ciudad ruidosa',
        icon: '🏝️',
        impacto: {
          tags: ['naturaleza', 'relax'],
          experienciaMotor: 'playa_relax',
          regiones: ['caribe', 'sudamerica'],
          imagenFondo:
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: ID_SIGUIENTE_FIJAS,
      },
    ],
  },

  sub_ciudad: {
    id: 'sub_ciudad',
    texto: '¿Qué te copa más en ciudad?',
    tipo: 'single_choice',
    opciones: [
      {
        valor: 'cultura',
        label: 'Museos, historia y barrios',
        icon: '🏛️',
        impacto: {
          tags: ['ciudad'],
          experienciaMotor: 'ciudad_cultura',
          imagenFondo:
            'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: ID_SIGUIENTE_FIJAS,
      },
      {
        valor: 'gastro',
        label: 'Gastronomía y vinos',
        icon: '🍷',
        impacto: {
          tags: ['ciudad'],
          experienciaMotor: 'gastronomia_vino',
          imagenFondo:
            'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: ID_SIGUIENTE_FIJAS,
      },
      {
        valor: 'nightlife',
        label: 'Vida nocturna y shows',
        icon: '🎭',
        impacto: {
          tags: ['ciudad'],
          experienciaMotor: 'ciudad_cultura',
          imagenFondo:
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: ID_SIGUIENTE_FIJAS,
      },
    ],
  },

  sub_relax: {
    id: 'sub_relax',
    texto: '¿Cómo preferís relajar?',
    tipo: 'single_choice',
    opciones: [
      {
        valor: 'playa',
        label: 'Playa y sol',
        icon: '🏖️',
        impacto: {
          tags: ['relax'],
          experienciaMotor: 'playa_relax',
          regiones: ['caribe', 'sudamerica'],
          imagenFondo:
            'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: ID_SIGUIENTE_FIJAS,
      },
      {
        valor: 'termas',
        label: 'Termas y spa',
        icon: '♨️',
        impacto: {
          tags: ['relax'],
          experienciaMotor: 'termas_relax',
          imagenFondo:
            'https://images.unsplash.com/photo-1505733289361-41e24b3c2e69?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: ID_SIGUIENTE_FIJAS,
      },
      {
        valor: 'lujo',
        label: 'Resort / todo incluido',
        icon: '✨',
        impacto: {
          tags: ['relax', 'ciudad'],
          experienciaMotor: 'playa_relax',
          regiones: ['caribe', 'asia', 'medio_oriente'],
          imagenFondo:
            'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: ID_SIGUIENTE_FIJAS,
      },
    ],
  },

  sub_aventura: {
    id: 'sub_aventura',
    texto: '¿Qué tipo de desafío buscás?',
    tipo: 'single_choice',
    opciones: [
      {
        valor: 'montana',
        label: 'Montaña extrema o alta',
        icon: '⛰️',
        impacto: {
          tags: ['aventura', 'naturaleza'],
          experienciaMotor: 'aventura_deporte',
          imagenFondo:
            'https://images.unsplash.com/photo-1500043201641-4f4e6da1cd8e?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: ID_SIGUIENTE_FIJAS,
      },
      {
        valor: 'agua',
        label: 'Agua: buceo, kayak, olas',
        icon: '🌊',
        impacto: {
          tags: ['aventura', 'relax'],
          experienciaMotor: 'aventura_deporte',
          regiones: ['caribe', 'asia', 'sudamerica'],
          imagenFondo:
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: ID_SIGUIENTE_FIJAS,
      },
      {
        valor: 'selva',
        label: 'Selva, fauna y trekking húmedo',
        icon: '🦜',
        impacto: {
          tags: ['aventura', 'naturaleza'],
          experienciaMotor: 'montana_naturaleza',
          regiones: ['sudamerica', 'asia'],
          imagenFondo:
            'https://images.unsplash.com/photo-1519817650390-64a93db511aa?auto=format&fit=crop&w=1920&q=80',
        },
        siguientePreguntaId: ID_SIGUIENTE_FIJAS,
      },
    ],
  },
};

export const ID_PREGUNTA_INICIO = 'vibra';

export function buscarOpcion(
  preguntaId: string,
  valor: string,
): OpcionPreguntaDinamica | undefined {
  const p = preguntasDinamicas[preguntaId];
  return p?.opciones.find((o) => o.valor === valor);
}

/** Combina impactos de vibra + matiz (respuestas.vibra + respuestas.matiz) */
export function acumularImpactoDinamico(respuestas: Record<string, string>): {
  tagsBoost: TagDestinoMotor[];
  regionesPreferidas: string[];
  experienciasBoost: string[];
  experienciaMotor: string;
  ultimaImagenFondo?: string;
} {
  const tags = new Set<TagDestinoMotor>();
  const regiones = new Set<string>();
  const exps = new Set<string>();
  let experienciaMotor = '';
  let ultimaImagen: string | undefined;

  const vibraVal = respuestas.vibra;
  const matizVal = respuestas.matiz;

  if (vibraVal) {
    const o1 = buscarOpcion(ID_PREGUNTA_INICIO, vibraVal);
    if (o1) {
      mergeImpactoOpcion(o1.impacto, tags, regiones, exps);
      if (o1.impacto.experienciaMotor) experienciaMotor = o1.impacto.experienciaMotor;
      ultimaImagen = o1.impacto.imagenFondo ?? ultimaImagen;
    }
  }

  if (matizVal && vibraVal) {
    const subId = buscarOpcion(ID_PREGUNTA_INICIO, vibraVal)?.siguientePreguntaId;
    if (subId && subId !== ID_SIGUIENTE_FIJAS) {
      const o2 = buscarOpcion(subId, matizVal);
      if (o2) {
        mergeImpactoOpcion(o2.impacto, tags, regiones, exps);
        if (o2.impacto.experienciaMotor) experienciaMotor = o2.impacto.experienciaMotor;
        ultimaImagen = o2.impacto.imagenFondo ?? ultimaImagen;
      }
    }
  }

  return {
    tagsBoost: [...tags],
    regionesPreferidas: [...regiones],
    experienciasBoost: [...exps],
    experienciaMotor: experienciaMotor || 'montana_naturaleza',
    ultimaImagenFondo: ultimaImagen,
  };
}

function mergeImpactoOpcion(
  imp: ImpactoOpcion,
  tags: Set<TagDestinoMotor>,
  regiones: Set<string>,
  exps: Set<string>,
) {
  imp.tags?.forEach((t) => tags.add(t));
  imp.regiones?.forEach((r) => regiones.add(r));
  imp.atributos?.experiencia?.forEach((e) => exps.add(e));
  if (imp.experienciaMotor) exps.add(imp.experienciaMotor);
  imp.presupuesto?.forEach(() => {});
}

export function siguienteIdTrasVibra(vibraValor: string): string {
  const o = buscarOpcion(ID_PREGUNTA_INICIO, vibraValor);
  return o?.siguientePreguntaId ?? ID_SIGUIENTE_FIJAS;
}

export function obtenerSubpregunta(vibraValor: string): PreguntaDinamica | null {
  const sid = siguienteIdTrasVibra(vibraValor);
  if (sid === ID_SIGUIENTE_FIJAS || !preguntasDinamicas[sid]) return null;
  return preguntasDinamicas[sid];
}
