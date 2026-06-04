import type {
  IUnifiedRegisterAlternateAddressRecord,
  IUnifiedRegisterContactRecord,
  IUnifiedRegisterFineRecord,
  IUnifiedRegisterHeaderRecord,
  IUnifiedRegisterInterventionOrderRecord,
  IUnifiedRegisterItem,
  IUnifiedRegisterNoteRecord
} from '../../../models/UnifiedRegister';
import type {
  ApiUnifiedRegisterAlternateAddressResponseDto,
  ApiUnifiedRegisterContactResponseDto,
  ApiUnifiedRegisterFineResponseDto,
  ApiUnifiedRegisterHeaderResponseDto,
  ApiUnifiedRegisterInterventionOrderResponseDto,
  ApiUnifiedRegisterListItemDto,
  ApiUnifiedRegisterNoteResponseDto
} from '../dtos/ApiUnifiedRegisterDtos';

export function mapAlternateAddressDto(
  dto: ApiUnifiedRegisterAlternateAddressResponseDto
): IUnifiedRegisterAlternateAddressRecord {
  return {
    id: dto.id,
    direccion: dto.direccion,
    contribuyenteId: dto.contribuyenteId,
    activo: dto.activo
  };
}

export function mapNoteDto(
  dto: ApiUnifiedRegisterNoteResponseDto
): IUnifiedRegisterNoteRecord {
  return {
    id: dto.id,
    descripcion: dto.descripcion,
    creadoPorUsuarioId: dto.creadoPorUsuarioId,
    fechaCreacion: dto.fechaCreacion,
    contribuyenteId: dto.contribuyenteId,
    activo: dto.activo
  };
}

export function mapContactDto(
  dto: ApiUnifiedRegisterContactResponseDto
): IUnifiedRegisterContactRecord {
  return {
    id: dto.id,
    telefono: dto.telefono,
    correo: dto.correo,
    nombreRepresentanteLegal: dto.nombreRepresentanteLegal,
    nombreContador: dto.nombreContador,
    contribuyenteId: dto.contribuyenteId,
    activo: dto.activo
  };
}

function mapContributorType(value: string): IUnifiedRegisterItem['regime'] {
  if (value === 'Convenio Multilateral') {
    return 'Convenio Multilateral';
  }

  if (value === 'Régimen General') {
    return 'Régimen General';
  }

  if (value === 'No inscripto') {
    return 'No inscripto';
  }

  return 'Regimen Local';
}

export function mapListItemDto(
  dto: ApiUnifiedRegisterListItemDto
): IUnifiedRegisterItem {
  return {
    contribuyenteId: dto.id,
    cuit: dto.cuit,
    businessName: dto.razonSocial,
    activity: dto.actividad,
    regime: mapContributorType(dto.tipoContribuyente),
    status: dto.activo ? 'Activo' : 'Inactivo',
    riskLevel: dto.riesgo
  };
}

export function mapHeaderDto(
  dto: ApiUnifiedRegisterHeaderResponseDto
): IUnifiedRegisterHeaderRecord {
  return {
    cuit: dto.cuit,
    razonSocial: dto.razonSocial,
    activo: dto.activo,
    tipoContribuyente: mapContributorType(dto.tipoContribuyente),
    cantidadLotes: dto.cantidadLotes,
    actividadPrimaria: dto.actividadPrimaria,
    actividadSecundaria: dto.actividadSecundaria,
    inicioActividad: dto.inicioActividad,
    domicilios: dto.domicilios,
    biDeclarada: dto.biDeclarada,
    impuestosDeclarados: dto.impuestosDeclarados,
    deuda: dto.deuda,
    declaraionesJuradas: dto.declaraionesJuradas,
    riesgo: dto.riesgo
  };
}

export function mapFineDto(
  dto: ApiUnifiedRegisterFineResponseDto
): IUnifiedRegisterFineRecord {
  return dto;
}

export function mapInterventionOrderDto(
  dto: ApiUnifiedRegisterInterventionOrderResponseDto
): IUnifiedRegisterInterventionOrderRecord {
  return dto;
}
