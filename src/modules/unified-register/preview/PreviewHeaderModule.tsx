import { notFound } from 'next/navigation';
import { getUnifiedRegisterHeaderAction } from '../data/actions';
import { applyUnifiedRegisterHeaderToDetail } from '../data/utils/unifiedRegisterDetail';
import { isSameCuit } from '../data/utils/resolveUnifiedRegisterPreviewContributor';
import { UnifiedRegisterPreviewPage } from '../presentation/components/UnifiedRegisterPreviewPage';
import { PreviewHydrationModules } from './PreviewHydrationModules';
import type { UnifiedRegisterPreviewModuleProps } from './types';

export async function PreviewHeaderModule({
  cuit,
  cuitMatchedContribuyenteId,
  isFixtureItem,
  item
}: UnifiedRegisterPreviewModuleProps) {
  const headerResult = isFixtureItem
    ? { data: null }
    : await getUnifiedRegisterHeaderAction(item.contribuyenteId);
  const header = headerResult.data;
  const hasBackendHeader = Boolean(header);

  if (!cuitMatchedContribuyenteId && header && !isSameCuit(header.cuit, cuit)) {
    notFound();
  }

  if (!isFixtureItem && !header) {
    notFound();
  }

  const detailFromHeader = header
    ? applyUnifiedRegisterHeaderToDetail(item, header)
    : item;
  const resolvedItem = {
    ...detailFromHeader,
    addresses: hasBackendHeader ? [] : item.addresses,
    contacts: hasBackendHeader ? [] : item.contacts,
    notes: hasBackendHeader ? [] : item.notes,
    fines: hasBackendHeader ? [] : item.fines,
    interventionOrders: hasBackendHeader ? [] : item.interventionOrders
  };

  return (
    <UnifiedRegisterPreviewPage
      item={resolvedItem}
      initialAvailableCrosses={[]}
      initialIsReprocessing={false}
      initialContactsData={null}
      initialMercurioData={null}
      initialInterventionOrdersData={null}
      initialNotesData={null}
      shouldHydrateAddressesOnMount={hasBackendHeader}
      shouldHydrateContactsOnMount={hasBackendHeader}
      shouldHydrateNotesOnMount={hasBackendHeader}
      shouldHydrateMercurioOnMount={hasBackendHeader}
      shouldHydrateInterventionOrdersOnMount={hasBackendHeader}
      shouldHydrateAvailableCrossesOnMount
      shouldHydrateReprocessingOnMount
    >
      <PreviewHydrationModules
        contribuyenteId={resolvedItem.contribuyenteId}
        cuit={resolvedItem.cuit}
        shouldLoadBackendLists={hasBackendHeader}
      />
    </UnifiedRegisterPreviewPage>
  );
}
