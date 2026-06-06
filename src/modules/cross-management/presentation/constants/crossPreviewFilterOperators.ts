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
  distintoDe: 'es distinto de'
}
