export type BatchRegime = 'Convenio Multilateral' | 'Regimen Local';
export type BatchRequestRegime =
  | 'CM'
  | 'Convenio Multilateral'
  | 'ConvenioMultilateral'
  | 'Convenio Multilateral (CM)'
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

export interface IBatchCrossFilters {
  fromYear: string;
  toYear: string;
  crossTypes: string[];
}

export interface IBatchManagementItem {
  id: string;
  batchNumber: string;
  name: string;
  description: string;
  regime: BatchRegime;
  cuitCount: number;
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

export interface IBatchPreviewPayload {
  file?: File | null;
  regime?: string | null;
  cuitsText?: string | null;
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
