import { notFound } from 'next/navigation';
import { getUnifiedRegisterListAction } from '@/modules/unified-register/data/actions';
import type { IUnifiedRegisterDetail } from '@/modules/unified-register/data/models/UnifiedRegister';
import {
  findContributorByCuit,
  isSameCuit,
  normalizeCuit,
  resolvePreviewContribuyenteId
} from '@/modules/unified-register/data/utils/resolveUnifiedRegisterPreviewContributor';
import UnifiedRegisterPreviewModule from '@/modules/unified-register/preview';
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

  return (
    <UnifiedRegisterPreviewModule
      cuit={decodedCuit}
      cuitMatchedContribuyenteId={cuitMatchedContribuyenteId}
      isFixtureItem={Boolean(fixtureItem)}
      item={item}
    />
  );
}
