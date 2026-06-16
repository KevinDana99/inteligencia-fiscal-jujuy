import {
  addContributorToBatchAction,
  getBatchManagementAction
} from '@/modules/batch-management/data/actions';
import type {
  IUnifiedRegisterBatchOption,
  IUnifiedRegisterDetail
} from '../../../data/models/UnifiedRegister';
import { mapBatchItemToLotOption } from './utils';

export async function getLotOptions(search: string) {
  const result = await getBatchManagementAction({
    search: search.trim() || null,
    page: 1,
    itemsPerPage: 20
  });

  if (!result.data) {
    return {
      options: null,
      error: result.error ?? 'No fue posible listar los lotes.'
    };
  }

  return {
    options: result.data.batches.map(mapBatchItemToLotOption),
    error: null
  };
}

export async function addContributorToLot(
  item: IUnifiedRegisterDetail,
  lotOption: IUnifiedRegisterBatchOption
) {
  return addContributorToBatchAction({
    batchId: lotOption.id,
    contributor: {
      cuit: item.cuit,
      businessName: item.businessName,
      regime: item.regime
    }
  });
}
