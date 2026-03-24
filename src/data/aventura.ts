export interface OpcionAventura {
  id: string;
  label: string;
  /** URL de imagen de fondo para el cuadrante */
  imageUrl?: string;
  /** Emoji de bandera (u otros) para el paso país de origen: se muestra “bandera — nombre” */
  bandera?: string;
}

export interface PreguntaAventura {
  id: string;
  label: string;
  opciones: OpcionAventura[];
}

/**
 * Orden del flujo /aventura:
 * 1. País de residencia → documentación contextual en resultados
 * 2. Edad del viajero
 * 3. Compañía … (resto)
 */
export const preguntasAventura: PreguntaAventura[] = [
  {
    id: 'origen_pais',
    label: '¿Desde dónde comienza tu aventura? (tu país de residencia)',
    opciones: [
      { id: 'ar', label: 'Argentina', bandera: '🇦🇷' },
      { id: 'br', label: 'Brasil', bandera: '🇧🇷' },
      { id: 'uy', label: 'Uruguay', bandera: '🇺🇾' },
      { id: 'cl', label: 'Chile', bandera: '🇨🇱' },
      { id: 'py', label: 'Paraguay', bandera: '🇵🇾' },
      { id: 'bo', label: 'Bolivia', bandera: '🇧🇴' },
      { id: 'us', label: 'Estados Unidos / Canadá', bandera: '🇺🇸\u00A0🇨🇦' },
      { id: 'mx', label: 'México', bandera: '🇲🇽' },
      { id: 'es', label: 'España', bandera: '🇪🇸' },
      { id: 'europa_otros', label: 'Europa (otro)', bandera: '🇪🇺' },
      { id: 'otros', label: 'Otro país', bandera: '🌍' },
    ],
  },
  {
    id: 'edad_viajero',
    label: '¿Qué edad tiene quien viaja? (principal viajero)',
    opciones: [
      {
        id: 'menor_12',
        label: 'Menor de 12',
        imageUrl:
          'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'adolescente_13_17',
        label: '13 a 17 años',
        imageUrl:
          'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'adulto_18_64',
        label: '18 a 64 años',
        imageUrl:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'mayor_65',
        label: '65 o más',
        imageUrl:
          'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
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
          'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
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
    id: 'comida_pref',
    label: '¿Qué estilo de comida te atrae más en el viaje?',
    opciones: [
      {
        id: 'parrilla',
        label: 'Parrilla y asado',
        imageUrl:
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'empanadas',
        label: 'Empanadas y horno',
        imageUrl:
          'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'pescado',
        label: 'Pescado y mariscos',
        imageUrl:
          'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'andina',
        label: 'Cocina andina (humitas, quinoa…)',
        imageUrl:
          'https://images.unsplash.com/photo-1609350051988-60e6cf4ec7a9?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'pasta_italiana',
        label: 'Pasta, pizza y café',
        imageUrl:
          'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'criollo',
        label: 'Locro, guisos y vino regional',
        imageUrl:
          'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
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
