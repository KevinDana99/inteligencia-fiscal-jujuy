import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ModalLoader } from '@/components/core/ModalLoader';
import { getBatchAvailableCrossesAction } from '@/modules/batch-management/data/actions';
import { getReprocessingAction } from '@/modules/reprocessing/data/actions';
import {
  getAlternateAddressesAction,
  getContactsAction,
  getNotesAction,
  getUnifiedRegisterHeaderAction,
  getUnifiedRegisterInterventionOrdersAction,
  getUnifiedRegisterMercurioAction
} from './data/actions';
import { mapAlternateAddressRecordToViewModel } from './data/mappers/mapAlternateAddress';
import type { IUnifiedRegisterDetail } from './data/models/UnifiedRegister';
import { applyUnifiedRegisterHeaderToDetail } from './data/utils/unifiedRegisterDetail';
import { isSameCuit } from './data/utils/resolveUnifiedRegisterPreviewContributor';
import { UnifiedRegisterPreviewPage } from './presentation/components/UnifiedRegisterPreviewPage';
import { UnifiedRegisterPreviewHydrationBridge } from './presentation/components/UnifiedRegisterPreviewPage/UnifiedRegisterPreviewHydrationBridge';
import { UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE } from './presentation/constants/unifiedRegisterDetail';

type UnifiedRegisterPreviewModuleProps = {
  cuit: string;
  cuitMatchedContribuyenteId: string | null;
  isFixtureItem: boolean;
  item: IUnifiedRegisterDetail;
};

type ContributorModuleProps = {
  contribuyenteId: string;
  cuit: string;
};

export default function UnifiedRegisterPreviewModule(
  props: UnifiedRegisterPreviewModuleProps
) {
  return (
    <Suspense fallback={<ModalLoader message="Cargando padrón..." opened />}>
      <UnifiedRegisterPreviewHeaderModule {...props} />
    </Suspense>
  );
}

async function UnifiedRegisterPreviewHeaderModule({
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
      <UnifiedRegisterPreviewHydrationModules
        contribuyenteId={resolvedItem.contribuyenteId}
        cuit={resolvedItem.cuit}
        shouldLoadBackendLists={hasBackendHeader}
      />
    </UnifiedRegisterPreviewPage>
  );
}

function UnifiedRegisterPreviewHydrationModules({
  contribuyenteId,
  cuit,
  shouldLoadBackendLists
}: ContributorModuleProps & { shouldLoadBackendLists: boolean }) {
  return (
    <>
      <Suspense fallback={null}>
        <UnifiedRegisterPreviewAvailableCrossesModule />
      </Suspense>
      <Suspense fallback={null}>
        <UnifiedRegisterPreviewReprocessingModule
          contribuyenteId={contribuyenteId}
          cuit={cuit}
        />
      </Suspense>
      {shouldLoadBackendLists ? (
        <>
          <Suspense fallback={null}>
            <UnifiedRegisterPreviewAddressesModule
              contribuyenteId={contribuyenteId}
            />
          </Suspense>
          <Suspense fallback={null}>
            <UnifiedRegisterPreviewContactsModule
              contribuyenteId={contribuyenteId}
            />
          </Suspense>
          <Suspense fallback={null}>
            <UnifiedRegisterPreviewNotesModule
              contribuyenteId={contribuyenteId}
            />
          </Suspense>
          <Suspense fallback={null}>
            <UnifiedRegisterPreviewMercurioModule
              contribuyenteId={contribuyenteId}
            />
          </Suspense>
          <Suspense fallback={null}>
            <UnifiedRegisterPreviewInterventionOrdersModule
              contribuyenteId={contribuyenteId}
            />
          </Suspense>
        </>
      ) : null}
    </>
  );
}

async function UnifiedRegisterPreviewAvailableCrossesModule() {
  const result = await getBatchAvailableCrossesAction();

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="available-crosses"
      availableCrosses={result.data ?? []}
    />
  );
}

async function UnifiedRegisterPreviewReprocessingModule({
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
      (reprocessingItem) =>
        reprocessingItem.contribuyenteId === contribuyenteId ||
        isSameCuit(reprocessingItem.cuit, cuit)
    )
  );

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="reprocessing"
      isReprocessingMarked={isReprocessingMarked}
    />
  );
}

async function UnifiedRegisterPreviewAddressesModule({
  contribuyenteId
}: Pick<ContributorModuleProps, 'contribuyenteId'>) {
  const result = await getAlternateAddressesAction(contribuyenteId);
  const addresses =
    result.data?.domiciliosAlternativos.map(mapAlternateAddressRecordToViewModel) ??
    [];

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="addresses"
      addresses={addresses}
      addressesError={result.error}
    />
  );
}

async function UnifiedRegisterPreviewContactsModule({
  contribuyenteId
}: Pick<ContributorModuleProps, 'contribuyenteId'>) {
  const result = await getContactsAction(contribuyenteId, {
    pagina: 1,
    itemsPagina: 1
  });

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="contacts"
      contactsData={result.data}
      contactsError={result.error}
    />
  );
}

async function UnifiedRegisterPreviewNotesModule({
  contribuyenteId
}: Pick<ContributorModuleProps, 'contribuyenteId'>) {
  const result = await getNotesAction(contribuyenteId, {
    pagina: 1,
    itemsPagina: 1
  });

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="notes"
      notesData={result.data}
      notesError={result.error}
    />
  );
}

async function UnifiedRegisterPreviewMercurioModule({
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

async function UnifiedRegisterPreviewInterventionOrdersModule({
  contribuyenteId
}: Pick<ContributorModuleProps, 'contribuyenteId'>) {
  const result = await getUnifiedRegisterInterventionOrdersAction(
    contribuyenteId,
    {
      pagina: 1,
      itemsPagina: UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE
    }
  );

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="intervention-orders"
      interventionOrdersData={result.data}
      interventionOrdersError={result.error}
    />
  );
}

