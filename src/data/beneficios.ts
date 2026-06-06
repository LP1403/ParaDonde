import type { NivelMetal } from './reputacion';

export type TipoBeneficio = 'descuento' | 'acceso_vip' | 'prioridad' | 'regalo' | 'experiencia';

export interface Beneficio {
  id: string;
  nivelMinimo: NivelMetal;
  titulo: string;
  descripcion: string;
  proveedor: string;
  tipo: TipoBeneficio;
  valor: string;
  codigoPromo: string;
  icono: string;
  destinoSlug?: string; // si no tiene, es global
}

export const BENEFICIOS: Beneficio[] = [
  // ── Bronce (Turista) ──────────────────────────────────────────────
  {
    id: 'bronce-cafe-10',
    nivelMinimo: 'bronce',
    titulo: '10% OFF en cafeterías adheridas',
    descripcion: 'Presentá tu nivel Turista en cualquier cafetería de la red Para Dónde y obtené 10% de descuento en tu consumo.',
    proveedor: 'Red Para Dónde Café',
    tipo: 'descuento',
    valor: '10% OFF',
    codigoPromo: 'PDTURISTA10',
    icono: '☕',
  },
  {
    id: 'bronce-guia-digital',
    nivelMinimo: 'bronce',
    titulo: 'Guía digital del destino',
    descripcion: 'Acceso a la guía PDF descargable de tu destino con tips locales y mapas offline.',
    proveedor: 'Para Dónde Digital',
    tipo: 'regalo',
    valor: 'Gratis',
    codigoPromo: 'PDGUIA2024',
    icono: '📖',
  },

  // ── Plata (Explorador) ────────────────────────────────────────────
  {
    id: 'plata-tour-15',
    nivelMinimo: 'plata',
    titulo: '15% OFF en tours y excursiones',
    descripcion: 'Obtené 15% de descuento en tours locales y excursiones de día completo a través de operadores adheridos.',
    proveedor: 'Red de Operadores Para Dónde',
    tipo: 'descuento',
    valor: '15% OFF',
    codigoPromo: 'PDEXPLORA15',
    icono: '🗺️',
  },
  {
    id: 'plata-hostel-upgrade',
    nivelMinimo: 'plata',
    titulo: 'Upgrade de habitación en hostels adheridos',
    descripcion: 'Pedí la habitación de mayor categoría disponible sin costo adicional al check-in.',
    proveedor: 'Hostels Para Dónde',
    tipo: 'acceso_vip',
    valor: 'Upgrade gratis',
    codigoPromo: 'PDUPGRADE',
    icono: '🏨',
  },
  {
    id: 'plata-seg-descuento',
    nivelMinimo: 'plata',
    titulo: '20% OFF en seguro de viaje',
    descripcion: 'Seguro de viaje con cobertura internacional con 20% de descuento en Assist-Card y Allianz.',
    proveedor: 'Assist-Card / Allianz',
    tipo: 'descuento',
    valor: '20% OFF',
    codigoPromo: 'PDSEGURO20',
    icono: '🛡️',
  },

  // ── Oro (Conocedor) ───────────────────────────────────────────────
  {
    id: 'oro-restaurante-vip',
    nivelMinimo: 'oro',
    titulo: 'Mesa VIP en restaurantes top',
    descripcion: 'Reserva con mesa prioritaria y menú degustación con 25% de descuento en los mejores restaurantes adheridos.',
    proveedor: 'Red Gastronómica Para Dónde',
    tipo: 'acceso_vip',
    valor: '25% OFF + prioridad',
    codigoPromo: 'PDCONOCE25',
    icono: '🍽️',
  },
  {
    id: 'oro-late-checkout',
    nivelMinimo: 'oro',
    titulo: 'Late check-out garantizado',
    descripcion: 'Salida hasta las 14hs sin cargo adicional en hoteles y apart-hoteles de la red.',
    proveedor: 'Hoteles Para Dónde',
    tipo: 'prioridad',
    valor: 'Check-out 14hs',
    codigoPromo: 'PDLATE14',
    icono: '🕑',
  },
  {
    id: 'oro-museo-gratis',
    nivelMinimo: 'oro',
    titulo: 'Entrada gratis a museos adheridos',
    descripcion: 'Acceso sin costo a museos y atracciones culturales de la red en 15 destinos.',
    proveedor: 'Red Cultural Para Dónde',
    tipo: 'regalo',
    valor: 'Gratis',
    codigoPromo: 'PDMUSEOFREE',
    icono: '🏛️',
  },
  {
    id: 'oro-traslado-30',
    nivelMinimo: 'oro',
    titulo: '30% OFF en traslados al aeropuerto',
    descripcion: '30% de descuento en traslados privados aeropuerto-ciudad en más de 20 destinos.',
    proveedor: 'Transfer Para Dónde',
    tipo: 'descuento',
    valor: '30% OFF',
    codigoPromo: 'PDTRANSFER30',
    icono: '🚗',
  },

  // ── Platino (Experto) ─────────────────────────────────────────────
  {
    id: 'platino-lounge',
    nivelMinimo: 'platino',
    titulo: 'Acceso a salones VIP de aeropuerto',
    descripcion: 'Acceso gratuito a salas VIP en más de 40 aeropuertos de América Latina, Europa y Asia.',
    proveedor: 'LoungeKey / DragonPass',
    tipo: 'acceso_vip',
    valor: 'Acceso ilimitado',
    codigoPromo: 'PDLOUNGE',
    icono: '✈️',
  },
  {
    id: 'platino-guia-privado',
    nivelMinimo: 'platino',
    titulo: 'Tour guiado privado (2h)',
    descripcion: 'Un tour privado de 2 horas con guía certificado en el destino de tu elección. Una vez por viaje.',
    proveedor: 'Guías Para Dónde',
    tipo: 'experiencia',
    valor: '1 tour gratis',
    codigoPromo: 'PDPRIVATOUR',
    icono: '🎙️',
  },
  {
    id: 'platino-hotel-noche',
    nivelMinimo: 'platino',
    titulo: 'Noche extra gratis en hoteles adheridos',
    descripcion: 'Reservando 3 noches, la cuarta es sin cargo en más de 50 propiedades adheridas.',
    proveedor: 'Red Hotelera Para Dónde',
    tipo: 'regalo',
    valor: '1 noche gratis',
    codigoPromo: 'PDNOCHE4TA',
    icono: '🌙',
  },
  {
    id: 'platino-seguro-premium',
    nivelMinimo: 'platino',
    titulo: 'Seguro de viaje premium incluido',
    descripcion: 'Cobertura premium de seguro de viaje con asistencia 24/7 para tus próximos 2 viajes.',
    proveedor: 'Assistcard Premium',
    tipo: 'regalo',
    valor: '2 viajes cubiertos',
    codigoPromo: 'PDPREMIUMSEG',
    icono: '🛡️',
  },

  // ── Diamante (Leyenda) ────────────────────────────────────────────
  {
    id: 'diamante-concierge',
    nivelMinimo: 'diamante',
    titulo: 'Concierge personal Para Dónde',
    descripcion: 'Un asesor de viajes personal disponible por WhatsApp para planificar tu próxima aventura. Servicio prioritario exclusivo.',
    proveedor: 'Para Dónde Concierge',
    tipo: 'acceso_vip',
    valor: 'Exclusivo',
    codigoPromo: 'PDLEGEND',
    icono: '⭐',
  },
  {
    id: 'diamante-upgrade-vuelo',
    nivelMinimo: 'diamante',
    titulo: 'Upgrade de clase en vuelos adheridos',
    descripcion: 'Solicitud prioritaria de upgrade a Business en vuelos con aerolíneas de la red. Sujeto a disponibilidad.',
    proveedor: 'Aerolíneas Adheridas',
    tipo: 'prioridad',
    valor: 'Upgrade prioritario',
    codigoPromo: 'PDBIZUPGRADE',
    icono: '💺',
  },
  {
    id: 'diamante-experiencia-local',
    nivelMinimo: 'diamante',
    titulo: 'Experiencia local secreta',
    descripcion: 'Acceso a experiencias exclusivas no publicadas: cenas en casas de chef, acceso a shows privados, tours off-the-beaten-path.',
    proveedor: 'Para Dónde Experiences',
    tipo: 'experiencia',
    valor: 'Exclusivo Leyenda',
    codigoPromo: 'PDSECRET',
    icono: '🗝️',
  },
  {
    id: 'diamante-badge-global',
    nivelMinimo: 'diamante',
    titulo: 'Badge verificado en el perfil',
    descripcion: 'Tu perfil muestra el badge de Leyenda verificado, generando confianza en toda la red de viajeros Para Dónde.',
    proveedor: 'Para Dónde Red',
    tipo: 'acceso_vip',
    valor: 'Badge exclusivo',
    codigoPromo: 'PDLEGBADGE',
    icono: '💠',
  },
];

export function getBeneficiosPorNivel(nivel: NivelMetal): Beneficio[] {
  const orden: NivelMetal[] = ['bronce', 'plata', 'oro', 'platino', 'diamante'];
  const idxNivel = orden.indexOf(nivel);
  return BENEFICIOS.filter((b) => orden.indexOf(b.nivelMinimo) <= idxNivel);
}

export function getBeneficiosDesbloqueadosEn(nivel: NivelMetal): Beneficio[] {
  return BENEFICIOS.filter((b) => b.nivelMinimo === nivel);
}
