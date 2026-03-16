/** Picsum Photos: URLs estables que siempre cargan (seed = imagen fija por opción) */
const P = (seed: string) =>
  `https://picsum.photos/seed/${seed}/600/600`;

export interface OpcionAventura {
  id: string;
  label: string;
  /** URL de imagen de fondo para el cuadrante */
  imageUrl?: string;
}

export interface PreguntaAventura {
  id: string;
  label: string;
  opciones: OpcionAventura[];
}

export const preguntasAventura: PreguntaAventura[] = [
  {
    id: 'compania',
    label: '¿Con quién viajás?',
    opciones: [
      { id: 'solo', label: 'Solo/a', imageUrl: P('solo-viaje') },
      { id: 'pareja', label: 'En pareja', imageUrl: P('pareja-viaje') },
      { id: 'amigos', label: 'Con amigos', imageUrl: P('amigos-viaje') },
      { id: 'familia', label: 'Con familia (con niños)', imageUrl: P('familia-viaje') },
    ],
  },
  {
    id: 'experiencia',
    label: '¿Qué tipo de experiencia buscás?',
    opciones: [
      { id: 'playa_relax', label: 'Playa y relax', imageUrl: P('playa-relax') },
      { id: 'montana_naturaleza', label: 'Montaña y naturaleza', imageUrl: P('montana-naturaleza') },
      { id: 'ciudad_cultura', label: 'Ciudad y cultura', imageUrl: P('ciudad-cultura') },
      { id: 'aventura_deporte', label: 'Aventura y deporte', imageUrl: P('aventura-deporte') },
      { id: 'gastronomia_vino', label: 'Gastronomía y vino', imageUrl: P('gastronomia-vino') },
      { id: 'termas_relax', label: 'Termas y relax', imageUrl: P('termas-relax') },
    ],
  },
  {
    id: 'presupuesto',
    label: '¿Presupuesto?',
    opciones: [
      { id: 'economico', label: 'Económico', imageUrl: P('economico') },
      { id: 'medio', label: 'Medio', imageUrl: P('medio-viaje') },
      { id: 'sin_mirar', label: 'Sin mirar tanto', imageUrl: P('sin-mirar') },
    ],
  },
  {
    id: 'dias',
    label: '¿Cuántos días tenés?',
    opciones: [
      { id: 'fin_semana', label: 'Fin de semana', imageUrl: P('fin-semana') },
      { id: 'una_semana', label: 'Una semana', imageUrl: P('una-semana') },
      { id: 'dos_o_mas', label: 'Dos semanas o más', imageUrl: P('dos-semanas-mas') },
    ],
  },
];
