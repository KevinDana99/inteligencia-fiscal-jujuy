import type {
  IUnifiedRegisterContact,
  IUnifiedRegisterContactRecord
} from '../models/UnifiedRegister';

export function mapContactRecordToViewModel(
  record: IUnifiedRegisterContactRecord
): IUnifiedRegisterContact[] {
  const contacts: IUnifiedRegisterContact[] = [];

  if (record.telefono) {
    contacts.push({
      id: 'phone',
      recordId: record.id,
      label: 'Teléfono',
      value: record.telefono
    });
  }

  if (record.correo) {
    contacts.push({
      id: 'mail',
      recordId: record.id,
      label: 'Mail',
      value: record.correo
    });
  }

  if (record.nombreRepresentanteLegal) {
    contacts.push({
      id: 'legal',
      recordId: record.id,
      label: 'Representante legal',
      value: record.nombreRepresentanteLegal
    });
  }

  if (record.nombreContador) {
    contacts.push({
      id: 'accountant',
      recordId: record.id,
      label: 'Contador',
      value: record.nombreContador
    });
  }

  return contacts;
}
