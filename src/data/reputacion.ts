export type NivelMetal = 'bronce' | 'plata' | 'oro' | 'platino' | 'diamante';

export interface NivelReputacion {
  id: NivelMetal;
  nombre: string;
  apodo: string;
  puntosMin: number;
  puntosMax: number | null;
  color: string;
  colorFondo: string;
  emoji: string;
  iconPath: string; // SVG path key for hex shield
  descripcion: string;
}

export const PUNTOS_MISION_FACIL = 150;
export const PUNTOS_MISION_MEDIO = 250;
export const PUNTOS_MISION_DIFICIL = 400;
export const PUNTOS_VUELO = 150;
export const PUNTOS_REFERIDO_NUEVO = 300;
export const PUNTOS_REFERIDO_EXTRA = 300;
export const PUNTOS_REFERIDO_RED_BONUS = 100;
export const UMBRAL_RED_BONUS = 5;

export const NIVELES_REPUTACION: NivelReputacion[] = [
  {
    id: 'bronce',
    nombre: 'Bronce',
    apodo: 'Turista',
    puntosMin: 0,
    puntosMax: 999,
    color: '#cd7f32',
    colorFondo: 'rgba(205,127,50,0.15)',
    emoji: '🥉',
    iconPath: 'bronce',
    descripcion: 'Comenzás tu aventura. El mundo te espera.',
  },
  {
    id: 'plata',
    nombre: 'Plata',
    apodo: 'Local',
    puntosMin: 1000,
    puntosMax: 4999,
    color: '#b0b7c3',
    colorFondo: 'rgba(176,183,195,0.15)',
    emoji: '🥈',
    iconPath: 'plata',
    descripcion: 'Ya conocés los rincones. Empezás a destacarte.',
  },
  {
    id: 'oro',
    nombre: 'Oro',
    apodo: 'Guía',
    puntosMin: 5000,
    puntosMax: 14999,
    color: '#f5c518',
    colorFondo: 'rgba(245,197,24,0.15)',
    emoji: '🥇',
    iconPath: 'oro',
    descripcion: 'Te manejás como pez en el agua. Los locales te reconocen.',
  },
  {
    id: 'platino',
    nombre: 'Platino',
    apodo: 'Embajador',
    puntosMin: 15000,
    puntosMax: 29999,
    color: '#9ee4ff',
    colorFondo: 'rgba(158,228,255,0.15)',
    emoji: '💎',
    iconPath: 'platino',
    descripcion: 'Sos una referencia. Tu reputación habla por vos.',
  },
  {
    id: 'diamante',
    nombre: 'Diamante',
    apodo: 'Leyenda',
    puntosMin: 30000,
    puntosMax: null,
    color: '#b9f2ff',
    colorFondo: 'rgba(185,242,255,0.18)',
    emoji: '💠',
    iconPath: 'diamante',
    descripcion: 'Leyenda del destino. Los beneficios más exclusivos son tuyos.',
  },
];

export function getNivelParaPuntos(puntos: number): NivelReputacion {
  return (
    [...NIVELES_REPUTACION].reverse().find((n) => puntos >= n.puntosMin) ??
    NIVELES_REPUTACION[0]
  );
}

export function getPorcentajeProgreso(puntos: number): number {
  const nivel = getNivelParaPuntos(puntos);
  if (nivel.puntosMax === null) return 100;
  const rango = nivel.puntosMax - nivel.puntosMin + 1;
  return Math.min(100, Math.round(((puntos - nivel.puntosMin) / rango) * 100));
}

export function getPuntosParaSiguienteNivel(puntos: number): number | null {
  const nivel = getNivelParaPuntos(puntos);
  if (nivel.puntosMax === null) return null;
  return nivel.puntosMax + 1 - puntos;
}

export function getSiguienteNivel(puntos: number): NivelReputacion | null {
  const actual = getNivelParaPuntos(puntos);
  const idx = NIVELES_REPUTACION.findIndex((n) => n.id === actual.id);
  return idx < NIVELES_REPUTACION.length - 1 ? NIVELES_REPUTACION[idx + 1] : null;
}
