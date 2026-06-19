import { getUnifiedRegisterMercurioAction } from '../../data/actions';
import { UnifiedRegisterPreviewHydrationBridge } from '../../presentation/components/UnifiedRegisterPreviewPage/UnifiedRegisterPreviewHydrationBridge';
import { UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE } from '../../presentation/constants/unifiedRegisterDetail';
import type { ContributorModuleProps } from '../types';

export async function MercurioModule({
  contribuyenteId
}: Pick<ContributorModuleProps, 'contribuyenteId'>) {
  const result = await getUnifiedRegisterMercurioAction(contribuyenteId, {
    pagina: 1,
    itemsPagina: UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE
  });

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="mercurio"
      mercurioData={result.data}
      mercurioError={result.error}
    />
  );
}
