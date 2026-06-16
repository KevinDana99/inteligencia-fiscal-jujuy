import { getUnifiedRegisterInterventionOrdersAction } from '../../data/actions';
import { UnifiedRegisterPreviewHydrationBridge } from '../../presentation/components/UnifiedRegisterPreviewPage/UnifiedRegisterPreviewHydrationBridge';
import { UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE } from '../../presentation/constants/unifiedRegisterDetail';
import type { ContributorModuleProps } from '../types';

export async function InterventionOrdersModule({
  contribuyenteId
}: Pick<ContributorModuleProps, 'contribuyenteId'>) {
  const result = await getUnifiedRegisterInterventionOrdersAction(contribuyenteId, {
    pagina: 1,
    itemsPagina: UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE
  });

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="intervention-orders"
      interventionOrdersData={result.data}
      interventionOrdersError={result.error}
    />
  );
}
