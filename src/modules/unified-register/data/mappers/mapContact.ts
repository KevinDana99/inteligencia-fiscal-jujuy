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
      label: 'Teléfono',
      value: record.telefono
    });
  }

  if (record.correo) {
    contacts.push({
      id: 'mail',
      label: 'Mail',
      value: record.correo
    });
  }

  if (record.nombreRepresentanteLegal) {
    contacts.push({
      id: 'legal',
      label: 'Representante legal',
      value: record.nombreRepresentanteLegal
    });
  }

  if (record.nombreContador) {
    contacts.push({
      id: 'accountant',
      label: 'Contador',
      value: record.nombreContador
    });
  }

  return contacts;
}
