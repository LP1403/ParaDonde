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

export interface Destino {
  id: string;
  slug: string;
  nombre: string;
  descripcionCorta: string;
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
