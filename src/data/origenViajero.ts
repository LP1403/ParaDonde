/**
 * País desde el que el usuario inicia el viaje (residencia habitual).
 * Los textos legales son orientativos: siempre conviene verificar en sitios oficiales
 * (Migraciones Argentina, consulados, aerolíneas) antes de viajar.
 */

export interface PaisOrigenOpcion {
  id: string;
  label: string;
  /** Emoji opcional para UI */
  icon?: string;
}

/** Opciones mostradas en el wizard (orden: Argentina y vecinos primero). */
export const OPCIONES_ORIGEN_PAIS: PaisOrigenOpcion[] = [
  { id: 'ar', label: 'Argentina', icon: '🇦🇷' },
  { id: 'br', label: 'Brasil', icon: '🇧🇷' },
  { id: 'uy', label: 'Uruguay', icon: '🇺🇾' },
  { id: 'py', label: 'Paraguay', icon: '🇵🇾' },
  { id: 'cl', label: 'Chile', icon: '🇨🇱' },
  { id: 'bo', label: 'Bolivia', icon: '🇧🇴' },
  { id: 'us', label: 'Estados Unidos', icon: '🇺🇸' },
  { id: 'mx', label: 'México', icon: '🇲🇽' },
  { id: 'es', label: 'España', icon: '🇪🇸' },
  { id: 'fr', label: 'Francia', icon: '🇫🇷' },
  { id: 'de', label: 'Alemania', icon: '🇩🇪' },
  { id: 'it', label: 'Italia', icon: '🇮🇹' },
  { id: 'gb', label: 'Reino Unido', icon: '🇬🇧' },
  { id: 'ca', label: 'Canadá', icon: '🇨🇦' },
  { id: 'otros', label: 'Otro país', icon: '🌍' },
];

export function labelPaisOrigen(id: string): string {
  if (id === 'europa_otros') return 'Europa (otro país)';
  const o = OPCIONES_ORIGEN_PAIS.find((p) => p.id === id);
  return o?.label ?? id;
}

/** Normaliza ids del wizard /aventura hacia ids de ayuda (p. ej. europa_otros → otros). */
export function normalizarOrigenParaAyuda(id: string): string {
  if (id === 'europa_otros') return 'es';
  if (id === 'us') return 'us';
  return id;
}

export interface InfoDocumentacionOrigen {
  titulo: string;
  /** Párrafos cortos; siempre con aviso de verificación oficial */
  parrafos: string[];
  linksOficiales: { label: string; url: string }[];
  /** Ruta interna a guía de equipaje si aplica */
  guiaEquipajeTo?: string;
}

const AVISO =
  'La normativa cambia; confirmá fecha de vigencia en los enlaces oficiales antes de viajar.';

/** Texto según origen y si el destino es solo Argentina o incluye exterior. */
export function infoDocumentacionParaOrigen(
  origenId: string,
  opts: { soloArgentinaEnResultados: boolean },
): InfoDocumentacionOrigen {
  const soloAr = opts.soloArgentinaEnResultados;
  const oid = normalizarOrigenParaAyuda(origenId);

  if (oid === 'ar' || origenId === 'ar') {
    return {
      titulo: 'Documentación (viajás desde Argentina)',
      parrafos: soloAr
        ? [
            'Para viajar dentro del país suele alcanzar con DNI vigente (físico o digital según aceptación del transporte). Menores: documento que acredite identidad y filiación.',
            'No aplica pasaporte entre provincias. Si cruzás a países limítrofes o volás al exterior, revisá requisitos del país de destino y de la aerolínea.',
            AVISO,
          ]
        : [
            'Si tu itinerario incluye vuelos internacionales, llevá pasaporte vigente y revisá si el destino exige visa u otras autorizaciones.',
            'Para tramos solo domésticos en Argentina, el DNI suele ser suficiente.',
            AVISO,
          ],
      linksOficiales: [
        { label: 'RENAPER / DNI (Argentina.gob.ar)', url: 'https://www.argentina.gob.ar/interior/renaper' },
        { label: 'Migraciones Argentina', url: 'https://www.argentina.gob.ar/interior/migraciones' },
      ],
      guiaEquipajeTo: '/guias/que-llevar',
    };
  }

  if (['br', 'uy', 'py', 'cl', 'bo'].includes(oid) || ['br', 'uy', 'py', 'cl', 'bo'].includes(origenId)) {
    return {
      titulo: 'Documentación (América del Sur)',
      parrafos: soloAr
        ? [
            'Para ingresar a Argentina como turista suelen exigirse pasaporte u otro documento según acuerdos bilaterales; los requisitos exactos dependen de tu nacionalidad y del medio de ingreso (aéreo, terrestre).',
            'Consultá Migraciones Argentina y el consulado argentino en tu país o tu cancillería.',
            AVISO,
          ]
        : [
            'Combinás Argentina con otros países: revisá entrada y salida de cada estado y las conexiones (a veces hace falta visa de tránsito).',
            AVISO,
          ],
      linksOficiales: [
        { label: 'Migraciones Argentina', url: 'https://www.argentina.gob.ar/interior/migraciones' },
        { label: 'Información para extranjeros (Argentina)', url: 'https://www.argentina.gob.ar/interior/migraciones/direccion-nacional-migraciones' },
      ],
      guiaEquipajeTo: '/guias/que-llevar',
    };
  }

  return {
    titulo: 'Documentación (desde el exterior)',
    parrafos: [
      'Para ingresar a Argentina la mayoría de visitantes necesita pasaporte vigente; muchas nacionalidades no requieren visa de turismo por plazas acotadas, pero hay excepciones y cambios normativos.',
      'Si después visitás otros países del itinerario, revisá visa, vacunas y seguro de cada destino.',
      AVISO,
    ],
    linksOficiales: [
      { label: 'Migraciones Argentina', url: 'https://www.argentina.gob.ar/interior/migraciones' },
      { label: 'Guía documentación (Para Dónde)', url: '/guias/documentacion-viajar' },
    ],
    guiaEquipajeTo: '/guias/que-llevar',
  };
}
