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
      {
        id: 'solo',
        label: 'Solo/a',
        imageUrl:
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'pareja',
        label: 'En pareja',
        imageUrl:
          'https://images.unsplash.com/photo-1517840933442-d2d1a05edb84?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'amigos',
        label: 'Con amigos',
        imageUrl:
          'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'familia',
        label: 'Con familia (con niños)',
        imageUrl:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'experiencia',
    label: '¿Qué tipo de experiencia buscás?',
    opciones: [
      {
        id: 'playa_relax',
        label: 'Playa y relax',
        imageUrl:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'montana_naturaleza',
        label: 'Montaña y naturaleza',
        imageUrl:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'ciudad_cultura',
        label: 'Ciudad y cultura',
        imageUrl:
          'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'aventura_deporte',
        label: 'Aventura y deporte',
        imageUrl:
          'https://images.unsplash.com/photo-1500043201641-4f4e6da1cd8e?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'gastronomia_vino',
        label: 'Gastronomía y vino',
        imageUrl:
          'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'termas_relax',
        label: 'Termas y relax',
        imageUrl:
          'https://images.unsplash.com/photo-1505733289361-41e24b3c2e69?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'presupuesto',
    label: '¿Presupuesto?',
    opciones: [
      {
        id: 'economico',
        label: 'Económico',
        imageUrl:
          'https://images.unsplash.com/photo-1459257831348-f0cdd359235f?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'medio',
        label: 'Medio',
        imageUrl:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'sin_mirar',
        label: 'Sin mirar tanto',
        imageUrl:
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'temporada',
    label: '¿En qué época querés viajar? (hemisferio sur)',
    opciones: [
      {
        id: 'verano',
        label: 'Verano (dic – mar)',
        imageUrl:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'otono',
        label: 'Otoño (mar – jun)',
        imageUrl:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'invierno',
        label: 'Invierno (jun – sep)',
        imageUrl:
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'primavera',
        label: 'Primavera (sep – dic)',
        imageUrl:
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'flexible',
        label: 'Me da igual / flexible',
        imageUrl:
          'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];
