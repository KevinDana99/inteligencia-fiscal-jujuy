import type {
  IUnifiedRegisterAlternateAddressRecord,
  IUnifiedRegisterContactRecord,
  IUnifiedRegisterContributorCross,
  IUnifiedRegisterContributorCrossColumnsData,
  IUnifiedRegisterContributorCrossRow,
  IUnifiedRegisterFineRecord,
  IUnifiedRegisterHeaderRecord,
  IUnifiedRegisterInterventionOrderRecord,
  IUnifiedRegisterItem,
  IUnifiedRegisterNoteRecord,
  UnifiedRegisterRiskLevel
} from '../../../models/UnifiedRegister';
import type {
  ApiUnifiedRegisterAlternateAddressResponseDto,
  ApiUnifiedRegisterContactResponseDto,
  ApiUnifiedRegisterContributorCrossColumnsResponseDto,
  ApiUnifiedRegisterContributorCrossDto,
  ApiUnifiedRegisterFineResponseDto,
  ApiUnifiedRegisterHeaderResponseDto,
  ApiUnifiedRegisterInterventionOrderResponseDto,
  ApiUnifiedRegisterListItemDto,
  ApiUnifiedRegisterNoteResponseDto
} from '../dtos/ApiUnifiedRegisterDtos';

const CONTRIBUTOR_CROSS_LABELS: Record<string, string> = {
  ControlDesvioBiRegimenGral: 'Control de desvío de BI — Régimen Gral',
  ControlDesvioBiRegimenCm: 'Control de desvío de BI — Régimen CM',
  ControlBiDeclaradaPorActividad: 'Control de BI declarada por actividad',
  ControlCreditos: 'Control de créditos',
  ControlSaf: 'Control SAF',
  ControlAgentes: 'Control de agentes',
  DeteccionContribuyentesNoInscriptos:
    'Detección de contribuyentes no inscriptos',
  ComparacionBasesPresuntivas: 'Comparación de bases presuntivas',
  ContribuyentesMasDosInmuebles: 'Contribuyentes con más de dos inmuebles',
  CruceBiPapel: 'Cruce BI Papel'
};

const RISK_LEVELS = new Set<UnifiedRegisterRiskLevel>(['A', 'B', 'C', 'D']);

function formatContributorCrossName(value: string) {
  return (
    CONTRIBUTOR_CROSS_LABELS[value] ??
    value.replace(/([a-z])([A-Z])/g, '$1 $2').trim()
  );
}

function mapCrossCellValue(value: unknown) {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (value === undefined) {
    return null;
  }

  try {
    return JSON.stringify(value) ?? null;
  } catch {
    return String(value);
  }
}

function mapContributorCrossRow(
  row: Record<string, unknown>
): IUnifiedRegisterContributorCrossRow {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, mapCrossCellValue(value)])
  );
}

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

export function mapContributorCrossDto(
  dto: ApiUnifiedRegisterContributorCrossDto
): IUnifiedRegisterContributorCross {
  return {
    id: dto.id,
    code: dto.nombre,
    name: formatContributorCrossName(dto.nombre)
  };
}

export function mapContributorCrossColumnsDto(
  dto: ApiUnifiedRegisterContributorCrossColumnsResponseDto
): IUnifiedRegisterContributorCrossColumnsData {
  return {
    code: dto.nombreCruce,
    columns: [...dto.datos.columnas],
    rows: dto.datos.filas.map(mapContributorCrossRow)
  };
}

function mapContributorType(
  value: string | null
): IUnifiedRegisterItem['regime'] | null {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return null;
  }

  const normalizedKey = normalizedValue
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

  if (
    normalizedKey === 'CONVENIO' ||
    normalizedKey === 'CONVENIO_MULTILATERAL' ||
    normalizedKey === 'CONVENIO MULTILATERAL'
  ) {
    return 'Convenio Multilateral';
  }

  if (
    normalizedKey === 'GENERAL' ||
    normalizedKey === 'REGIMEN_GENERAL' ||
    normalizedKey === 'REGIMEN GENERAL'
  ) {
    return 'Régimen General';
  }

  if (normalizedKey === 'NO_INSCRIPTO' || normalizedKey === 'NO INSCRIPTO') {
    return 'No inscripto';
  }

  if (
    normalizedKey === 'LOCAL' ||
    normalizedKey === 'REGIMEN_LOCAL' ||
    normalizedKey === 'REGIMEN LOCAL'
  ) {
    return 'Regimen Local';
  }

  return normalizedValue as IUnifiedRegisterItem['regime'];
}

function mapRiskLevel(value: string | null | undefined) {
  const normalizedValue = value?.trim().toUpperCase();

  if (!normalizedValue) {
    return null;
  }

  return RISK_LEVELS.has(normalizedValue as UnifiedRegisterRiskLevel)
    ? (normalizedValue as UnifiedRegisterRiskLevel)
    : null;
}

export function mapListItemDto(
  dto: ApiUnifiedRegisterListItemDto
): IUnifiedRegisterItem {
  return {
    contribuyenteId: dto.id,
    cuit: dto.cuit,
    businessName: dto.razonSocial,
    activity: dto.actividad,
    regime: mapContributorType(dto.tipoContribuyente) ?? 'No inscripto',
    status: dto.activo ? 'Activo' : 'Inactivo',
    riskLevel: mapRiskLevel(dto.riesgo)
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
    jurisdiccion: dto.jurisdiccion ?? null,
    jurisdiccionSede: dto.jurisdiccionSede ?? null,
    jurisdiccionesExternas: dto.jurisdiccionesExternas ?? null,
    actividadPrimaria: dto.actividadPrimaria,
    actividadSecundaria: dto.actividadSecundaria,
    inicioActividad: dto.inicioActividad,
    domicilios: dto.domicilios,
    biDeclarada: dto.biDeclarada,
    impuestosDeclarados: dto.impuestosDeclarados,
    deuda: dto.deuda,
    periodoCalculo: dto.periodoCalculo ?? null,
    periodosCalculo: dto.periodosCalculo ?? null,
    declaracionesJuradas:
      dto.declaracionesJuradas ?? dto.declaraionesJuradas ?? {
        presentadas: 0,
        noPresentadas: 0
      },
    riesgo: mapRiskLevel(dto.riesgo)
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
