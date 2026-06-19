import { getBatchAvailableCrossesAction } from '@/modules/batch-management/data/actions';
import { UnifiedRegisterPreviewHydrationBridge } from '../../presentation/components/UnifiedRegisterPreviewPage/UnifiedRegisterPreviewHydrationBridge';

export async function AvailableCrossesModule() {
  const result = await getBatchAvailableCrossesAction();

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="available-crosses"
      availableCrosses={result.data ?? []}
    />
  );
}
