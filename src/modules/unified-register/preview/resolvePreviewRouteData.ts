import { getUnifiedRegisterListAction } from '../data/actions';
import type { IUnifiedRegisterDetail } from '../data/models/UnifiedRegister';
import { unifiedRegisterDetailsFixture } from '../data/sources/mock/fixtures/unifiedRegisterItems';
import {
  findContributorByCuit,
  isSameCuit,
  normalizeCuit,
  resolvePreviewContribuyenteId
} from '../data/utils/resolveUnifiedRegisterPreviewContributor';

const CONTRIBUTOR_LOOKUP_PAGE_SIZE = 50;
const unifiedRegisterDetailTemplate = unifiedRegisterDetailsFixture[0];

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

export async function resolveUnifiedRegisterPreviewRouteData({
  cuit,
  id
}: {
  cuit: string;
  id?: string;
}) {
  const fixtureItem = findContributorByCuit(unifiedRegisterDetailsFixture, cuit);
  const backendListItem = fixtureItem || id
    ? null
    : await findContribuyenteByCuit(cuit);
  const cuitMatchedContribuyenteId =
    fixtureItem?.contribuyenteId ?? backendListItem?.contribuyenteId ?? null;
  const contribuyenteId = resolvePreviewContribuyenteId({
    cuitMatchedContribuyenteId,
    routeContribuyenteId: id
  });

  if (!contribuyenteId) {
    return null;
  }

  return {
    cuitMatchedContribuyenteId,
    isFixtureItem: Boolean(fixtureItem),
    item: fixtureItem ?? buildUnifiedRegisterDetailFallback(contribuyenteId, cuit)
  };
}
