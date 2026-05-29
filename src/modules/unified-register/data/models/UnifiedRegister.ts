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

export interface IUnifiedRegisterWidget {
  id: string;
  label: string;
  value: string;
  tone?: 'blue' | 'green' | 'orange' | 'red';
  subtitle?: string;
  badgeLabel?: string;
  splitValue?: {
    primaryValue: string;
    primaryLabel: string;
    secondaryValue: string;
    secondaryLabel: string;
  };
}

export interface IUnifiedRegisterActivityEntry {
  id: string;
  type: 'Primaria' | 'Secundaria';
  label: string;
  tag: string;
  tagTone: 'blue' | 'violet';
}

export interface IUnifiedRegisterAddress {
  id: string;
  label: string;
  address: string;
}

export interface IUnifiedRegisterContact {
  id: string;
  label: string;
  value: string;
}

export interface IUnifiedRegisterNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface IUnifiedRegisterFine {
  id: string;
  issuedAt: string;
  description: string;
  amount: string;
  status: 'Impaga' | 'Pagada' | 'En gestión';
}

export interface IUnifiedRegisterInterventionOrder {
  id: string;
  period: string;
  reason: string;
  amount: string;
  status: 'En curso' | 'Cerrada';
}

export interface IUnifiedRegisterTax {
  id: string;
  name: string;
  period: string;
  amount: string;
  status: 'Presentado' | 'Pendiente';
}

export interface IUnifiedRegisterBatchOption {
  id: string;
  label: string;
  regime: string;
  cuitCount: number;
}

export interface IUnifiedRegisterSourceTable {
  id:
    | 'iibb'
    | 'arca'
    | 'cm'
    | 'ret'
    | 'perc'
    | 'inm'
    | 'mer';
  label: string;
  columns: string[];
  rows: string[][];
}

export interface IUnifiedRegisterDetail extends IUnifiedRegisterItem {
  startedAt: string;
  jurisdiction: string;
  fiscalAddress: string;
  commercialAddress: string;
  alternateAddress: string;
  controlLotsLabel: string;
  secondaryActivity: string;
  widgets: IUnifiedRegisterWidget[];
  activities: IUnifiedRegisterActivityEntry[];
  fines: IUnifiedRegisterFine[];
  interventionOrders: IUnifiedRegisterInterventionOrder[];
  taxes: IUnifiedRegisterTax[];
  sourceTables: IUnifiedRegisterSourceTable[];
  addresses: IUnifiedRegisterAddress[];
  contacts: IUnifiedRegisterContact[];
  notes: IUnifiedRegisterNote[];
  lotOptions: IUnifiedRegisterBatchOption[];
}
