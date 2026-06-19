import { getReprocessingAction } from '@/modules/reprocessing/data/actions';
import { isSameCuit } from '../../data/utils/resolveUnifiedRegisterPreviewContributor';
import { UnifiedRegisterPreviewHydrationBridge } from '../../presentation/components/UnifiedRegisterPreviewPage/UnifiedRegisterPreviewHydrationBridge';
import type { ContributorModuleProps } from '../types';

export async function ReprocessingModule({
  contribuyenteId,
  cuit
}: ContributorModuleProps) {
  const result = await getReprocessingAction({
    search: cuit,
    page: 1,
    itemsPerPage: 10
  });
  const isReprocessingMarked = Boolean(
    result.data?.items.some(
      (item) => item.contribuyenteId === contribuyenteId || isSameCuit(item.cuit, cuit)
    )
  );

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="reprocessing"
      isReprocessingMarked={isReprocessingMarked}
    />
  );
}
