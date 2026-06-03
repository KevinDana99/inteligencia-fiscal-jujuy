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
  riesgo: 'A' | 'B' | 'C';
}

export interface ApiUnifiedRegisterListResponseDto {
  pagina: number;
  itemsPagina: number;
  totalPaginas: number;
  contribuyentes: ApiUnifiedRegisterListItemDto[];
}

export interface ApiUnifiedRegisterHeaderActivityDto {
  nombre: string;
  numero: string;
}

export interface ApiUnifiedRegisterHeaderAlternateAddressDto {
  id: string;
  nombre: string;
}

export interface ApiUnifiedRegisterHeaderResponseDto {
  cuit: string;
  razonSocial: string;
  activo: boolean;
  tipoContribuyente: string;
  cantidadLotes: number;
  actividadPrimaria: ApiUnifiedRegisterHeaderActivityDto;
  actividadSecundaria: ApiUnifiedRegisterHeaderActivityDto;
  inicioActividad: string;
  domicilios: {
    fiscal: string;
    comercial: string;
    alternativo: ApiUnifiedRegisterHeaderAlternateAddressDto[];
  };
  biDeclarada: string;
  impuestosDeclarados: string;
  deuda: string;
  declaraionesJuradas: {
    presentadas: number;
    noPresentadas: number;
  };
  riesgo: 'A' | 'B' | 'C';
}

export interface ApiUnifiedRegisterFineResponseDto {
  numero: string;
  fecha: string;
  descripcion: string | null;
  monto: string;
  estado: 'Impaga' | 'Pagada' | 'En gestión';
}

export interface ApiUnifiedRegisterFinesListResponseDto {
  pagina: number;
  itemsPagina: number;
  totalItems: number;
  totalPaginas: number;
  multas: ApiUnifiedRegisterFineResponseDto[];
}

export interface ApiUnifiedRegisterInterventionOrderResponseDto {
  numero: string;
  periodo: string;
  motivo: string;
  monto: string;
  estado: 'En curso' | 'Cerrada';
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
