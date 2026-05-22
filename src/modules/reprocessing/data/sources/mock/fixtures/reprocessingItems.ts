import type { IReprocessingItems } from '../../../models/Reprocessing'

export const reprocessingItemsMock: IReprocessingItems = [
  {
    id: '6c97da7c-2aa9-4d6b-bb3d-f5d9c18f52a3',
    contribuyenteId: 'be0f84f1-dcc7-43b5-9ce8-6d0d845f777a',
    cuit: '30712345678',
    businessName: 'La Lechera Anonima',
    date: '18/05/2026',
    markedBy: 'Ana Fiscal',
    lastCross: 'Control Desvio Bi Regimen Gral',
    notes: 'Revisar cruce de base imponible',
    isReprocessing: true
  },
  {
    id: '8f2d4a8e-b55d-4b37-98d8-0f298f2b5f11',
    contribuyenteId: '2f7bb0b8-6e68-4c46-9a8d-62c98fc7d142',
    cuit: '27321786543',
    businessName: 'Minera Altiplano Jujuy S.A.',
    date: '16/05/2026',
    markedBy: 'Ana Fiscal',
    lastCross: 'Control Creditos',
    notes: 'Diferencia detectada en retenciones',
    isReprocessing: true
  }
]
