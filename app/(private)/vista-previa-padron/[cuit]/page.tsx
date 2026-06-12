import { notFound } from 'next/navigation';
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
import { UnifiedRegisterPreviewPage } from '@/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage';
import { UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE } from '@/modules/unified-register/presentation/constants/unifiedRegisterDetail';
import {
  mapFineRecordToViewModel,
  mapInterventionOrderRecordToViewModel
} from '@/modules/unified-register/presentation/utils/unifiedRegisterDetailRecords';
import { unifiedRegisterDetailsFixture } from '@/modules/unified-register/data/sources/mock/fixtures/unifiedRegisterItems';

const unifiedRegisterDetailTemplate = unifiedRegisterDetailsFixture[0];
const CONTRIBUTOR_LOOKUP_PAGE_SIZE = 50;

function normalizeCuit(value: string) {
  return value.replace(/\D/g, '');
}

function isSameCuit(candidate: string, target: string) {
  const normalizedCandidate = normalizeCuit(candidate);
  const normalizedTarget = normalizeCuit(target);

  return candidate === target || normalizedCandidate === normalizedTarget;
}

async function findContribuyenteIdByCuit(cuit: string) {
  const firstPageResult = await getUnifiedRegisterListAction(
    1,
    CONTRIBUTOR_LOOKUP_PAGE_SIZE
  );
  const firstPage = firstPageResult.data;

  if (!firstPage) {
    return null;
  }

  const firstPageMatch = firstPage.contribuyentes.find((entry) =>
    isSameCuit(entry.cuit, cuit)
  );

  if (firstPageMatch) {
    return firstPageMatch.contribuyenteId;
  }

  for (let page = 2; page <= firstPage.totalPaginas; page += 1) {
    const pageResult = await getUnifiedRegisterListAction(
      page,
      CONTRIBUTOR_LOOKUP_PAGE_SIZE
    );
    const pageData = pageResult.data;

    if (!pageData) {
      continue;
    }

    const match = pageData.contribuyentes.find((entry) =>
      isSameCuit(entry.cuit, cuit)
    );

    if (match) {
      return match.contribuyenteId;
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
  const fixtureItem = unifiedRegisterDetailsFixture.find((entry) =>
    id ? entry.contribuyenteId === id : isSameCuit(entry.cuit, decodedCuit)
  );
  const contribuyenteId =
    id ??
    fixtureItem?.contribuyenteId ??
    (await findContribuyenteIdByCuit(decodedCuit));

  if (!contribuyenteId) {
    notFound();
  }

  const item =
    fixtureItem ?? buildUnifiedRegisterDetailFallback(contribuyenteId, decodedCuit);

  const [
    headerResult,
    alternateAddressesResult,
    notesResult,
    contactsResult,
    mercurioResult,
    interventionOrdersResult
  ] = await Promise.all([
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
    })
  ]);

  const header = headerResult.data;
  const hasBackendHeader = Boolean(header);

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

  return (
    <UnifiedRegisterPreviewPage
      item={resolvedItem}
      initialContactsData={contactsResult.data ?? null}
      initialMercurioData={mercurioResult.data ?? null}
      initialInterventionOrdersData={interventionOrdersResult.data ?? null}
      initialNotesData={notesResult.data ?? null}
    />
  );
}
