export interface ResenasExternas {
  tripadvisor?: { puntaje: number; cantidad: number; url: string };
  booking?: { puntaje: number; cantidad: number; url: string };
}

export interface DocumentacionDestino {
  /** true = necesita pasaporte (DNI no alcanza) */
  pasaporte: boolean;
  /** true = necesita visa previa */
  visa: boolean;
  visaInfo?: string;
  vacunas?: string[];
  seguroRecomendado: boolean;
  notas?: string;
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

/** Tags canónicos para el motor: naturaleza | ciudad | relax | aventura (opcional si se derivan de experiencia) */
export type TagDestinoMotor = 'naturaleza' | 'ciudad' | 'relax' | 'aventura';

export type TemporadaDestino =
  | 'invierno'
  | 'primavera'
  | 'verano'
  | 'otono'
  | 'todo_ano';

/** 5 fotos por destino para carrusel (resolución ~900px) */
function fotos(seed: string): string[] {
  return [1, 2, 3, 4, 5].map((i) => `https://picsum.photos/seed/${seed}-${i}/900/600`);
}

export interface Destino {
  id: string;
  slug: string;
  nombre: string;
  pais?: string;
  region?: 'argentina' | 'sudamerica' | 'norteamerica' | 'europa' | 'asia';
  descripcionCorta: string;
  /** Primera imagen (compatibilidad) */
  imageUrl?: string;
  /** 5 imágenes para carrusel */
  imageUrls?: string[];
  presupuestoEstimado?: { minARS: number; maxARS: number };
  /** Varios rangos típicos (p. ej. viaje económico vs confort) — el motor usa la unión */
  presupuestoRangos?: { minARS: number; maxARS: number }[];
  tags?: TagDestinoMotor[];
  temporadas?: TemporadaDestino[];
  itinerario?: {
    inicio: string;
    paradas: string[];
    fin: string;
    distanciaTotalKm: number;
    duracionDias: number;
  };
  atributos: AtributosDestino;
  documentacion: DocumentacionDestino;
  guia: GuiaDestino;
  reseñasExternas: ResenasExternas;
}

export const destinos: Destino[] = [
  /* ────────────────────────────────────────────── ARGENTINA ── */
  {
    id: 'buenos-aires',
    slug: 'buenos-aires',
    nombre: 'Buenos Aires',
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Ciudad, cultura, gastronomía y vida nocturna.',
    imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('buenos-aires'),
    presupuestoEstimado: { minARS: 80_000, maxARS: 450_000 },
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
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: false,
      notas: 'Solo DNI para viaje doméstico.',
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
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Lagos, montaña, nieve y naturaleza en Patagonia.',
    imageUrl: 'https://images.unsplash.com/photo-1516302350523-4c918cc75af8?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('bariloche'),
    presupuestoEstimado: { minARS: 300_000, maxARS: 1_000_000 },
    presupuestoRangos: [
      { minARS: 200_000, maxARS: 520_000 },
      { minARS: 350_000, maxARS: 1_200_000 },
    ],
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
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: true,
      notas: 'Solo DNI. Recomendamos seguro de viaje para actividades en montaña.',
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
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Playa, verano y familia en la costa atlántica.',
    imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('mar-del-plata'),
    presupuestoEstimado: { minARS: 100_000, maxARS: 500_000 },
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
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: false,
      notas: 'Solo DNI para viaje doméstico.',
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
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Sierras, peñas y naturaleza a pocas horas.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('cordoba-argentina'),
    presupuestoEstimado: { minARS: 120_000, maxARS: 600_000 },
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
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: false,
      notas: 'Solo DNI para viaje doméstico.',
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
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Dique, sierras y turismo familiar en Córdoba.',
    imageUrl: 'https://images.unsplash.com/photo-1521292270410-a8c53642e9d0?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('villa-carlos-paz'),
    presupuestoEstimado: { minARS: 100_000, maxARS: 400_000 },
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
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: false,
      notas: 'Solo DNI para viaje doméstico.',
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
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Vino, montaña y Aconcagua.',
    imageUrl: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('mendoza'),
    presupuestoEstimado: { minARS: 250_000, maxARS: 900_000 },
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
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: true,
      notas: 'Solo DNI. Para alta montaña se recomienda seguro con cobertura de altitud.',
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
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Cataratas del Iguazú y selva misionera.',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db511aa?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('puerto-iguazu'),
    presupuestoEstimado: { minARS: 300_000, maxARS: 1_000_000 },
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
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: true,
      vacunas: ['Fiebre amarilla (recomendada para cruce a Brasil)'],
      notas: 'DNI para lado argentino. Si cruzás a Brasil, verificá requisitos según tu nacionalidad.',
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
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Norte argentino, quebradas y cultura.',
    imageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('salta'),
    presupuestoEstimado: { minARS: 250_000, maxARS: 900_000 },
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
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: true,
      notas: 'Solo DNI. A grandes altitudes (Purmamarca, Salinas Grandes) conviene seguro médico.',
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
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Termas y relax en Santiago del Estero.',
    imageUrl: 'https://images.unsplash.com/photo-1505739773434-6a4b3f1e3c44?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('termas-rio-hondo'),
    presupuestoEstimado: { minARS: 100_000, maxARS: 400_000 },
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
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: false,
      notas: 'Solo DNI para viaje doméstico.',
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
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Ciudad del río Paraná, cultura y paseos.',
    imageUrl: 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('rosario'),
    presupuestoEstimado: { minARS: 80_000, maxARS: 350_000 },
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
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: false,
      notas: 'Solo DNI para viaje doméstico.',
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
  {
    id: 'el-calafate',
    slug: 'el-calafate',
    nombre: 'El Calafate',
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Glaciares, Perito Moreno y la Patagonia Sur.',
    imageUrl: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('el-calafate'),
    presupuestoEstimado: { minARS: 500_000, maxARS: 1_500_000 },
    itinerario: {
      inicio: 'Buenos Aires',
      paradas: ['Vuelo a El Calafate', 'Glaciar Perito Moreno', 'Lago Argentino', 'Minitrekking'],
      fin: 'Regreso desde El Calafate',
      distanciaTotalKm: 3200,
      duracionDias: 5,
    },
    atributos: {
      compania: ['pareja', 'amigos', 'familia'],
      experiencia: ['montana_naturaleza', 'aventura_deporte'],
      presupuesto: ['medio', 'sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: true,
      notas: 'Solo DNI. Recomendamos seguro con cobertura de actividades al aire libre.',
    },
    guia: {
      queVer: 'Glaciar Perito Moreno (con pasarelas y opcional minitrekking), Lago Argentino, Upsala, El Chaltén.',
      cuandoIr: 'Octubre a abril para mejor clima y acceso; invierno con mucho frío y viento.',
      cuantosDias: '3 a 6 días.',
      tips: 'Reservar excursiones y vuelos con anticipación; llevar ropa de abrigo y capas impermeables.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.8, cantidad: 35000, url: 'https://www.tripadvisor.com/Tourism-g312848-El_Calafate_Province_of_Santa_Cruz_Patagonia-Vacations.html' },
    },
  },
  {
    id: 'ushuaia',
    slug: 'ushuaia',
    nombre: 'Ushuaia',
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'El fin del mundo: glaciares, trekking y pingüinos.',
    imageUrl: 'https://images.unsplash.com/photo-1541794741013-84de5e92e601?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('ushuaia'),
    presupuestoEstimado: { minARS: 600_000, maxARS: 2_000_000 },
    itinerario: {
      inicio: 'Buenos Aires',
      paradas: ['Vuelo a Ushuaia', 'Parque Nacional Tierra del Fuego', 'Canal Beagle', 'Pingüinera Martillo'],
      fin: 'Regreso desde Ushuaia',
      distanciaTotalKm: 3500,
      duracionDias: 5,
    },
    atributos: {
      compania: ['pareja', 'amigos', 'familia'],
      experiencia: ['montana_naturaleza', 'aventura_deporte'],
      presupuesto: ['sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: true,
      notas: 'Solo DNI. Seguro muy recomendado dado el clima extremo y actividades al aire libre.',
    },
    guia: {
      queVer: 'Parque Nacional Tierra del Fuego, Canal Beagle, Pingüinera Martillo, Glaciar Martial, Tren del Fin del Mundo.',
      cuandoIr: 'Noviembre a marzo para trekking; junio-agosto para nieve y esquí en Cerro Castor.',
      cuantosDias: '4 a 7 días.',
      tips: 'El clima cambia muy rápido; reservar todas las excursiones en avance.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.7, cantidad: 28000, url: 'https://www.tripadvisor.com/Tourism-g312844-Ushuaia_Province_of_Tierra_del_Fuego_Patagonia-Vacations.html' },
    },
  },
  {
    id: 'jujuy',
    slug: 'jujuy',
    nombre: 'Jujuy – Quebrada de Humahuaca',
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Colores de la Quebrada, altiplano y Patrimonio UNESCO.',
    imageUrl: 'https://images.unsplash.com/photo-1609350051988-60e6cf4ec7a9?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('jujuy'),
    presupuestoEstimado: { minARS: 200_000, maxARS: 700_000 },
    itinerario: {
      inicio: 'Salta o Buenos Aires',
      paradas: ['Tilcara', 'Humahuaca', 'Purmamarca (Cerro 7 Colores)', 'Salinas Grandes'],
      fin: 'Regreso desde Jujuy',
      distanciaTotalKm: 2000,
      duracionDias: 4,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos', 'familia'],
      experiencia: ['ciudad_cultura', 'montana_naturaleza'],
      presupuesto: ['economico', 'medio', 'sin_mirar'],
      dias: ['fin_semana', 'una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: true,
      notas: 'Solo DNI. La altitud puede afectar (Salinas Grandes a 3400 m); seguro médico recomendado.',
    },
    guia: {
      queVer: 'Cerro de los 7 Colores (Purmamarca), Salinas Grandes, Quebrada de Humahuaca, Tilcara y su Pucará.',
      cuandoIr: 'Mayo a octubre clima seco y cielos despejados; enero-marzo posibles lluvias.',
      cuantosDias: '3 a 6 días.',
      tips: 'Hidratarse bien por la altura; no acelerar en los primeros días.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.7, cantidad: 18000, url: 'https://www.tripadvisor.com/Tourism-g312744-Jujuy_Province_of_Jujuy_Northwest_Argentina-Vacations.html' },
    },
  },
  {
    id: 'el-bolson',
    slug: 'el-bolson',
    nombre: 'El Bolsón',
    pais: 'Argentina',
    region: 'argentina',
    descripcionCorta: 'Patagonia ecológica, ríos y mercado artesanal.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('el-bolson'),
    presupuestoEstimado: { minARS: 200_000, maxARS: 700_000 },
    itinerario: {
      inicio: 'Bariloche',
      paradas: ['Feria artesanal', 'Cerro Piltriquitrón', 'Lago Puelo'],
      fin: 'Regreso a Bariloche',
      distanciaTotalKm: 500,
      duracionDias: 3,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos'],
      experiencia: ['montana_naturaleza', 'aventura_deporte'],
      presupuesto: ['economico', 'medio'],
      dias: ['fin_semana', 'una_semana'],
    },
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: false,
      notas: 'Solo DNI para viaje doméstico.',
    },
    guia: {
      queVer: 'Feria artesanal, Cascada Mallín Ahogado, Lago Puelo, Cerro Piltriquitrón, cerveza artesanal.',
      cuandoIr: 'Noviembre a abril para buen clima; invierno muy frío.',
      cuantosDias: '2 a 5 días.',
      tips: 'Combinar con Bariloche o Lago Puelo; ambiente muy relajado y ecológico.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.5, cantidad: 9000, url: 'https://www.tripadvisor.com/Tourism-g312852-El_Bolson_Province_of_Rio_Negro_Patagonia-Vacations.html' },
    },
  },

  /* ─────────────────────────────────── SUDAMÉRICA (Internacional) ── */
  {
    id: 'rio-de-janeiro',
    slug: 'rio-de-janeiro',
    nombre: 'Río de Janeiro',
    pais: 'Brasil',
    region: 'sudamerica',
    descripcionCorta: 'Playas icónicas, Cristo Redentor y carnaval.',
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('rio-de-janeiro'),
    presupuestoEstimado: { minARS: 800_000, maxARS: 2_500_000 },
    itinerario: {
      inicio: 'Buenos Aires (EZE)',
      paradas: ['Vuelo a Río', 'Copacabana / Ipanema', 'Cristo Redentor', 'Pan de Azúcar'],
      fin: 'Regreso desde Río',
      distanciaTotalKm: 4000,
      duracionDias: 6,
    },
    atributos: {
      compania: ['pareja', 'amigos', 'familia'],
      experiencia: ['playa_relax', 'ciudad_cultura', 'aventura_deporte'],
      presupuesto: ['medio', 'sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: true,
      vacunas: ['Fiebre amarilla (recomendada)'],
      notas: 'Ciudadanos argentinos pueden ingresar a Brasil solo con DNI. Seguro de viaje muy recomendado.',
    },
    guia: {
      queVer: 'Cristo Redentor, Pan de Azúcar, Copacabana, Ipanema, Santa Teresa, lapa y vida nocturna.',
      cuandoIr: 'Abril a septiembre clima más suave; diciembre a marzo calor y Carnaval.',
      cuantosDias: '5 a 10 días.',
      tips: 'Precaución con objetos de valor; moverse en transporte confiable; disfrutar la gastronomía.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.6, cantidad: 210000, url: 'https://www.tripadvisor.com/Tourism-g303506-Rio_de_Janeiro_State_of_Rio_de_Janeiro-Vacations.html' },
    },
  },
  {
    id: 'cusco',
    slug: 'cusco',
    nombre: 'Cusco y Machu Picchu',
    pais: 'Perú',
    region: 'sudamerica',
    descripcionCorta: 'Capital del Imperio Inca y la ciudadela perdida.',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('cusco-machu-picchu'),
    presupuestoEstimado: { minARS: 700_000, maxARS: 2_000_000 },
    itinerario: {
      inicio: 'Buenos Aires (EZE)',
      paradas: ['Vuelo a Cusco', 'Aclimatación en Cusco', 'Valle Sagrado', 'Machu Picchu', 'Aguas Calientes'],
      fin: 'Regreso desde Lima o Cusco',
      distanciaTotalKm: 4500,
      duracionDias: 7,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos'],
      experiencia: ['ciudad_cultura', 'montana_naturaleza', 'aventura_deporte'],
      presupuesto: ['medio', 'sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: true,
      vacunas: ['Fiebre amarilla (si vas a la selva)'],
      notas: 'Ciudadanos argentinos ingresan con DNI. Cusco está a 3400 msnm: tomá tiempo para aclimatarte.',
    },
    guia: {
      queVer: 'Machu Picchu, Plaza de Armas de Cusco, Valle Sagrado (Ollantaytambo, Pisac), Lago Titicaca opcional.',
      cuandoIr: 'Mayo a octubre estación seca; noviembre a abril lluvias (aunque verde y menos turistas).',
      cuantosDias: '6 a 10 días.',
      tips: 'Reservar entradas a Machu Picchu con meses de anticipación; no subestimar la altura.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.8, cantidad: 165000, url: 'https://www.tripadvisor.com/Tourism-g294314-Cusco_Cusco_Region-Vacations.html' },
    },
  },
  {
    id: 'santiago-de-chile',
    slug: 'santiago-de-chile',
    nombre: 'Santiago de Chile',
    pais: 'Chile',
    region: 'sudamerica',
    descripcionCorta: 'Ciudad moderna entre la cordillera y el mar.',
    imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('santiago-chile'),
    presupuestoEstimado: { minARS: 400_000, maxARS: 1_300_000 },
    itinerario: {
      inicio: 'Buenos Aires (AEP)',
      paradas: ['Vuelo o bus a Santiago', 'Barrio Bellavista / Lastarria', 'Cerro San Cristóbal', 'Valparaíso'],
      fin: 'Regreso desde Santiago',
      distanciaTotalKm: 1500,
      duracionDias: 4,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos', 'familia'],
      experiencia: ['ciudad_cultura', 'gastronomia_vino', 'montana_naturaleza'],
      presupuesto: ['medio', 'sin_mirar'],
      dias: ['fin_semana', 'una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: false,
      visa: false,
      seguroRecomendado: true,
      notas: 'Ciudadanos argentinos pueden entrar a Chile con DNI. Seguro recomendado para actividades de montaña.',
    },
    guia: {
      queVer: 'Barrio Bellavista, Cerro San Cristóbal, Valparaíso (murales y cerros), viñas del Maipo, esquí en el Cajón del Maipo.',
      cuandoIr: 'Septiembre a noviembre y marzo a mayo son ideales; invierno para ski.',
      cuantosDias: '3 a 7 días.',
      tips: 'Combinar Santiago con Valparaíso (1h en bus); gastronomía chilena muy variada.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.5, cantidad: 88000, url: 'https://www.tripadvisor.com/Tourism-g294305-Santiago_Santiago_Metropolitan_Region-Vacations.html' },
    },
  },

  /* ─────────────────────────────── NORTEAMÉRICA ── */
  {
    id: 'miami',
    slug: 'miami',
    nombre: 'Miami',
    pais: 'Estados Unidos',
    region: 'norteamerica',
    descripcionCorta: 'Playas, arte, gastronomía y vida nocturna en Florida.',
    imageUrl: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('miami'),
    presupuestoEstimado: { minARS: 1_500_000, maxARS: 5_000_000 },
    itinerario: {
      inicio: 'Buenos Aires (EZE)',
      paradas: ['Vuelo a Miami', 'South Beach / Ocean Drive', 'Wynwood & arte', 'Key West o Everglades'],
      fin: 'Regreso desde Miami',
      distanciaTotalKm: 9000,
      duracionDias: 7,
    },
    atributos: {
      compania: ['pareja', 'amigos', 'familia'],
      experiencia: ['playa_relax', 'ciudad_cultura', 'gastronomia_vino'],
      presupuesto: ['sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: true,
      visa: true,
      visaInfo: 'Visa de turista B1/B2 requerida para ciudadanos argentinos. Tramitar con anticipación en el consulado de EE.UU.',
      seguroRecomendado: true,
      notas: 'Se requiere pasaporte vigente y visa B1/B2. El seguro médico es indispensable dado el costo de la salud en EE.UU.',
    },
    guia: {
      queVer: 'South Beach, Wynwood (arte urbano), Little Havana, Design District, Everglades, Key West.',
      cuandoIr: 'Noviembre a abril clima ideal; mayo a octubre calor y temporada de huracanes.',
      cuantosDias: '5 a 10 días.',
      tips: 'Alquilar auto es muy conveniente; dólar tarjeta o efectivo; tip del 20% en restaurantes.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.5, cantidad: 320000, url: 'https://www.tripadvisor.com/Tourism-g34438-Miami_Florida-Vacations.html' },
    },
  },
  {
    id: 'nueva-york',
    slug: 'nueva-york',
    nombre: 'Nueva York',
    pais: 'Estados Unidos',
    region: 'norteamerica',
    descripcionCorta: 'La ciudad que nunca duerme: cultura, gastronomía y energía.',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('nueva-york'),
    presupuestoEstimado: { minARS: 2_000_000, maxARS: 8_000_000 },
    itinerario: {
      inicio: 'Buenos Aires (EZE)',
      paradas: ['Vuelo a JFK/EWR', 'Manhattan', 'Brooklyn', 'Queens / Central Park', 'Museos'],
      fin: 'Regreso desde Nueva York',
      distanciaTotalKm: 10500,
      duracionDias: 8,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos'],
      experiencia: ['ciudad_cultura', 'gastronomia_vino'],
      presupuesto: ['sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: true,
      visa: true,
      visaInfo: 'Visa de turista B1/B2 requerida para ciudadanos argentinos. Tramitar con meses de anticipación.',
      seguroRecomendado: true,
      notas: 'Pasaporte vigente + visa B1/B2. Seguro de viaje imprescindible: la salud en EE.UU. es muy costosa.',
    },
    guia: {
      queVer: 'Central Park, Times Square, Statue of Liberty, MoMA, Brooklyn Bridge, Chelsea Market, Broadway.',
      cuandoIr: 'Abril-junio y septiembre-noviembre para clima ideal; diciembre para navidad.',
      cuantosDias: '7 a 14 días.',
      tips: 'Metrocard para moverse; reservar Broadway con anticipación; explorar barrios fuera de Manhattan.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.7, cantidad: 780000, url: 'https://www.tripadvisor.com/Tourism-g60763-New_York_City_New_York-Vacations.html' },
    },
  },

  /* ──────────────────────────────────────── EUROPA ── */
  {
    id: 'barcelona',
    slug: 'barcelona',
    nombre: 'Barcelona',
    pais: 'España',
    region: 'europa',
    descripcionCorta: 'Gaudí, playa, tapas y arquitectura única en la Costa Brava.',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('barcelona'),
    presupuestoEstimado: { minARS: 2_000_000, maxARS: 6_000_000 },
    itinerario: {
      inicio: 'Buenos Aires (EZE)',
      paradas: ['Vuelo a Barcelona', 'Sagrada Familia / Gaudí', 'La Barceloneta', 'El Born / Gothic', 'Montserrat'],
      fin: 'Regreso desde Barcelona',
      distanciaTotalKm: 12000,
      duracionDias: 8,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos', 'familia'],
      experiencia: ['ciudad_cultura', 'playa_relax', 'gastronomia_vino'],
      presupuesto: ['sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: true,
      visa: false,
      visaInfo: 'Argentinos pueden ingresar sin visa al espacio Schengen hasta 90 días. Posible ETIAS requerido próximamente.',
      seguroRecomendado: true,
      notas: 'Pasaporte vigente. Sin visa para estancias turísticas. Seguro muy recomendado para viajes a Europa.',
    },
    guia: {
      queVer: 'Sagrada Familia, Casa Batlló, Park Güell, La Barceloneta, Las Ramblas, El Born, Montserrat.',
      cuandoIr: 'Mayo a junio y septiembre a octubre clima ideal; julio-agosto calor y muchos turistas.',
      cuantosDias: '5 a 10 días.',
      tips: 'Comprar entradas a Sagrada Familia con anticipación; moverse en metro; explorar barrios menos turísticos.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.7, cantidad: 520000, url: 'https://www.tripadvisor.com/Tourism-g187497-Barcelona_Catalonia-Vacations.html' },
    },
  },
  {
    id: 'paris',
    slug: 'paris',
    nombre: 'París',
    pais: 'Francia',
    region: 'europa',
    descripcionCorta: 'La ciudad del amor, la moda y el arte.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('paris'),
    presupuestoEstimado: { minARS: 2_500_000, maxARS: 7_000_000 },
    itinerario: {
      inicio: 'Buenos Aires (EZE)',
      paradas: ['Vuelo a CDG', 'Torre Eiffel / Champ de Mars', 'El Louvre', 'Montmartre', 'Versailles'],
      fin: 'Regreso desde París',
      distanciaTotalKm: 12500,
      duracionDias: 8,
    },
    atributos: {
      compania: ['pareja', 'amigos', 'familia'],
      experiencia: ['ciudad_cultura', 'gastronomia_vino'],
      presupuesto: ['sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: true,
      visa: false,
      visaInfo: 'Argentinos pueden ingresar sin visa al espacio Schengen hasta 90 días. ETIAS podría requerirse próximamente.',
      seguroRecomendado: true,
      notas: 'Pasaporte vigente. Sin visa para turismo. El seguro de viaje es muy recomendado en Europa.',
    },
    guia: {
      queVer: 'Torre Eiffel, Museo del Louvre, Notre Dame, Montmartre y Sacré-Cœur, Versailles, Orsay.',
      cuandoIr: 'Abril a junio y septiembre a octubre son los meses ideales.',
      cuantosDias: '5 a 10 días.',
      tips: 'Comprar el Paris Museum Pass; usar el Metro; reservar el Louvre con anticipación.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.7, cantidad: 680000, url: 'https://www.tripadvisor.com/Tourism-g187147-Paris_Ile_de_France-Vacations.html' },
    },
  },
  {
    id: 'roma',
    slug: 'roma',
    nombre: 'Roma',
    pais: 'Italia',
    region: 'europa',
    descripcionCorta: 'Historia milenaria, pasta, vino y el Vaticano.',
    imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('roma'),
    presupuestoEstimado: { minARS: 2_000_000, maxARS: 6_000_000 },
    itinerario: {
      inicio: 'Buenos Aires (EZE)',
      paradas: ['Vuelo a Fiumicino', 'Coliseo / Foro Romano', 'Vaticano / Museos', 'Trastevere', 'Fontana di Trevi'],
      fin: 'Regreso desde Roma',
      distanciaTotalKm: 12000,
      duracionDias: 7,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos', 'familia'],
      experiencia: ['ciudad_cultura', 'gastronomia_vino'],
      presupuesto: ['sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: true,
      visa: false,
      visaInfo: 'Argentinos pueden ingresar sin visa al espacio Schengen hasta 90 días.',
      seguroRecomendado: true,
      notas: 'Pasaporte vigente. Sin visa para turismo en zona Schengen. Seguro de viaje altamente recomendado.',
    },
    guia: {
      queVer: 'Coliseo y Foro Romano, Vaticano y Museos Vaticanos, Fontana di Trevi, Panteón, Trastevere.',
      cuandoIr: 'Abril a junio y septiembre a octubre para evitar el calor y multitudes del verano.',
      cuantosDias: '4 a 8 días.',
      tips: 'Reservar el Vaticano y Coliseo con anticipación; hidratarse; usar calzado cómodo.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.7, cantidad: 590000, url: 'https://www.tripadvisor.com/Tourism-g187791-Rome_Lazio-Vacations.html' },
    },
  },
  {
    id: 'madrid',
    slug: 'madrid',
    nombre: 'Madrid',
    pais: 'España',
    region: 'europa',
    descripcionCorta: 'Museos, parques, tapas y vida urbana en el corazón de España.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('madrid-es'),
    presupuestoEstimado: { minARS: 1_800_000, maxARS: 5_500_000 },
    itinerario: {
      inicio: 'Buenos Aires (EZE)',
      paradas: ['Vuelo a Madrid', 'Museo del Prado / Reina Sofía', 'Retiro y Gran Vía', 'Toledo (excursión)'],
      fin: 'Regreso desde Madrid',
      distanciaTotalKm: 11500,
      duracionDias: 7,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos', 'familia'],
      experiencia: ['ciudad_cultura', 'gastronomia_vino'],
      presupuesto: ['sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: true,
      visa: false,
      visaInfo: 'Argentinos pueden ingresar sin visa al espacio Schengen hasta 90 días.',
      seguroRecomendado: true,
      notas: 'Pasaporte vigente. Seguro de viaje recomendado.',
    },
    guia: {
      queVer: 'Prado, Reina Sofía, Palacio Real, Parque del Retiro, barrios de Malasaña y La Latina, excursiones a Toledo o Segovia.',
      cuandoIr: 'Primavera y otoño ideales; verano caluroso; invierno frío pero menos turistas.',
      cuantosDias: '4 a 8 días.',
      tips: 'Metro muy eficiente; reservar museos con anticipación; tapear por barrios.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.6, cantidad: 410000, url: 'https://www.tripadvisor.com/Tourism-g187514-Madrid-Vacations.html' },
    },
  },
  {
    id: 'londres',
    slug: 'londres',
    nombre: 'Londres',
    pais: 'Reino Unido',
    region: 'europa',
    descripcionCorta: 'Historia, teatros, museos gratis y barrios icónicos.',
    imageUrl: 'https://images.unsplash.com/photo-1513635269976-596ae14418a0?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('londres-uk'),
    presupuestoEstimado: { minARS: 2_200_000, maxARS: 7_500_000 },
    itinerario: {
      inicio: 'Buenos Aires (EZE)',
      paradas: ['Vuelo a Londres', 'Westminster / Big Ben', 'British Museum', 'Camden / Notting Hill'],
      fin: 'Regreso desde Londres',
      distanciaTotalKm: 11800,
      duracionDias: 8,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos', 'familia'],
      experiencia: ['ciudad_cultura', 'gastronomia_vino'],
      presupuesto: ['sin_mirar'],
      dias: ['una_semana', 'dos_o_mas'],
    },
    documentacion: {
      pasaporte: true,
      visa: false,
      visaInfo: 'Argentinos pueden ingresar como turistas sin visa por hasta 6 meses (verificar requisitos vigentes).',
      seguroRecomendado: true,
      notas: 'Pasaporte vigente. Seguro muy recomendado (salud cara en UK).',
    },
    guia: {
      queVer: 'Big Ben, Westminster, Tower Bridge, British Museum, Tate Modern, Camden Market, Hyde Park, musicales en West End.',
      cuandoIr: 'Mayo a septiembre más luz y clima agradable; diciembre por ambiente navideño.',
      cuantosDias: '5 a 10 días.',
      tips: 'Oyster card o contactless para transporte; muchos museos son gratis; reservar musicales con anticipación.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.7, cantidad: 920000, url: 'https://www.tripadvisor.com/Tourism-g186338-London_England-Vacations.html' },
    },
  },

  /* ────────────────────────────────────────── ASIA ── */
  {
    id: 'tokio',
    slug: 'tokio',
    nombre: 'Tokio',
    pais: 'Japón',
    region: 'asia',
    descripcionCorta: 'Tradición y futuro en la metrópolis más asombrosa del mundo.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80',
    imageUrls: fotos('tokio'),
    presupuestoEstimado: { minARS: 3_000_000, maxARS: 8_000_000 },
    itinerario: {
      inicio: 'Buenos Aires (EZE)',
      paradas: ['Vuelo a Tokio (NRT/HND)', 'Shinjuku / Akihabara', 'Asakusa (Senso-ji)', 'Shibuya / Harajuku', 'Nikko o Kamakura'],
      fin: 'Regreso desde Tokio',
      distanciaTotalKm: 18500,
      duracionDias: 10,
    },
    atributos: {
      compania: ['solo', 'pareja', 'amigos'],
      experiencia: ['ciudad_cultura', 'gastronomia_vino', 'aventura_deporte'],
      presupuesto: ['sin_mirar'],
      dias: ['dos_o_mas'],
    },
    documentacion: {
      pasaporte: true,
      visa: false,
      visaInfo: 'Ciudadanos argentinos pueden ingresar a Japón sin visa hasta 90 días (acuerdo bilateral).',
      seguroRecomendado: true,
      notas: 'Pasaporte vigente. Sin visa para turismo. Seguro de viaje muy recomendado para un viaje tan largo.',
    },
    guia: {
      queVer: 'Senso-ji (Asakusa), Shibuya Crossing, Shinjuku, Akihabara, Harajuku, Meiji Shrine, mont Fuji (excursión).',
      cuandoIr: 'Marzo-mayo (cerezos) y septiembre-noviembre son las mejores épocas.',
      cuantosDias: '10 a 21 días para Tokio + otras ciudades (Kioto, Osaka).',
      tips: 'Comprar JR Pass antes de viajar; IC Card para moverse en metro; cash es rey en muchos lugares.',
    },
    reseñasExternas: {
      tripadvisor: { puntaje: 4.8, cantidad: 450000, url: 'https://www.tripadvisor.com/Tourism-g298184-Tokyo_Tokyo_Prefecture_Kanto-Vacations.html' },
    },
  },
];

export function getDestinoBySlug(slug: string): Destino | undefined {
  return destinos.find((d) => d.slug === slug);
}
