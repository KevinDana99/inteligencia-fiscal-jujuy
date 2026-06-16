import { notFound } from 'next/navigation';
import { getReprocessingAction } from '@/modules/reprocessing/data/actions';
import { getBatchAvailableCrossesAction } from '@/modules/batch-management/data/actions';
import {
  getAlternateAddressesAction,
  getContactsAction,
  getNotesAction,
  getUnifiedRegisterHeaderAction,
  getUnifiedRegisterInterventionOrdersAction,
  getUnifiedRegisterListAction,
  getUnifiedRegisterMercurioAction
} from '@/modules/unified-register/data/actions';
import { mapAlternateAddressRecordToViewModel } from '@/modules/unified-register/data/mappers/mapAlternateAddress';
import { mapContactRecordToViewModel } from '@/modules/unified-register/data/mappers/mapContact';
import { mapNoteRecordToViewModel } from '@/modules/unified-register/data/mappers/mapNote';
import type { IUnifiedRegisterDetail } from '@/modules/unified-register/data/models/UnifiedRegister';
import { applyUnifiedRegisterHeaderToDetail } from '@/modules/unified-register/data/utils/unifiedRegisterDetail';
import {
  findContributorByCuit,
  isSameCuit,
  normalizeCuit,
  resolvePreviewContribuyenteId
} from '@/modules/unified-register/data/utils/resolveUnifiedRegisterPreviewContributor';
import { UnifiedRegisterPreviewPage } from '@/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage';
import { UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE } from '@/modules/unified-register/presentation/constants/unifiedRegisterDetail';
import {
  mapFineRecordToViewModel,
  mapInterventionOrderRecordToViewModel
} from '@/modules/unified-register/presentation/utils/unifiedRegisterDetailRecords';
import { unifiedRegisterDetailsFixture } from '@/modules/unified-register/data/sources/mock/fixtures/unifiedRegisterItems';

const unifiedRegisterDetailTemplate = unifiedRegisterDetailsFixture[0];
const CONTRIBUTOR_LOOKUP_PAGE_SIZE = 50;

async function findContribuyenteByCuit(cuit: string) {
  const searchTerms = Array.from(new Set([cuit, normalizeCuit(cuit)]))
    .map((term) => term.trim())
    .filter(Boolean);

  for (const searchTerm of searchTerms) {
    const pageResult = await getUnifiedRegisterListAction(
      1,
      CONTRIBUTOR_LOOKUP_PAGE_SIZE,
      searchTerm
    );
    const pageData = pageResult.data;

    if (!pageData) {
      continue;
    }

    const match = pageData.contribuyentes.find((entry) =>
      isSameCuit(entry.cuit, cuit)
    );

    if (match) {
      return match;
    }
  }

  return null;
}

function buildUnifiedRegisterDetailFallback(
  contribuyenteId: string,
  cuit: string
): IUnifiedRegisterDetail {
  return {
    ...unifiedRegisterDetailTemplate,
    contribuyenteId,
    cuit
  };
}

export default async function UnifiedRegisterPreviewRoute({
  params,
  searchParams
}: {
  params: Promise<{ cuit: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { cuit } = await params;
  const { id } = await searchParams;
  const decodedCuit = decodeURIComponent(cuit);
  const fixtureItem = findContributorByCuit(
    unifiedRegisterDetailsFixture,
    decodedCuit
  );
  const backendListItem = fixtureItem || id
    ? null
    : await findContribuyenteByCuit(decodedCuit);
  const cuitMatchedContribuyenteId =
    fixtureItem?.contribuyenteId ?? backendListItem?.contribuyenteId ?? null;
  const contribuyenteId = resolvePreviewContribuyenteId({
    cuitMatchedContribuyenteId,
    routeContribuyenteId: id
  });

  if (!contribuyenteId) {
    notFound();
  }

  const item =
    fixtureItem ?? buildUnifiedRegisterDetailFallback(contribuyenteId, decodedCuit);

  const [
    availableCrossesResult,
    headerResult,
    alternateAddressesResult,
    notesResult,
    contactsResult,
    mercurioResult,
    interventionOrdersResult,
    reprocessingResult
  ] = await Promise.all([
    getBatchAvailableCrossesAction(),
    getUnifiedRegisterHeaderAction(contribuyenteId),
    getAlternateAddressesAction(contribuyenteId),
    getNotesAction(contribuyenteId, {
      pagina: 1,
      itemsPagina: 1
    }),
    getContactsAction(contribuyenteId, {
      pagina: 1,
      itemsPagina: 1
    }),
    getUnifiedRegisterMercurioAction(contribuyenteId, {
      pagina: 1,
      itemsPagina: UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE
    }),
    getUnifiedRegisterInterventionOrdersAction(contribuyenteId, {
      pagina: 1,
      itemsPagina: UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE
    }),
    getReprocessingAction({
      search: decodedCuit,
      page: 1,
      itemsPerPage: 10
    })
  ]);

  const header = headerResult.data;
  const hasBackendHeader = Boolean(header);

  if (
    !cuitMatchedContribuyenteId &&
    header &&
    !isSameCuit(header.cuit, decodedCuit)
  ) {
    notFound();
  }

  if (!fixtureItem && !header) {
    notFound();
  }

  const detailFromHeader = header
    ? applyUnifiedRegisterHeaderToDetail(item, header)
    : item;
  const resolvedItem = {
    ...detailFromHeader,
    addresses:
      alternateAddressesResult.data?.domiciliosAlternativos.map(
        mapAlternateAddressRecordToViewModel
      ) ?? (hasBackendHeader ? [] : item.addresses),
    contacts:
      contactsResult.data?.contactos.flatMap(mapContactRecordToViewModel) ??
      (hasBackendHeader ? [] : item.contacts),
    notes:
      notesResult.data?.notas.map(mapNoteRecordToViewModel) ??
      (hasBackendHeader ? [] : item.notes),
    fines:
      mercurioResult.data?.multas.map(mapFineRecordToViewModel) ??
      (hasBackendHeader ? [] : item.fines),
    interventionOrders:
      interventionOrdersResult.data?.ordenes.map(
        mapInterventionOrderRecordToViewModel
      ) ?? (hasBackendHeader ? [] : item.interventionOrders)
  };
  const isReprocessingActive = Boolean(
    reprocessingResult.data?.items.some(
      (reprocessingItem) =>
        reprocessingItem.contribuyenteId === resolvedItem.contribuyenteId ||
        isSameCuit(reprocessingItem.cuit, resolvedItem.cuit)
    )
  );

  return (
    <UnifiedRegisterPreviewPage
      item={resolvedItem}
      initialAvailableCrosses={availableCrossesResult.data ?? []}
      initialIsReprocessing={isReprocessingActive}
      initialContactsData={contactsResult.data ?? null}
      initialMercurioData={mercurioResult.data ?? null}
      initialInterventionOrdersData={interventionOrdersResult.data ?? null}
      initialNotesData={notesResult.data ?? null}
    />
  );
}
