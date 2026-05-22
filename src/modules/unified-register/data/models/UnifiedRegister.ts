export type UnifiedRegisterRiskLevel = 'A' | 'B' | 'C';

export interface IUnifiedRegisterItem {
  contribuyenteId: string;
  cuit: string;
  businessName: string;
  activity: string;
  regime: string;
  status: 'Activo' | 'Inactivo';
  riskLevel: UnifiedRegisterRiskLevel;
  isInReprocessing?: boolean;
}

export type IUnifiedRegisterItems = IUnifiedRegisterItem[];
