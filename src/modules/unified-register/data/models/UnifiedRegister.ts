export type UnifiedRegisterRiskLevel = 'A' | 'B' | 'C';
export type UnifiedRegisterContributorType =
  | 'Convenio Multilateral'
  | 'Régimen General'
  | 'Regimen Local'
  | 'No inscripto';

export interface IUnifiedRegisterItem {
  contribuyenteId: string;
  cuit: string;
  businessName: string;
  activity: string;
  regime: UnifiedRegisterContributorType;
  status: 'Activo' | 'Inactivo';
  riskLevel: UnifiedRegisterRiskLevel;
}

export type IUnifiedRegisterItems = IUnifiedRegisterItem[];

export interface IUnifiedRegisterListData {
  pagina: number;
  itemsPagina: number;
  totalPaginas: number;
  contribuyentes: IUnifiedRegisterItems;
}

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

export interface IUnifiedRegisterAlternateAddressInput {
  direccion?: string | null;
}

export interface IUnifiedRegisterAlternateAddressRecord {
  id: string;
  direccion: string;
  contribuyenteId: string;
  activo: boolean;
}

export interface IUnifiedRegisterAlternateAddressListData {
  domiciliosAlternativos: IUnifiedRegisterAlternateAddressRecord[];
}

export interface IUnifiedRegisterContact {
  id: string;
  recordId?: string;
  label: string;
  value: string;
}

export interface IUnifiedRegisterContactInput {
  telefono?: string | null;
  correo?: string | null;
  nombreRepresentanteLegal?: string | null;
  nombreContador?: string | null;
}

export interface IUnifiedRegisterContactRecord {
  id: string;
  telefono: string | null;
  correo: string | null;
  nombreRepresentanteLegal: string | null;
  nombreContador: string | null;
  contribuyenteId: string;
  activo: boolean;
}

export interface IUnifiedRegisterContactsListParams {
  pagina?: number;
  itemsPagina?: number;
}

export interface IUnifiedRegisterContactsListData {
  pagina: number;
  itemsPagina: number;
  totalPaginas: number;
  contactos: IUnifiedRegisterContactRecord[];
}

export interface IUnifiedRegisterNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface IUnifiedRegisterNoteInput {
  descripcion: string;
}

export interface IUnifiedRegisterNoteRecord {
  id: string;
  descripcion: string;
  creadoPorUsuarioId: string;
  fechaCreacion: string;
  contribuyenteId: string;
  activo: boolean;
}

export interface IUnifiedRegisterNotesListParams {
  pagina?: number;
  itemsPagina?: number;
}

export interface IUnifiedRegisterNotesListData {
  pagina: number;
  itemsPagina: number;
  totalPaginas: number;
  notas: IUnifiedRegisterNoteRecord[];
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

export interface IUnifiedRegisterHeaderActivity {
  nombre: string;
  numero: string;
}

export interface IUnifiedRegisterHeaderAlternateAddress {
  id: string;
  nombre: string;
}

export interface IUnifiedRegisterHeaderRecord {
  cuit: string;
  razonSocial: string;
  activo: boolean;
  tipoContribuyente: UnifiedRegisterContributorType;
  cantidadLotes: number;
  actividadPrimaria: IUnifiedRegisterHeaderActivity;
  actividadSecundaria: IUnifiedRegisterHeaderActivity;
  inicioActividad: string;
  domicilios: {
    fiscal: string;
    comercial: string;
    alternativo: IUnifiedRegisterHeaderAlternateAddress[];
  };
  biDeclarada: string;
  impuestosDeclarados: string;
  deuda: string;
  declaraionesJuradas: {
    presentadas: number;
    noPresentadas: number;
  };
  riesgo: UnifiedRegisterRiskLevel;
}

export interface IUnifiedRegisterFinesListParams {
  pagina?: number;
  itemsPagina?: number;
}

export interface IUnifiedRegisterFineRecord {
  numero: string;
  fecha: string;
  descripcion: string | null;
  monto: string;
  estado: IUnifiedRegisterFine['status'];
}

export interface IUnifiedRegisterFinesListData {
  pagina: number;
  itemsPagina: number;
  totalItems: number;
  totalPaginas: number;
  multas: IUnifiedRegisterFineRecord[];
}

export interface IUnifiedRegisterInterventionOrdersListParams {
  pagina?: number;
  itemsPagina?: number;
}

export interface IUnifiedRegisterInterventionOrderRecord {
  numero: string;
  periodo: string;
  motivo: string;
  monto: string;
  estado: IUnifiedRegisterInterventionOrder['status'];
}

export interface IUnifiedRegisterInterventionOrdersListData {
  pagina: number;
  itemsPagina: number;
  totalItems: number;
  totalPaginas: number;
  ordenes: IUnifiedRegisterInterventionOrderRecord[];
}

export interface IUnifiedRegisterCommandResult<TData = null> {
  success: boolean;
  data: TData | null;
  error?: string;
  code?: string;
  status?: number;
}

export interface IUnifiedRegisterQueryResult<TData> {
  data: TData | null;
  error?: string;
  code?: string;
  status?: number;
}
