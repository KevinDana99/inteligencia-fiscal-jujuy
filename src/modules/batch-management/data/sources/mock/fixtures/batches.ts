import type { IBatchManagementItems } from '../../../models/BatchManagement'

export const batchManagementMock: IBatchManagementItems = [
  {
    id: '622',
    batchNumber: '622',
    name: 'ANOVA-622',
    description: 'Comercio mayorista - variacion negativa',
    cuitCount: 47,
    createdAt: '12/04/2026',
    cuits: [
      {
        id: '622-1',
        cuit: '30-70123456-8',
        businessName: 'DISTRIBUIDORA NORTE ANDINO S.A.',
        regime: 'CM'
      },
      {
        id: '622-2',
        cuit: '20-28456789-4',
        businessName: 'COMERCIAL PUNA NORTE S.R.L.',
        regime: 'CM'
      },
      {
        id: '622-3',
        cuit: '30-61234567-2',
        businessName: 'TRANSPORTES QUEBRADA ALTA S.A.',
        regime: 'CM'
      }
    ]
  },
  {
    id: '589',
    batchNumber: '589',
    name: 'TRUFA-589',
    description: 'Fiscalizacion especial - grandes contribuyentes',
    cuitCount: 83,
    createdAt: '28/03/2026',
    cuits: []
  },
  {
    id: '541',
    batchNumber: '541',
    name: 'GC-2023',
    description: 'Grandes contribuyentes - base > $50M',
    cuitCount: 31,
    createdAt: '02/03/2026',
    cuits: []
  },
  {
    id: '498',
    batchNumber: '498',
    name: 'SECTOR-498',
    description: 'Sector construccion - variacion de coeficiente',
    cuitCount: 22,
    createdAt: '14/02/2026',
    cuits: []
  },
  {
    id: '412',
    batchNumber: '412',
    name: 'INMUEBLES-412',
    description: 'Contribuyentes con mas de dos inmuebles',
    cuitCount: 58,
    createdAt: '19/01/2026',
    cuits: []
  }
]
