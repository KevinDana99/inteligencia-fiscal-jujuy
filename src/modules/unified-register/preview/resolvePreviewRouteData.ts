import { getUnifiedRegisterListAction } from '../data/actions';
import { isMockUnifiedRegisterEnabled } from '../data/is-mock-unified-register-enabled';
import type {
  IUnifiedRegisterDetail,
  IUnifiedRegisterItem
} from '../data/models/UnifiedRegister';
import { unifiedRegisterDetailsFixture } from '../data/sources/mock/fixtures/unifiedRegisterItems';
import {
  findContributorByCuit,
  isSameCuit,
  normalizeCuit
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

    if (pageResult.error) {
      throw new Error(pageResult.error);
    }

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
  contributor: IUnifiedRegisterItem
): IUnifiedRegisterDetail {
  return {
    ...unifiedRegisterDetailTemplate,
    ...contributor
  };
}

function buildRouteContributorBase({
  cuit,
  id
}: {
  cuit: string;
  id: string;
}): IUnifiedRegisterItem {
  return {
    contribuyenteId: id,
    cuit,
    businessName: '',
    activity: '',
    regime: null,
    riskLevel: null,
    status: 'Activo'
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
  const shouldUseMock = isMockUnifiedRegisterEnabled();

  if (shouldUseMock) {
    if (!fixtureItem) {
      return null;
    }

    return {
      cuitMatchedContribuyenteId: fixtureItem.contribuyenteId,
      isFixtureItem: true,
      item: fixtureItem
    };
  }

  const routeContribuyenteId = id?.trim();

  if (routeContribuyenteId) {
    return {
      cuitMatchedContribuyenteId: routeContribuyenteId,
      isFixtureItem: false,
      item: buildUnifiedRegisterDetailFallback(
        buildRouteContributorBase({
          cuit,
          id: routeContribuyenteId
        })
      )
    };
  }

  const backendListItem = await findContribuyenteByCuit(cuit);

  if (backendListItem) {
    return {
      cuitMatchedContribuyenteId: backendListItem.contribuyenteId,
      isFixtureItem: false,
      item: buildUnifiedRegisterDetailFallback(backendListItem)
    };
  }

  if (fixtureItem) {
    return {
      cuitMatchedContribuyenteId: fixtureItem.contribuyenteId,
      isFixtureItem: true,
      item: fixtureItem
    };
  }

  return null;
}
