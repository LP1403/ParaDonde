const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&q=80&fit=crop`;

export interface OpcionAventura {
  id: string;
  label: string;
  /** URL de imagen de fondo para el cuadrante (Unsplash, etc.) */
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
      { id: 'solo', label: 'Solo/a', imageUrl: U('1488646953014-85cb44e25828') },
      { id: 'pareja', label: 'En pareja', imageUrl: U('1529333244696-5c911bf90b2d') },
      { id: 'amigos', label: 'Con amigos', imageUrl: U('1529156069898-49953e39b3ac') },
      { id: 'familia', label: 'Con familia (con niños)', imageUrl: U('1511895426328-dc8714191300') },
    ],
  },
  {
    id: 'experiencia',
    label: '¿Qué tipo de experiencia buscás?',
    opciones: [
      { id: 'playa_relax', label: 'Playa y relax', imageUrl: U('1507525428034-b723cf961d3e') },
      { id: 'montana_naturaleza', label: 'Montaña y naturaleza', imageUrl: U('1464822759023-fed622ff2c3f') },
      { id: 'ciudad_cultura', label: 'Ciudad y cultura', imageUrl: U('1514565131-fce0801e5785') },
      { id: 'aventura_deporte', label: 'Aventura y deporte', imageUrl: U('1536244888091-47437acd2cd6') },
      { id: 'gastronomia_vino', label: 'Gastronomía y vino', imageUrl: U('1510812432151-a150bab89635') },
      { id: 'termas_relax', label: 'Termas y relax', imageUrl: U('1545569341-9eb8b30979d9') },
    ],
  },
  {
    id: 'presupuesto',
    label: '¿Presupuesto?',
    opciones: [
      { id: 'economico', label: 'Económico', imageUrl: U('1469474968028-56643f082053') },
      { id: 'medio', label: 'Medio', imageUrl: U('1476514525535-07fb3b4ae5f1') },
      { id: 'sin_mirar', label: 'Sin mirar tanto', imageUrl: U('1551917570-43d88e8d1d94') },
    ],
  },
  {
    id: 'dias',
    label: '¿Cuántos días tenés?',
    opciones: [
      { id: 'fin_semana', label: 'Fin de semana', imageUrl: U('1506929569252-996aa26a9294') },
      { id: 'una_semana', label: 'Una semana', imageUrl: U('1476514525535-07fb3b4ae5f1') },
      { id: 'dos_o_mas', label: 'Dos semanas o más', imageUrl: U('1488646953014-85cb44e25828') },
    ],
  },
];
