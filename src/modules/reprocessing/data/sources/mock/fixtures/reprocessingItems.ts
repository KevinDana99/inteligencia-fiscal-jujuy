import type { IReprocessingItems } from '../../../models/Reprocessing'

export const reprocessingItemsMock: IReprocessingItems = [
  {
    id: '6c97da7c-2aa9-4d6b-bb3d-f5d9c18f52a3',
    contribuyenteId: 'be0f84f1-dcc7-43b5-9ce8-6d0d845f777a',
    cuit: '30-50401884-5',
    businessName: 'VOLKSWAGEN ARGENTINA S.A.',
    createdAt: '2026-05-18T15:20:30+00:00',
    date: '18/05/2026',
    markedByUserId: 'a9fd29ff-a9c9-4f2f-bbd6-1f8050e27fa8',
    markedBy: 'Ana Fiscal',
    lastCrossId: '9f9c316f-f459-43f0-bc10-791e2d1d7f60',
    lastCross: 'Control Desvio Bi Regimen Cm',
    notes: 'Pendiente revisión coeficientes 2025',
    isReprocessing: true
  },
  {
    id: '8f2d4a8e-b55d-4b37-98d8-0f298f2b5f11',
    contribuyenteId: '2f7bb0b8-6e68-4c46-9a8d-62c98fc7d142',
    cuit: '27-32178654-3',
    businessName: 'Minera Altiplano Jujuy S.A.',
    createdAt: '2026-05-16T12:10:00+00:00',
    date: '16/05/2026',
    markedByUserId: 'a9fd29ff-a9c9-4f2f-bbd6-1f8050e27fa8',
    markedBy: 'Ana Fiscal',
    lastCrossId: '31fd4dc8-ef01-4ea8-a1ef-4d314b76fb2d',
    lastCross: 'Control Creditos',
    notes: 'Diferencia detectada en retenciones',
    isReprocessing: true
  }
]
