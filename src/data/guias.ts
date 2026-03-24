export interface GuiaTematica {
  id: string;
  slug: string;
  titulo: string;
  descripcionCorta: string;
  contenido: string;
  linksOficiales: { label: string; url: string }[];
  /** Si está definido, se muestran estas secciones en lugar de contenido único (ej. por país) */
  secciones?: {
    titulo: string;
    cuerpo: string;
    links: { label: string; url: string }[];
  }[];
}

export const guiasTematicas: GuiaTematica[] = [
  {
    id: 'documentacion-viajar',
    slug: 'documentacion-viajar',
    titulo: 'Documentación para viajar',
    descripcionCorta: 'Por destino: EEUU, España, MERCOSUR. Pasaporte, visa, seguro, vacunas.',
    contenido: '',
    linksOficiales: [
      { label: 'Argentina.gob.ar', url: 'https://www.argentina.gob.ar/' },
      { label: 'Cancillería', url: 'https://www.cancilleria.gob.ar/' },
      { label: 'SENASA (mascotas)', url: 'https://www.argentina.gob.ar/senasa' },
    ],
    secciones: [
      {
        titulo: 'Estados Unidos',
        cuerpo: `Para ingresar a Estados Unidos desde Argentina necesitás:

• **Pasaporte** válido (vigencia mínima 6 meses recomendada).
• **Visa** o **ESTA** (autorización electrónica): la mayoría de los turistas argentinos viajan con ESTA para estancias de hasta 90 días. Debe tramitarse online con anticipación.
• **Seguro de viaje** muy recomendable (no obligatorio para ingresar, pero útil ante emergencias médicas).

Consultá requisitos actualizados y tramitación de visa/ESTA en la embajada o consulado de EE.UU. y en el sitio oficial del Departamento de Estado.`,
        links: [
          { label: 'Embajada de EE.UU. en Argentina', url: 'https://ar.usembassy.gov/' },
          { label: 'ESTA (autorización electrónica)', url: 'https://esta.cbp.dhs.gov/' },
          { label: 'Argentina.gob.ar - Trámites y documentación', url: 'https://www.argentina.gob.ar/' },
        ],
      },
      {
        titulo: 'España',
        cuerpo: `Para viajar a España desde Argentina:

• **Pasaporte** válido (vigencia mínima 3 meses desde la fecha de salida del espacio Schengen).
• Ciudadanos argentinos **no necesitan visa** para estancias turísticas de hasta 90 días en 180 días (espacio Schengen).
• **Seguro de viaje** con cobertura médica mínima exigida por Schengen (recomendado).

Requisitos de entrada pueden cambiar; consultá siempre en la embajada o consulado de España y en la Cancillería argentina antes de viajar.`,
        links: [
          { label: 'Embajada de España en Argentina', url: 'https://www.exteriores.gob.es/Embajadas/buenosaires' },
          { label: 'Cancillería Argentina', url: 'https://www.cancilleria.gob.ar/' },
          { label: 'Argentina.gob.ar - Viajar al exterior', url: 'https://www.argentina.gob.ar/' },
        ],
      },
      {
        titulo: 'MERCOSUR (Brasil, Uruguay, Paraguay, Chile como asociado, etc.)',
        cuerpo: `Para viajar a países del MERCOSUR (Brasil, Uruguay, Paraguay y otros con acuerdos) desde Argentina:

• **Solo DNI** válido y en buen estado para argentinos (ciudadanos de los Estados parte del MERCOSUR).
• No es obligatorio llevar pasaporte para ingresar a Brasil, Uruguay o Paraguay en calidad de turista.
• **Menores:** pueden exigir partida de nacimiento o DNI y, según el país, autorización de los padres. Consultá en la frontera o en la Cancillería.
• **Seguro de viaje** no es obligatorio para ingresar pero se recomienda.

Los requisitos son en general los mismos para todos los países MERCOSUR; ante dudas, consultá en la Cancillería o en el consulado del país de destino.`,
        links: [
          { label: 'Cancillería Argentina - MERCOSUR', url: 'https://www.cancilleria.gob.ar/' },
          { label: 'Argentina.gob.ar - Requisitos de ingreso por país', url: 'https://www.argentina.gob.ar/' },
        ],
      },
    ],
  },
  {
    id: 'vuelo-cancelado-demorado',
    slug: 'vuelo-cancelado-demorado',
    titulo: 'Vuelo cancelado o demorado: tus derechos',
    descripcionCorta: 'Ley, pasos para reclamar y contacto ANAC.',
    contenido: `
## Derechos del pasajero (Argentina)
- **Ley 24240 + Decreto 809/2024.** En cancelación o demora por causa de la aerolínea tenés derecho a:
  - Vuelo siguiente o reembolso
  - Transporte terrestre y/o hotel si la demora supera 4 horas
  - Comida y compensación por daño moral
- **No aplica** si la causa es meteorológica; igual la aerolínea debe informarte tus derechos.

## Cómo reclamar
1. Primero con la aerolínea (por escrito).
2. Si no responden: Defensa del Consumidor.
3. Vía judicial si corresponde. Hay sentencias que condenan a aerolíneas.
    `.trim(),
    linksOficiales: [
      { label: 'ANAC', url: 'https://www.argentina.gob.ar/anac' },
      { label: 'Defensa del Consumidor', url: 'https://www.argentina.gob.ar/justicia/consumidor' },
    ],
  },
  {
    id: 'equipaje-extravido',
    slug: 'equipaje-extravido',
    titulo: 'Equipaje extraviado o dañado',
    descripcionCorta: 'Pasos, plazos (PIR) y a quién reclamar.',
    contenido: `
## Qué hacer
- Dejar **reclamo por escrito** (PIR o equivalente) en la aerolínea.
- **Plazos:** Daño 3–7 días según ruta; pérdida o retraso 10–21 días.
- Conservar pasaje y talón de equipaje.

## Si la aerolínea no responde
- Acudir a ANAC para asesoramiento y seguimiento.

## Micros larga distancia
- También hay derechos ante extravío o deterioro de equipaje. Pasos en argentina.gob.ar.
    `.trim(),
    linksOficiales: [
      { label: 'ANAC', url: 'https://www.argentina.gob.ar/anac' },
      { label: 'Argentina.gob.ar - Equipaje', url: 'https://www.argentina.gob.ar/' },
    ],
  },
  {
    id: 'que-llevar',
    slug: 'que-llevar',
    titulo: 'Qué llevar a un viaje',
    descripcionCorta: 'Checklist documentación y equipaje.',
    contenido: `
## Documentación
- DNI o pasaporte (vigencia según destino)
- Visa si aplica
- Seguro de viaje (póliza y teléfono)
- Copias digitales de todo
- Avisar al banco si usás tarjetas en el exterior

## Equipaje
- Ropa según clima del destino
- Medicamentos básicos y recetas si necesitás
- Adaptador de corriente si viajás al exterior
- Documentación de mascotas o menores si aplica
    `.trim(),
    linksOficiales: [
      { label: 'ANAC', url: 'https://www.argentina.gob.ar/anac' },
    ],
  },
  {
    id: 'pagar-exterior',
    slug: 'pagar-exterior',
    titulo: 'Pagar en el exterior',
    descripcionCorta: 'Dólar tarjeta, límites y cómo ahorrar.',
    contenido: `
## Dólar tarjeta
- Recargo del 30% sobre el tipo oficial en Argentina. Pagar el resumen en dólares (si tenés) puede ahorrar alrededor del 23%.
- Límites de compra de dólares (ej. 200 USD/mes oficial) afectan cuánto podés gastar afuera.

## Qué usar
- Tarjeta de crédito/débito, efectivo, billeteras digitales.
- Avisar al banco antes de viajar para evitar bloqueos.

## Calculadora
- Usá la calculadora de esta web (enlace en “Enlaces oficiales”) para estimar cuánto te llega a pagar en pesos según el dólar tarjeta.
    `.trim(),
    linksOficiales: [
      { label: 'BCRA - Información cambiaria', url: 'https://www.bcra.gob.ar/' },
      { label: 'Calculadora dólar tarjeta (esta web)', url: '/calculadora-dolar' },
    ],
  },
];

export function getGuiaBySlug(slug: string): GuiaTematica | undefined {
  return guiasTematicas.find((g) => g.slug === slug);
}
