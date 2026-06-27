import dayjs from 'dayjs';
import type {
  IUnifiedRegisterFine,
  IUnifiedRegisterFineRecord,
  IUnifiedRegisterInterventionOrder,
  IUnifiedRegisterInterventionOrderRecord
} from '../../data/models/UnifiedRegister';
import { UNIFIED_REGISTER_DETAIL_EMPTY_CELL_VALUE } from '../constants/unifiedRegisterDetail';

const INTERVENTION_ORDER_STATUS_LABELS: Record<string, string> = {
  '1': 'Abierta',
  '2': 'En análisis',
  '3': 'En curso',
  '4': 'Cerrada',
  ABIERTA: 'Abierta',
  EN_ANALISIS: 'En análisis',
  EN_CURSO: 'En curso',
  CERRADA: 'Cerrada'
};

const FINE_STATUS_LABELS: Record<string, string> = {
  ACTIVO: 'En gestión',
  BAJA: 'Impaga'
};

const FINE_TYPE_LABELS: Record<string, IUnifiedRegisterFine['type']> = {
  DESTINATARIO: 'Destinatario',
  REMITENTE: 'Remitente'
};

function mapFineStatus(value: string | null) {
  const normalizedValue = value?.trim().toUpperCase();

  if (!normalizedValue) {
    return null;
  }

  return FINE_STATUS_LABELS[normalizedValue] ?? value?.trim() ?? null;
}

function mapInterventionOrderStatus(value: string | null) {
  const normalizedValue = value?.trim().toUpperCase();

  if (!normalizedValue) {
    return null;
  }

  return (
    INTERVENTION_ORDER_STATUS_LABELS[normalizedValue] ?? value?.trim() ?? null
  );
}

function mapFineType(value: string | null | undefined) {
  const normalizedValue = value?.trim().toUpperCase();

  if (!normalizedValue) {
    return null;
  }

  return FINE_TYPE_LABELS[normalizedValue] ?? null;
}

function formatFineIssuedAt(value: string | null) {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return null;
  }

  const formattedValue = dayjs(normalizedValue);

  return formattedValue.isValid()
    ? formattedValue.format('DD/MM/YYYY')
    : normalizedValue;
}

export function mapFineRecordToViewModel(
  fine: IUnifiedRegisterFineRecord
): IUnifiedRegisterFine {
  return {
    id: fine.numero,
    issuedAt: formatFineIssuedAt(fine.fecha),
    type: mapFineType(fine.tipo),
    description: fine.descripcion,
    amount: fine.monto,
    status: mapFineStatus(fine.estado)
  };
}

export function mapInterventionOrderRecordToViewModel(
  order: IUnifiedRegisterInterventionOrderRecord
): IUnifiedRegisterInterventionOrder {
  return {
    id: order.numero,
    origin: order.origen,
    instruction: order.instruccion,
    period: order.periodo,
    debt: order.deuda,
    declaredBi: order.bi,
    reason: order.motivo,
    amount: order.monto,
    status: mapInterventionOrderStatus(order.estado)
  };
}

export function formatNullableDetailCell(value: string | null | undefined) {
  return value ?? UNIFIED_REGISTER_DETAIL_EMPTY_CELL_VALUE;
}

export function getNullableRecordKey(
  value: string | null | undefined,
  prefix: string,
  index: number
) {
  return value ?? `${prefix}-${index}`;
}
