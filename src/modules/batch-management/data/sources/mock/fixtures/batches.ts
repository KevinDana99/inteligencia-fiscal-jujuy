import type { IBatchManagementItems } from '../../../models/BatchManagement';

const MOCK_AUTHOR = {
  id: '0795e889-9d73-4126-a3d4-5d5441c4c6af',
  name: 'Carlos Lopez'
};

export const batchManagementMock: IBatchManagementItems = [
  {
    id: '019f21f7-3f52-7c51-a70a-4f9cc63c8f35',
    batchNumber: '622',
    name: 'ANOVA-622',
    description: 'Comercio mayorista - variacion negativa',
    regime: 'Convenio Multilateral',
    cuitCount: 47,
    createdAt: '2026-04-12T15:30:00+00:00',
    createdBy: MOCK_AUTHOR,
    cuits: [
      {
        id: '019f21f7-3f52-7c51-a70a-4f9cc63c8f35-1',
        cuit: '30701234568',
        businessName: 'DISTRIBUIDORA NORTE ANDINO S.A.',
        regime: 'Convenio Multilateral',
        order: 1
      },
      {
        id: '019f21f7-3f52-7c51-a70a-4f9cc63c8f35-2',
        cuit: '20284567894',
        businessName: 'COMERCIAL PUNA NORTE S.R.L.',
        regime: 'Convenio Multilateral',
        order: 2
      },
      {
        id: '019f21f7-3f52-7c51-a70a-4f9cc63c8f35-3',
        cuit: '30612345672',
        businessName: 'TRANSPORTES QUEBRADA ALTA S.A.',
        regime: 'Convenio Multilateral',
        order: 3
      },
      {
        id: '019f21f7-3f52-7c51-a70a-4f9cc63c8f35-4',
        cuit: '27321786543',
        businessName: 'MINERA ALTIPLANO JUJUY S.A.',
        regime: 'Convenio Multilateral',
        order: 4
      },
      {
        id: '019f21f7-3f52-7c51-a70a-4f9cc63c8f35-5',
        cuit: '30554678910',
        businessName: 'AGRO HUMAHUACA S.R.L.',
        regime: 'Convenio Multilateral',
        order: 5
      }
    ]
  },
  {
    id: '019f21f7-3f52-7c51-a70a-4f9cc63c8f36',
    batchNumber: '589',
    name: 'TRUFA-589',
    description: 'Fiscalizacion especial - grandes contribuyentes',
    regime: 'Convenio Multilateral',
    cuitCount: 83,
    createdAt: '2026-03-28T15:30:00+00:00',
    createdBy: MOCK_AUTHOR,
    cuits: []
  },
  {
    id: '019f21f7-3f52-7c51-a70a-4f9cc63c8f37',
    batchNumber: '541',
    name: 'GC-2023',
    description: 'Grandes contribuyentes - base > $50M',
    regime: 'Regimen Local',
    cuitCount: 31,
    createdAt: '2026-03-02T15:30:00+00:00',
    createdBy: MOCK_AUTHOR,
    cuits: []
  },
  {
    id: '019f21f7-3f52-7c51-a70a-4f9cc63c8f38',
    batchNumber: '498',
    name: 'SECTOR-498',
    description: 'Sector construccion - variacion de coeficiente',
    regime: 'Regimen Local',
    cuitCount: 22,
    createdAt: '2026-02-14T15:30:00+00:00',
    createdBy: MOCK_AUTHOR,
    cuits: []
  },
  {
    id: '019f21f7-3f52-7c51-a70a-4f9cc63c8f39',
    batchNumber: '412',
    name: 'INMUEBLES-412',
    description: 'Contribuyentes con mas de dos inmuebles',
    regime: 'Regimen Local',
    cuitCount: 58,
    createdAt: '2026-01-19T15:30:00+00:00',
    createdBy: MOCK_AUTHOR,
    cuits: []
  }
];
