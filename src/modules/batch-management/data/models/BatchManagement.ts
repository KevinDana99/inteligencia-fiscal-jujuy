export type BatchRegime = 'Convenio Multilateral' | 'Regimen Local' | 'No inscripto';
export type BatchRequestRegime =
  | 'Convenio Multilateral'
  | 'ConvenioMultilateral'
  | 'Regimen Local'
  | 'RegimenLocal';

export interface IBatchManagementAuthor {
  id: string;
  name: string;
}

export interface IBatchManagementCuit {
  id: string;
  cuit: string;
  businessName: string | null;
  regime: BatchRegime;
  order: number;
}

export interface IBatchLoadedCuitRow {
  id: string;
  cuit: string;
  businessName: string | null;
  source: 'manual' | 'import';
}

export interface IBatchCrossSectionFilters {
  isOpen: boolean;
  fromYear: string;
  toYear: string;
  fromMonth: string | null;
  toMonth: string | null;
  crossTypes: string[];
}

export interface IBatchCrossFilters {
  monthly: IBatchCrossSectionFilters;
  annual: IBatchCrossSectionFilters;
}

export type BatchCrossPeriodicity = 'monthly' | 'annual';
export type BatchAvailableCrossView = 'resumen' | 'planilla';

export interface IBatchAvailableCross {
  id: string;
  label: string;
  publicCode: string;
  version: string;
  periodicity: BatchCrossPeriodicity;
  viewsAvailable: BatchAvailableCrossView[];
}

export type IBatchAvailableCrosses = Array<IBatchAvailableCross>;

export interface IBatchManagementItem {
  id: string;
  batchNumber: string;
  name: string;
  description: string;
  regime: BatchRegime;
  cuitCount: number;
  cuitPage: number;
  cuitItemsPerPage: number;
  cuitTotalItems: number;
  cuitTotalPages: number;
  createdAt: string;
  createdBy: IBatchManagementAuthor | null;
  cuits: IBatchManagementCuit[];
}

export type IBatchManagementItems = Array<IBatchManagementItem>;

export interface IBatchListParams {
  search?: string | null;
  page?: number;
  itemsPerPage?: number;
}

export interface IBatchDetailParams {
  page?: number;
  itemsPerPage?: number;
}

export interface IBatchListData {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  batches: IBatchManagementItems;
}

export type BatchPreviewStatus = 'valid' | 'invalid' | 'duplicated';

export interface IBatchPreviewRecord {
  record: number;
  originalCuit: string;
  normalizedCuit: string | null;
  businessName: string | null;
  status: BatchPreviewStatus;
  reason: string | null;
}

export interface IBatchPreviewData {
  fileName: string | null;
  foundRecords: number;
  validCount: number;
  invalidCount: number;
  duplicatedCount: number;
  importableCount: number;
  records: IBatchPreviewRecord[];
}

export interface IBatchCreatePayload {
  name: string;
  description?: string | null;
  regime: string;
  file?: File | null;
  cuitsText?: string | null;
}

export interface IBatchContributorInput {
  cuit: string;
  businessName: string | null;
  regime: string | null;
}

export interface IBatchAddContributorPayload {
  batchId: string;
  contributor: IBatchContributorInput;
}

export interface IBatchPreviewPayload {
  file?: File | null;
  regime?: string | null;
  cuitsText?: string | null;
}

export interface IBatchCrossExecutionPayload {
  batchId: string;
  crossCode: string;
  crossVersion: string;
  periodFrom: string;
  periodTo: string;
  parameters?: Record<string, string | null>;
}

export interface IBatchCrossExecutionSummary {
  executionId: number;
  crossCode: string;
  crossVersion: string;
  status: string;
  idempotencyKey: string;
  requestedAt: string;
}

export interface IBatchCreatedSummary {
  id: string;
  number: number;
  formattedNumber: string;
  name: string;
  description: string | null;
  regime: BatchRegime;
  cuitCount: number;
  createdAt: string;
}

export interface IBatchError {
  code: string;
  message: string;
  status: number;
}

export interface IBatchCommandResult<TData = null> {
  success: boolean;
  data: TData | null;
  error?: string;
  code?: string;
  status?: number;
}

export interface IBatchQueryResult<TData> {
  data: TData | null;
  error?: string;
  code?: string;
  status?: number;
}
