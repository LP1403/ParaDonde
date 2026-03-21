export interface ResenasExternas {
  tripadvisor?: { puntaje: number; cantidad: number; url: string };
  booking?: { puntaje: number; cantidad: number; url: string };
}

export interface GuiaDestino {
  queVer: string;
  cuandoIr: string;
  cuantosDias: string;
  requisitos?: string;
  tips: string;
}

export interface AtributosDestino {
  compania: string[];
  experiencia: string[];
  presupuesto: string[];
  dias: string[];
}

/** 5 fotos por destino para carrusel (resolución ~900px) */
function fotos(seed: string): string[] {
  return [1, 2, 3, 4, 5].map((i) => `https://picsum.photos/seed/${seed}-${i}/900/600`);
}

export interface Destino {
  id: string;
  slug: string;
  nombre: string;
  descripcionCorta: string;
  /** Primera imagen (compatibilidad) */
  imageUrl?: string;
  /** 5 imágenes para carrusel */
  imageUrls?: string[];
  itinerario?: {
    inicio: string;
    paradas: string[];
    fin: string;
    distanciaTotalKm: number;
    duracionDias: number;
  };
  atributos: AtributosDestino;
  guia: GuiaDestino;
  reseñasExternas: ResenasExternas;
}

export const destinos: Destino[] = [
  {
    id: 'buenos-aires',
    slug: 'buenos-aires',
    nombre: 'Buenos Aires',
    descripcionCorta: 'Ciudad, cultura, gastronomía y vida nocturna.',
    imageUrl: 'https://picsum.photos/seed/buenos-aires/900/600',
    imageUrls: fotos('buenos-aires'),
    itinerario: {
      inicio: 'Tu ciudad de origen',
      paradas: ['Llegada a Aeroparque/Ezeiza', 'Centro / San Telmo', 'Palermo', 'La Boca'],
      fin: 'Regreso desde Buenos Aires',
      distanciaTotalKm: 1500,
      duracionDias: 4,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos', 'familia'],
      experiencia: ['ciudad_cultura', 'gastronomia_vino'],
      presupuesto: ['economico', 'medio', 'sin_mirar'],
      dias: ['fin_semana', 'una_semana', 'dos_o_mas'],
    },
    guia: {
      queVer: 'Barrios (San Telmo, Palermo, La Boca), teatros, museos, ferias, parques.',
      cuandoIr: 'Todo el año; primavera y otoño muy agradables.',
      cuantosDias: '3 a 7 días según ritmo.',
      requisitos: 'DNI o pasaporte. Sin visa para turismo corto desde la mayoría de países.',
      tips: 'Movete en subte o a pie por zonas céntricas; probá asado y empanadas.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.5, cantidad: 120000, url: 'https://www.tripadvisor.com/Tourism-g312741-Buenos_Aires_Capital_Federal_District-Vacations.html' },
    },
  },
  {
    id: 'bariloche',
    slug: 'bariloche',
    nombre: 'San Carlos de Bariloche',
    descripcionCorta: 'Lagos, montaña, nieve y naturaleza en Patagonia.',
    imageUrl: 'https://images.unsplash.com/photo-1516302350523-4c918cc75af8?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('bariloche'),
    itinerario: {
      inicio: 'Buenos Aires',
      paradas: ['Vuelo a Bariloche', 'Circuito Chico', 'Cerro Catedral', 'Día de lagos'],
      fin: 'Regreso desde Bariloche',
      distanciaTotalKm: 3200,
      duracionDias: 6,
    },
    atributos: {
      compania: ['pareja', 'amigos', 'familia'],
      experiencia: ['montana_naturaleza', 'aventura_deporte'],
      presupuesto: ['medio', 'sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    guia: {
      queVer: 'Cerro Catedral, Circuito Chico, Nahuel Huapi, Colonia Suiza, chocolate y cerveza artesanal.',
      cuandoIr: 'Invierno para esquí; verano para trekking y lagos.',
      cuantosDias: '5 a 10 días.',
      tips: 'Reservar con tiempo en temporada; llevar abrigo todo el año.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.6, cantidad: 45000, url: 'https://www.tripadvisor.com/Tourism-g312855-San_Carlos_de_Bariloche_Patagonia-Vacations.html' },
    },
  },
  {
    id: 'mar-del-plata',
    slug: 'mar-del-plata',
    nombre: 'Mar del Plata',
    descripcionCorta: 'Playa, verano y familia en la costa atlántica.',
    imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('mar-del-plata'),
    itinerario: {
      inicio: 'Buenos Aires',
      paradas: ['Ruta 2 / micro', 'Centro y playas céntricas', 'Punta Mogotes'],
      fin: 'Regreso desde Mar del Plata',
      distanciaTotalKm: 800,
      duracionDias: 3,
    },
    atributos: {
      compania: ['pareja', 'amigos', 'familia'],
      experiencia: ['playa_relax'],
      presupuesto: ['economico', 'medio', 'sin_mirar'],
      dias: ['fin_semana', 'una_semana', 'dos_o_mas'],
    },
    guia: {
      queVer: 'Playas (Grande, Bristol, Punta Mogotes), casino, Puerto, reserva Punta Loma.',
      cuandoIr: 'Diciembre a marzo para playa; resto del año más tranquilo.',
      cuantosDias: '3 a 7 días.',
      tips: 'Reservar alojamiento con anticipación en temporada alta.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.2, cantidad: 65000, url: 'https://www.tripadvisor.com/Tourism-g312766-Mar_del_Plata_Buenos_Aires_Province_Central_Argentina-Vacations.html' },
    },
  },
  {
    id: 'cordoba',
    slug: 'cordoba',
    nombre: 'Córdoba',
    descripcionCorta: 'Sierras, peñas y naturaleza a pocas horas.',
    imageUrl: 'https://picsum.photos/seed/cordoba-argentina/900/600',
    imageUrls: fotos('cordoba-argentina'),
    itinerario: {
      inicio: 'Tu ciudad de origen',
      paradas: ['Ciudad de Córdoba', 'Sierras cercanas', 'Villa Carlos Paz'],
      fin: 'Regreso desde Córdoba',
      distanciaTotalKm: 1200,
      duracionDias: 4,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos', 'familia'],
      experiencia: ['montana_naturaleza', 'ciudad_cultura', 'gastronomia_vino'],
      presupuesto: ['economico', 'medio', 'sin_mirar'],
      dias: ['fin_semana', 'una_semana', 'dos_o_mas'],
    },
    guia: {
      queVer: 'Manzana Jesuítica, Cerro de las Rosas, Alta Gracia, Villa Carlos Paz, ríos y diques.',
      cuandoIr: 'Todo el año; verano para ríos, invierno suave.',
      cuantosDias: '3 a 7 días.',
      tips: 'Combinar ciudad con día en las sierras o Villa Carlos Paz.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.4, cantidad: 38000, url: 'https://www.tripadvisor.com/Tourism-g312769-Cordoba_Province_of_Cordoba_Central_Argentina-Vacations.html' },
    },
  },
  {
    id: 'villa-carlos-paz',
    slug: 'villa-carlos-paz',
    nombre: 'Villa Carlos Paz',
    descripcionCorta: 'Dique, sierras y turismo familiar en Córdoba.',
    imageUrl: 'https://images.unsplash.com/photo-1521292270410-a8c53642e9d0?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('villa-carlos-paz'),
    itinerario: {
      inicio: 'Ciudad de Córdoba',
      paradas: ['Ruta a Carlos Paz', 'Costanera y lago', 'Cerro de la Cruz'],
      fin: 'Regreso a Córdoba',
      distanciaTotalKm: 250,
      duracionDias: 3,
    },
    atributos: {
      compania: ['pareja', 'amigos', 'familia'],
      experiencia: ['montana_naturaleza', 'playa_relax'],
      presupuesto: ['economico', 'medio'],
      dias: ['fin_semana', 'una_semana'],
    },
    guia: {
      queVer: 'Dique San Roque, Reloj Cucú, parques de diversiones, playas del lago, Cerro de la Cruz.',
      cuandoIr: 'Verano para playa y lago; Semana Santa y julio muy concurridos.',
      cuantosDias: '2 a 5 días.',
      tips: 'Ideal para familias; muchos shows y actividades nocturnas.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.3, cantidad: 22000, url: 'https://www.tripadvisor.com/Tourism-g312831-Villa_Carlos_Paz_Province_of_Cordoba_Central_Argentina-Vacations.html' },
    },
  },
  {
    id: 'mendoza',
    slug: 'mendoza',
    nombre: 'Mendoza',
    descripcionCorta: 'Vino, montaña y Aconcagua.',
    imageUrl: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('mendoza'),
    itinerario: {
      inicio: 'Tu ciudad de origen',
      paradas: ['Ciudad de Mendoza', 'Circuito de bodegas', 'Alta montaña / Aconcagua'],
      fin: 'Regreso desde Mendoza',
      distanciaTotalKm: 1800,
      duracionDias: 5,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos'],
      experiencia: ['gastronomia_vino', 'montana_naturaleza', 'aventura_deporte'],
      presupuesto: ['medio', 'sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    guia: {
      queVer: 'Bodegas (Luján de Cuyo, Maipú), Aconcagua, Potrerillos, termas Cacheuta, ciudad y plazas.',
      cuandoIr: 'Marzo a mayo y septiembre a noviembre para vendimia y clima; invierno para nieve.',
      cuantosDias: '4 a 7 días.',
      tips: 'Reservar bodegas con anticipación; combinar con días en la montaña.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.6, cantidad: 52000, url: 'https://www.tripadvisor.com/Tourism-g312775-Mendoza_Province_of_Mendoza_Cuyo-Vacations.html' },
    },
  },
  {
    id: 'puerto-iguazu',
    slug: 'puerto-iguazu',
    nombre: 'Puerto Iguazú',
    descripcionCorta: 'Cataratas del Iguazú y selva misionera.',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db511aa?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('puerto-iguazu'),
    itinerario: {
      inicio: 'Buenos Aires',
      paradas: ['Vuelo a Puerto Iguazú', 'Parque Nacional Iguazú', 'Hito Tres Fronteras'],
      fin: 'Regreso desde Puerto Iguazú',
      distanciaTotalKm: 2800,
      duracionDias: 4,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos', 'familia'],
      experiencia: ['montana_naturaleza', 'aventura_deporte'],
      presupuesto: ['economico', 'medio', 'sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    guia: {
      queVer: 'Cataratas (lado argentino y opcional Brasil), Garganta del Diablo, sendas verdes, Hito Tres Fronteras.',
      cuandoIr: 'Abril a septiembre menos calor y lluvia; verano más calor y agua.',
      requisitos: 'DNI. Si cruzás a Brasil, ver requisitos según nacionalidad.',
      cuantosDias: '2 a 4 días para cataratas y alrededores.',
      tips: 'Llevar repelente y calzado cómodo; reservar entradas en temporada.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.7, cantidad: 78000, url: 'https://www.tripadvisor.com/Tourism-g312789-Puerto_Iguazu_Province_of_Misiones_Northeast_Argentina-Vacations.html' },
    },
  },
  {
    id: 'salta',
    slug: 'salta',
    nombre: 'Salta',
    descripcionCorta: 'Norte argentino, quebradas y cultura.',
    imageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('salta'),
    itinerario: {
      inicio: 'Tu ciudad de origen',
      paradas: ['Salta capital', 'Quebrada de Cafayate', 'Pueblos del Valle Calchaquí'],
      fin: 'Regreso desde Salta',
      distanciaTotalKm: 2200,
      duracionDias: 6,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos', 'familia'],
      experiencia: ['ciudad_cultura', 'montana_naturaleza', 'gastronomia_vino'],
      presupuesto: ['economico', 'medio', 'sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    guia: {
      queVer: 'Cerro de los Siete Colores, Cafayate, Tren a las Nubes, ciudad (Cabildo, MAAM), Cachi.',
      cuandoIr: 'Abril a octubre clima más seco; enero-febrero lluvias.',
      cuantosDias: '5 a 10 días para ciudad + quebradas.',
      tips: 'Combinar Salta capital con Cafayate o Purmamarca.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.6, cantidad: 41000, url: 'https://www.tripadvisor.com/Tourism-g312814-Salta_Province_of_Salta_Northwest_Argentina-Vacations.html' },
    },
  },
  {
    id: 'termas-rio-hondo',
    slug: 'termas-rio-hondo',
    nombre: 'Termas de Río Hondo',
    descripcionCorta: 'Termas y relax en Santiago del Estero.',
    imageUrl: 'https://images.unsplash.com/photo-1505739773434-6a4b3f1e3c44?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('termas-rio-hondo'),
    itinerario: {
      inicio: 'Tu ciudad de origen',
      paradas: ['Llegada a Termas', 'Día de termas y spa', 'Vista al dique'],
      fin: 'Regreso desde Termas',
      distanciaTotalKm: 900,
      duracionDias: 3,
    },
    atributos: {
      compania: ['pareja', 'amigos', 'familia'],
      experiencia: ['termas_relax', 'playa_relax'],
      presupuesto: ['economico', 'medio'],
      dias: ['fin_semana', 'una_semana'],
    },
    guia: {
      queVer: 'Complejos termales, dique Frontal, balnearios, casino, circuito de motos (GP).',
      cuandoIr: 'Todo el año; invierno muy elegido para termas.',
      cuantosDias: '2 a 5 días.',
      tips: 'Reservar en complejos con pileta termal; ideal descanso.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.1, cantidad: 8500, url: 'https://www.tripadvisor.com/Tourism-g312832-Termas_de_Rio_Hondo_Province_of_Santiago_del_Estero-Northeast_Argentina-Vacations.html' },
    },
  },
  {
    id: 'rosario',
    slug: 'rosario',
    nombre: 'Rosario',
    descripcionCorta: 'Ciudad del río Paraná, cultura y paseos.',
    imageUrl: 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('rosario'),
    itinerario: {
      inicio: 'Buenos Aires',
      paradas: ['Viaje a Rosario', 'Costanera del Paraná', 'Monumento a la Bandera'],
      fin: 'Regreso desde Rosario',
      distanciaTotalKm: 600,
      duracionDias: 2,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos', 'familia'],
      experiencia: ['ciudad_cultura', 'gastronomia_vino'],
      presupuesto: ['economico', 'medio'],
      dias: ['fin_semana', 'una_semana'],
    },
    guia: {
      queVer: 'Monumento a la Bandera, costanera, islas, museos, bares y restaurantes.',
      cuandoIr: 'Primavera y otoño muy agradables; verano calor y playas de río.',
      cuantosDias: '2 a 4 días.',
      tips: 'Caminar la costanera; opcional paseo en lancha a islas.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.4, cantidad: 28000, url: 'https://www.tripadvisor.com/Tourism-g312782-Rosario_Province_of_Santa_Fe_Litoral-Vacations.html' },
    },
  },
];

export function getDestinoBySlug(slug: string): Destino | undefined {
  return destinos.find((d) => d.slug === slug);
}
