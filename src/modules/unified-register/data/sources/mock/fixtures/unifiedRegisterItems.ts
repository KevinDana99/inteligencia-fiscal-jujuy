import type { IUnifiedRegisterItems } from '../../../data/models/UnifiedRegister';

export const unifiedRegisterItemsFixture: IUnifiedRegisterItems = [
  {
    cuit: '30-50401884-5',
    businessName: 'VOLKSWAGEN ARGENTINA S.A.',
    activity: 'Fabricación de vehículos automotores',
    regime: 'Convenio Multilateral',
    status: 'Activo',
    riskLevel: 'A'
  },
  {
    cuit: '30-70712345-6',
    businessName: 'DISTRIBUIDORA NORTE ANDINO S.A.',
    activity: 'Comercio mayorista de alimentos',
    regime: 'Régimen General',
    status: 'Activo',
    riskLevel: 'B'
  },
  {
    cuit: '20-28456789-4',
    businessName: 'COMERCIAL PUNA NORTE S.R.L.',
    activity: 'Venta minorista de artículos regionales',
    regime: 'Convenio Multilateral',
    status: 'Activo',
    riskLevel: 'B'
  },
  {
    cuit: '30-61234567-2',
    businessName: 'TRANSPORTES QUEBRADA ALTA S.A.',
    activity: 'Transporte de cargas generales',
    regime: 'Convenio Multilateral',
    status: 'Activo',
    riskLevel: 'A'
  },
  {
    cuit: '27-32178654-3',
    businessName: 'MINERA ALTIPLANO JUJUY S.A.',
    activity: 'Servicios vinculados a minería',
    regime: 'Régimen General',
    status: 'Inactivo',
    riskLevel: 'C'
  }
];
