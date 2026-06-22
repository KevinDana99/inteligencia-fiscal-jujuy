export interface ApiUnifiedRegisterErrorResponseDto {
  codigo: string;
  mensaje: string;
  estado: number;
}

export interface ApiUnifiedRegisterListItemDto {
  id: string;
  cuit: string;
  razonSocial: string;
  actividad: string;
  tipoContribuyente: string;
  activo: boolean;
  riesgo: string | null;
}

export interface ApiUnifiedRegisterListResponseDto {
  pagina: number;
  itemsPagina: number;
  totalPaginas: number;
  contribuyentes: ApiUnifiedRegisterListItemDto[];
}

export interface ApiUnifiedRegisterHeaderActivityDto {
  nombre: string | null;
  numero: string | null;
}

export interface ApiUnifiedRegisterHeaderAlternateAddressDto {
  id: string;
  nombre: string;
}

export interface ApiUnifiedRegisterHeaderResponseDto {
  cuit: string;
  razonSocial: string | null;
  activo: boolean;
  tipoContribuyente: string | null;
  cantidadLotes: number;
  jurisdiccion?: string | null;
  actividadPrimaria: ApiUnifiedRegisterHeaderActivityDto | null;
  actividadSecundaria: ApiUnifiedRegisterHeaderActivityDto | null;
  inicioActividad: string | null;
  domicilios: {
    fiscal: string | null;
    comercial?: string | null;
    alternativo?: ApiUnifiedRegisterHeaderAlternateAddressDto[] | null;
  };
  biDeclarada: string | null;
  impuestosDeclarados: string | null;
  deuda: string | null;
  declaracionesJuradas: {
    presentadas: number;
    noPresentadas: number;
  };
  declaraionesJuradas?: {
    presentadas: number;
    noPresentadas: number;
  };
  riesgo: string | null;
}

export interface ApiUnifiedRegisterFineResponseDto {
  numero: string | null;
  fecha: string | null;
  descripcion: string | null;
  monto: string | null;
  estado: string | null;
}

export interface ApiUnifiedRegisterFinesListResponseDto {
  pagina: number;
  itemsPagina: number;
  totalItems: number;
  totalPaginas: number;
  multas: ApiUnifiedRegisterFineResponseDto[];
}

export interface ApiUnifiedRegisterInterventionOrderResponseDto {
  numero: string | null;
  periodo: string | null;
  motivo: string | null;
  monto: string | null;
  estado: string | null;
}

export interface ApiUnifiedRegisterInterventionOrdersListResponseDto {
  pagina: number;
  itemsPagina: number;
  totalItems: number;
  totalPaginas: number;
  ordenes: ApiUnifiedRegisterInterventionOrderResponseDto[];
}

export interface ApiUnifiedRegisterAlternateAddressRequestDto {
  direccion?: string | null;
}

export interface ApiUnifiedRegisterAlternateAddressResponseDto {
  id: string;
  direccion: string;
  contribuyenteId: string;
  activo: boolean;
}

export interface ApiUnifiedRegisterAlternateAddressListResponseDto {
  domiciliosAlternativos: ApiUnifiedRegisterAlternateAddressResponseDto[];
}

export interface ApiUnifiedRegisterNoteRequestDto {
  descripcion: string;
}

export interface ApiUnifiedRegisterNoteResponseDto {
  id: string;
  descripcion: string;
  creadoPorUsuarioId: string;
  fechaCreacion: string;
  contribuyenteId: string;
  activo: boolean;
}

export interface ApiUnifiedRegisterNotesListResponseDto {
  pagina: number;
  itemsPagina: number;
  totalPaginas: number;
  notas: ApiUnifiedRegisterNoteResponseDto[];
}

export interface ApiUnifiedRegisterContactRequestDto {
  telefono?: string | null;
  correo?: string | null;
  nombreRepresentanteLegal?: string | null;
  nombreContador?: string | null;
}

export interface ApiUnifiedRegisterContactResponseDto {
  id: string;
  telefono: string | null;
  correo: string | null;
  nombreRepresentanteLegal: string | null;
  nombreContador: string | null;
  contribuyenteId: string;
  activo: boolean;
}

export interface ApiUnifiedRegisterContactsListResponseDto {
  pagina: number;
  itemsPagina: number;
  totalPaginas: number;
  contactos: ApiUnifiedRegisterContactResponseDto[];
}

export interface ApiUnifiedRegisterContributorCrossDto {
  id: string;
  nombre: string;
}

export interface ApiUnifiedRegisterContributorCrossesResponseDto {
  cruces: ApiUnifiedRegisterContributorCrossDto[];
}

export interface ApiUnifiedRegisterContributorCrossColumnsDataDto {
  columnas: string[];
  filas: Array<Record<string, unknown>>;
}

export interface ApiUnifiedRegisterContributorCrossColumnsResponseDto {
  nombreCruce: string;
  datos: ApiUnifiedRegisterContributorCrossColumnsDataDto;
}
