import type { IReprocessingItems } from '../../../models/Reprocessing'

export const reprocessingItemsMock: IReprocessingItems = [
  {
    id: 'repr-1',
    cuit: '30-50401884-5',
    businessName: 'VOLKSWAGEN ARGENTINA S.A.',
    date: '27/04/2026',
    markedBy: 'Nadia Guzmán',
    lastCross: 'Desvío BI — CM',
    notes: 'Pendiente revisión coeficientes 2025',
    isReprocessing: true
  },
  {
    id: 'repr-2',
    cuit: '27-32178654-3',
    businessName: 'MINERA ALTIPLANO JUJUY S.A.',
    date: '25/04/2026',
    markedBy: 'Nadia Guzmán',
    lastCross: 'Desvío BI — CM',
    notes: 'Desvío crítico — requiere auditoría',
    isReprocessing: true
  }
]
