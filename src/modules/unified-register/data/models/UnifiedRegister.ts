export type UnifiedRegisterRiskLevel = 'A' | 'B' | 'C';

export interface IUnifiedRegisterItem {
  cuit: string;
  businessName: string;
  activity: string;
  regime: string;
  status: 'Activo' | 'Inactivo';
  riskLevel: UnifiedRegisterRiskLevel;
}

export type IUnifiedRegisterItems = IUnifiedRegisterItem[];
