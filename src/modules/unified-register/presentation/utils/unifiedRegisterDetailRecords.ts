import type {
  IUnifiedRegisterFine,
  IUnifiedRegisterFineRecord,
  IUnifiedRegisterInterventionOrder,
  IUnifiedRegisterInterventionOrderRecord
} from '../../data/models/UnifiedRegister';
import { UNIFIED_REGISTER_DETAIL_EMPTY_CELL_VALUE } from '../constants/unifiedRegisterDetail';

export function mapFineRecordToViewModel(
  fine: IUnifiedRegisterFineRecord
): IUnifiedRegisterFine {
  return {
    id: fine.numero,
    issuedAt: fine.fecha,
    type: fine.tipo,
    description: fine.descripcion,
    amount: fine.monto,
    status: fine.estado
  };
}

export function mapInterventionOrderRecordToViewModel(
  order: IUnifiedRegisterInterventionOrderRecord
): IUnifiedRegisterInterventionOrder {
  return {
    id: order.numero,
    period: order.periodo,
    reason: order.motivo,
    amount: order.monto,
    status: order.estado
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
