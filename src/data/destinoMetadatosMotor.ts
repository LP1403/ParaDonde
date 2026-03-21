/**
 * Temporadas ideales por destino (hemisferio sur salvo que indique país).
 * 'todo_ano' = no penaliza ninguna época elegida por el usuario.
 */
export const TEMPORADAS_POR_DESTINO: Record<string, string[]> = {
  'buenos-aires': ['todo_ano'],
  'bariloche': ['invierno', 'verano', 'primavera'],
  'mar-del-plata': ['verano', 'primavera'],
  cordoba: ['primavera', 'verano', 'otono'],
  'villa-carlos-paz': ['verano', 'primavera'],
  mendoza: ['primavera', 'otono', 'invierno', 'verano'],
  'puerto-iguazu': ['primavera', 'otono', 'invierno', 'verano'],
  salta: ['primavera', 'otono', 'invierno'],
  'termas-rio-hondo': ['invierno', 'primavera', 'otono'],
  rosario: ['todo_ano'],
  'el-calafate': ['primavera', 'verano', 'otono'],
  ushuaia: ['primavera', 'verano', 'otono', 'invierno'],
  jujuy: ['primavera', 'otono', 'invierno'],
  'el-bolson': ['primavera', 'verano', 'otono'],
  'rio-de-janeiro': ['primavera', 'verano', 'otono'],
  cusco: ['primavera', 'otono', 'invierno'],
  'santiago-de-chile': ['todo_ano'],
  miami: ['primavera', 'invierno', 'otono'],
  'nueva-york': ['primavera', 'verano', 'otono'],
  barcelona: ['primavera', 'verano', 'otono'],
  paris: ['primavera', 'verano', 'otono'],
  roma: ['primavera', 'verano', 'otono'],
  madrid: ['primavera', 'verano', 'otono'],
  londres: ['primavera', 'verano', 'otono'],
  tokio: ['primavera', 'otono', 'invierno'],
};
