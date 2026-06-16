import type { IBatchManagementItem } from '@/modules/batch-management/data/models/BatchManagement';
import type {
  IUnifiedRegisterBatchOption,
  IUnifiedRegisterContact,
  IUnifiedRegisterSourceTable
} from '../../../data/models/UnifiedRegister';
import { EMPTY_CONTACT_FORM } from './constants';
import type { ContactForm } from './types';

export function mapBatchItemToLotOption(
  batch: IBatchManagementItem
): IUnifiedRegisterBatchOption {
  return {
    id: batch.id,
    label: batch.name,
    batchNumber: batch.batchNumber,
    regime: batch.regime,
    cuitCount: batch.cuitCount
  };
}

export function filterLotOptions(
  lotOptions: IUnifiedRegisterBatchOption[],
  search: string
) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return lotOptions;
  }

  return lotOptions.filter((lot) => {
    return (
      lot.label.toLowerCase().includes(normalizedSearch) ||
      lot.batchNumber?.toLowerCase().includes(normalizedSearch) ||
      lot.regime.toLowerCase().includes(normalizedSearch)
    );
  });
}

export function getContactFormFromContacts(
  contacts: IUnifiedRegisterContact[]
): ContactForm {
  return {
    ...EMPTY_CONTACT_FORM,
    phone: contacts.find((entry) => entry.id === 'phone')?.value ?? '',
    mail: contacts.find((entry) => entry.id === 'mail')?.value ?? '',
    legal: contacts.find((entry) => entry.id === 'legal')?.value ?? '',
    accountant: contacts.find((entry) => entry.id === 'accountant')?.value ?? ''
  };
}

export function resolveActiveSourceTable(
  tables: IUnifiedRegisterSourceTable[],
  activeId: IUnifiedRegisterSourceTable['id']
) {
  return tables.find((table) => table.id === activeId) ?? tables[0];
}
