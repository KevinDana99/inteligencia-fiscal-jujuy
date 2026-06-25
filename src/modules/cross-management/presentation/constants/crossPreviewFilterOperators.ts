import type { ICrossFilterOperator } from '../../data/models/CrossManagement'

export const CROSS_PREVIEW_FILTER_OPERATOR_LABELS: Record<
  ICrossFilterOperator,
  string
> = {
  mayorQue: 'es mayor que',
  mayorOIgualQue: 'es mayor o igual que',
  menorQue: 'es menor que',
  menorOIgualQue: 'es menor o igual que',
  igualA: 'es igual a',
  distintoDe: 'es distinto de',
  contiene: 'contiene',
  noContiene: 'no contiene',
  empiezaCon: 'empieza con',
  terminaCon: 'termina con',
  esNulo: 'está vacío',
  noEsNulo: 'no está vacío',
  posteriorA: 'es posterior a',
  posteriorOIgualA: 'es posterior o igual a',
  anteriorA: 'es anterior a',
  anteriorOIgualA: 'es anterior o igual a'
}
