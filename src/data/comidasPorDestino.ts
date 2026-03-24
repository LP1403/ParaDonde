/**
 * Preferencias de comida del wizard → tags canónicos.
 * Cada destino tiene platos/estilos típicos verificables en guías turísticas y cultura local.
 */
import type { Destino } from './destinos';

/** IDs de opción en `comida_pref` (pregunta aventura). */
export type ComidaMotorId =
  | 'parrilla'
  | 'empanadas'
  | 'pescado'
  | 'andina'
  | 'pasta_italiana'
  | 'criollo';

export const OPCIONES_COMIDA_AVENTURA: {
  id: ComidaMotorId;
  label: string;
  sub: string;
}[] = [
  {
    id: 'parrilla',
    label: 'Parrilla y asado',
    sub: 'Carne a la parrilla, asados',
  },
  {
    id: 'empanadas',
    label: 'Empanadas y horno',
    sub: 'Tucumán, Salta, Córdoba…',
  },
  {
    id: 'pescado',
    label: 'Pescado y mariscos',
    sub: 'Río, lago, costa atlántica',
  },
  {
    id: 'andina',
    label: 'Cocina andina',
    sub: 'Humitas, quinoa, tamales',
  },
  {
    id: 'pasta_italiana',
    label: 'Pasta, pizza y café',
    sub: 'Herencia italiana, bodegones',
  },
  {
    id: 'criollo',
    label: 'Locro, guisos y vino',
    sub: 'Cocina criolla y regiones vitivinícolas',
  },
];

/**
 * Mapeo destino → tags de comida (referencia: cocinas regionales argentinas y destinos internacionales típicos).
 */
export const COMIDAS_POR_DESTINO: Record<string, ComidaMotorId[]> = {
  'buenos-aires': ['parrilla', 'pasta_italiana', 'empanadas'],
  bariloche: ['parrilla', 'pasta_italiana', 'pescado'],
  'mar-del-plata': ['pescado', 'parrilla', 'pasta_italiana'],
  cordoba: ['empanadas', 'parrilla', 'criollo'],
  'villa-carlos-paz': ['parrilla', 'empanadas', 'pasta_italiana'],
  mendoza: ['criollo', 'parrilla', 'pasta_italiana'],
  'puerto-iguazu': ['pescado', 'parrilla', 'empanadas'],
  salta: ['andina', 'empanadas', 'criollo'],
  'termas-rio-hondo': ['empanadas', 'criollo', 'parrilla'],
  rosario: ['pescado', 'pasta_italiana', 'parrilla'],
  'el-calafate': ['parrilla', 'pasta_italiana', 'criollo'],
  ushuaia: ['pescado', 'parrilla', 'pasta_italiana'],
  jujuy: ['andina', 'empanadas', 'criollo'],
  'el-bolson': ['andina', 'parrilla', 'empanadas'],
  'san-martin-de-los-andes': ['pescado', 'parrilla', 'pasta_italiana'],
  'puerto-madryn': ['pescado', 'parrilla', 'criollo'],
  'san-miguel-de-tucuman': ['empanadas', 'criollo', 'parrilla'],
  'villa-la-angostura': ['pescado', 'parrilla', 'pasta_italiana'],
  'merlo-san-luis': ['empanadas', 'criollo', 'parrilla'],
  'tigre-delta': ['pescado', 'pasta_italiana', 'parrilla'],
  'rio-de-janeiro': ['pescado', 'parrilla', 'criollo'],
  cusco: ['andina', 'criollo', 'empanadas'],
  'santiago-de-chile': ['pescado', 'parrilla', 'pasta_italiana'],
  miami: ['pescado', 'pasta_italiana', 'parrilla'],
  'nueva-york': ['pasta_italiana', 'parrilla', 'pescado'],
  barcelona: ['pescado', 'pasta_italiana', 'parrilla'],
  paris: ['pasta_italiana', 'parrilla', 'pescado'],
  roma: ['pasta_italiana', 'parrilla', 'criollo'],
  madrid: ['parrilla', 'pescado', 'pasta_italiana'],
  londres: ['pescado', 'parrilla', 'pasta_italiana'],
  tokio: ['pescado', 'pasta_italiana', 'parrilla'],
  tulum: ['pescado', 'parrilla', 'criollo'],
  cancun: ['pescado', 'parrilla', 'criollo'],
  'punta-cana': ['pescado', 'parrilla', 'criollo'],
  'cartagena-colombia': ['pescado', 'criollo', 'parrilla'],
  'san-andres': ['pescado', 'parrilla', 'criollo'],
  bali: ['pescado', 'criollo', 'parrilla'],
  phuket: ['pescado', 'parrilla', 'criollo'],
  dubai: ['parrilla', 'pescado', 'pasta_italiana'],
  estambul: ['parrilla', 'pescado', 'criollo'],
  'ciudad-del-cabo': ['parrilla', 'pescado', 'criollo'],
};

export function comidasDestino(d: Destino): ComidaMotorId[] {
  if (d.comidasTipicas?.length) {
    return d.comidasTipicas as ComidaMotorId[];
  }
  return COMIDAS_POR_DESTINO[d.id] ?? ['parrilla', 'empanadas'];
}
