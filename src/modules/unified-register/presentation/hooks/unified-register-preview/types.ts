import type { IBatchAvailableCrosses } from '@/modules/batch-management/data/models/BatchManagement';
import type {
  IUnifiedRegisterAddress,
  IUnifiedRegisterBatchOption,
  IUnifiedRegisterContact,
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterDetail,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterNote,
  IUnifiedRegisterNotesListData
} from '../../../data/models/UnifiedRegister';

export type HeaderModal = null | 'reprocessing' | 'crosses' | 'report' | 'batch';
export type EditKind = null | 'address' | 'contact' | 'note';
export type DeleteKind = null | 'address' | 'contact' | 'note';

export type EditableItem =
  | IUnifiedRegisterAddress
  | IUnifiedRegisterContact
  | IUnifiedRegisterNote;

export type ContactForm = {
  phone: string;
  mail: string;
  legal: string;
  accountant: string;
};

export type HydrationFlags = {
  addresses?: boolean;
  contacts?: boolean;
  notes?: boolean;
  mercurio?: boolean;
  interventionOrders?: boolean;
  availableCrosses?: boolean;
  reprocessing?: boolean;
};

export type UseUnifiedRegisterPreviewParams = {
  item: IUnifiedRegisterDetail;
  initialAvailableCrosses: IBatchAvailableCrosses;
  initialIsReprocessing: boolean;
  initialContactsData: IUnifiedRegisterContactsListData | null;
  initialNotesData: IUnifiedRegisterNotesListData | null;
  initialMercurioData: IUnifiedRegisterFinesListData | null;
  initialInterventionOrdersData: IUnifiedRegisterInterventionOrdersListData | null;
  hydration?: HydrationFlags;
};

export type LotSelectionData = {
  selectedLotOption: IUnifiedRegisterBatchOption | null;
  addToBatchError: string | null;
  isAddToBatchPending: boolean;
};
