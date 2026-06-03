import type {
  IUnifiedRegisterAddress,
  IUnifiedRegisterAlternateAddressRecord
} from '../models/UnifiedRegister';

export function mapAlternateAddressRecordToViewModel(
  record: IUnifiedRegisterAlternateAddressRecord
): IUnifiedRegisterAddress {
  return {
    id: record.id,
    label: 'Alternativo',
    address: record.direccion
  };
}
