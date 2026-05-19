export type ExplorerRegisterPillKey =
  | 'rubro'
  | 'actividad'
  | 'tipo'
  | 'domicilio'
  | 'localidad'
  | 'provincia'
  | 'riesgo'
  | 'control'
  | 'mercurio'
  | 'trufa'
  | 'agente'
  | 'retenido'
  | 'convenio';

export interface IExplorerRegisterItem {
  id: string;
  cuit: string;
  businessName: string;
  rubro: string;
  actividad: string;
  tipo: string;
  domicilio: string;
  localidad: string;
  provincia: string;
  riesgo: string;
  control: string;
  mercurio: string;
  trufa: string;
  agente: string;
  retenido: string;
  convenio: string;
}

export type IExplorerRegisterItems = IExplorerRegisterItem[];

export interface IExplorerRegisterPill {
  key: ExplorerRegisterPillKey;
  label: string;
}
