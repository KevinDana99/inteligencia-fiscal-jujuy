export type UnifiedRegisterRiskLevel = 'A' | 'B' | 'C' | 'D';
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
  regime: UnifiedRegisterContributorType | null;
  status: 'Activo' | 'Inactivo';
  riskLevel: UnifiedRegisterRiskLevel | null;
}

export type IUnifiedRegisterItems = IUnifiedRegisterItem[];

export interface IUnifiedRegisterListData {
  pagina: number;
  itemsPagina: number;
  totalItems: number;
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
  periodLabel?: string;
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
  id: string | null;
  issuedAt: string | null;
  type?: 'Destinatario' | 'Remitente' | 'Transportista' | null;
  description: string | null;
  amount: string | null;
  status: string | null;
}

export interface IUnifiedRegisterInterventionOrder {
  id: string | null;
  origin?: string | null;
  instruction?: string | null;
  period: string | null;
  debt?: string | null;
  declaredBi?: string | null;
  reason: string | null;
  amount: string | null;
  status: string | null;
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
  batchNumber?: string;
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
  headquartersJurisdiction: string;
  strangeJurisdictions: string;
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
  nombre: string | null;
  numero: string | null;
}

export interface IUnifiedRegisterHeaderAlternateAddress {
  id: string;
  nombre: string;
}

export interface IUnifiedRegisterHeaderPeriodRange {
  desde: string | null;
  hasta: string | null;
  periodoDesde: number | null;
  periodoHasta: number | null;
}

export interface IUnifiedRegisterHeaderRecord {
  cuit: string;
  razonSocial: string | null;
  activo: boolean;
  tipoContribuyente: UnifiedRegisterContributorType | null;
  cantidadLotes: number;
  jurisdiccion: string | null;
  jurisdiccionSede?: string | null;
  jurisdiccionesExternas?: string | null;
  actividadPrimaria: IUnifiedRegisterHeaderActivity | null;
  actividadSecundaria: IUnifiedRegisterHeaderActivity | null;
  inicioActividad: string | null;
  domicilios: {
    fiscal: string | null;
    comercial?: string | null;
    alternativo?: IUnifiedRegisterHeaderAlternateAddress[] | null;
  };
  biDeclarada: string | null;
  impuestosDeclarados: string | null;
  deuda: string | null;
  periodoCalculo?: IUnifiedRegisterHeaderPeriodRange | null;
  periodosCalculo?: {
    biDeclarada?: IUnifiedRegisterHeaderPeriodRange | null;
    impuestosDeclarados?: IUnifiedRegisterHeaderPeriodRange | null;
    deuda?: IUnifiedRegisterHeaderPeriodRange | null;
    declaracionesJuradas?: IUnifiedRegisterHeaderPeriodRange | null;
  } | null;
  declaracionesJuradas: {
    presentadas: number;
    noPresentadas: number;
  };
  riesgo: UnifiedRegisterRiskLevel | null;
}

export interface IUnifiedRegisterFinesListParams {
  pagina?: number;
  itemsPagina?: number;
}

export interface IUnifiedRegisterFineRecord {
  numero: string | null;
  fecha: string | null;
  tipo?: 'Destinatario' | 'Remitente' | 'Transportista' | null;
  descripcion: string | null;
  monto: string | null;
  estado: string | null;
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
  numero: string | null;
  origen?: string | null;
  instruccion?: string | null;
  periodo: string | null;
  deuda?: string | null;
  bi?: string | null;
  motivo: string | null;
  monto: string | null;
  estado: string | null;
}

export interface IUnifiedRegisterInterventionOrdersListData {
  pagina: number;
  itemsPagina: number;
  totalItems: number;
  totalPaginas: number;
  ordenes: IUnifiedRegisterInterventionOrderRecord[];
}

export interface IUnifiedRegisterContributorCross {
  id: string;
  code: string;
  name: string;
}

export type UnifiedRegisterCrossCellValue = string | number | boolean | null;

export type IUnifiedRegisterContributorCrossRow = Record<
  string,
  UnifiedRegisterCrossCellValue
>;

export interface IUnifiedRegisterContributorCrossColumnsData {
  code: string;
  columns: string[];
  rows: IUnifiedRegisterContributorCrossRow[];
}

export interface IUnifiedRegisterContributorCrossesData {
  crosses: IUnifiedRegisterContributorCross[];
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
