import type { ICrossManagementItems } from '../../../models/CrossManagement'

export const crossItemsMock: ICrossManagementItems = [
  {
    id: 'cross-1',
    name: 'Control de desvío de BI — Régimen CM',
    source: 'Lote',
    sourceRef: 'ANOVA-622',
    period: '2024',
    cuitCount: 2,
    date: '27/04/2026'
  },
  {
    id: 'cross-2',
    name: 'Control de desvío de BI — Régimen CM',
    source: 'Padrón',
    sourceRef: '30-50401884-5',
    period: '2024–2025',
    cuitCount: 1,
    date: '26/04/2026'
  },
  {
    id: 'cross-3',
    name: 'Control de créditos',
    source: 'Lote',
    sourceRef: 'TRUFA-589',
    period: '2023',
    cuitCount: 83,
    date: '20/04/2026'
  },
  {
    id: 'cross-4',
    name: 'Detección de contribuyentes no inscriptos',
    source: 'Lote',
    sourceRef: 'SECTOR-498',
    period: '2022',
    cuitCount: 22,
    date: '15/04/2026'
  }
]
