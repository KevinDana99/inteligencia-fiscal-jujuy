import type {
  IUnifiedRegisterAlternateAddressInput,
  IUnifiedRegisterAlternateAddressListData,
  IUnifiedRegisterAlternateAddressRecord,
  IUnifiedRegisterContactInput,
  IUnifiedRegisterContactRecord,
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterContactsListParams,
  IUnifiedRegisterContributorCrossesData,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterFinesListParams,
  IUnifiedRegisterHeaderRecord,
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterInterventionOrdersListParams,
  IUnifiedRegisterListData,
  IUnifiedRegisterNoteInput,
  IUnifiedRegisterNoteRecord,
  IUnifiedRegisterNotesListData,
  IUnifiedRegisterNotesListParams
} from '../models/UnifiedRegister';

export interface IUnifiedRegisterSource {
  listContributors(
    page?: number,
    itemsPerPage?: number,
    search?: string
  ): Promise<IUnifiedRegisterListData>;
  getContributorHeader(contribuyenteId: string): Promise<IUnifiedRegisterHeaderRecord>;
  listContributorCrosses(
    contribuyenteId: string
  ): Promise<IUnifiedRegisterContributorCrossesData>;
  listMercurioFines(
    contribuyenteId: string,
    params?: IUnifiedRegisterFinesListParams
  ): Promise<IUnifiedRegisterFinesListData>;
  listInterventionOrders(
    contribuyenteId: string,
    params?: IUnifiedRegisterInterventionOrdersListParams
  ): Promise<IUnifiedRegisterInterventionOrdersListData>;
  listAlternateAddresses(
    contribuyenteId: string
  ): Promise<IUnifiedRegisterAlternateAddressListData>;
  createAlternateAddress(
    contribuyenteId: string,
    payload: IUnifiedRegisterAlternateAddressInput
  ): Promise<IUnifiedRegisterAlternateAddressRecord>;
  updateAlternateAddress(
    contribuyenteId: string,
    domicilioAlternativoId: string,
    payload: IUnifiedRegisterAlternateAddressInput
  ): Promise<IUnifiedRegisterAlternateAddressRecord>;
  deleteAlternateAddress(
    contribuyenteId: string,
    domicilioAlternativoId: string
  ): Promise<void>;
  listNotes(
    contribuyenteId: string,
    params?: IUnifiedRegisterNotesListParams
  ): Promise<IUnifiedRegisterNotesListData>;
  createNote(
    contribuyenteId: string,
    payload: IUnifiedRegisterNoteInput
  ): Promise<IUnifiedRegisterNoteRecord>;
  updateNote(
    contribuyenteId: string,
    notaId: string,
    payload: IUnifiedRegisterNoteInput
  ): Promise<IUnifiedRegisterNoteRecord>;
  deleteNote(contribuyenteId: string, notaId: string): Promise<void>;
  listContacts(
    contribuyenteId: string,
    params?: IUnifiedRegisterContactsListParams
  ): Promise<IUnifiedRegisterContactsListData>;
  createContact(
    contribuyenteId: string,
    payload: IUnifiedRegisterContactInput
  ): Promise<IUnifiedRegisterContactRecord>;
  updateContact(
    contribuyenteId: string,
    contactoId: string,
    payload: IUnifiedRegisterContactInput
  ): Promise<IUnifiedRegisterContactRecord>;
  deleteContact(contribuyenteId: string, contactoId: string): Promise<void>;
}
