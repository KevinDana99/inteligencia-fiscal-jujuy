import { getUnifiedRegisterListAction } from '../data/actions';
import type { IUnifiedRegisterItem } from '../data/models/UnifiedRegister';
import { resolveUnifiedRegisterPreviewRouteData } from './resolvePreviewRouteData';

jest.mock('../data/actions', () => ({
  getUnifiedRegisterListAction: jest.fn()
}));

const ORIGINAL_USE_MOCK_UNIFIED_REGISTER =
  process.env.NEXT_PUBLIC_USE_MOCK_UNIFIED_REGISTER;
const REAL_BACKEND_CONTRIBUTOR_ID = 'ba2affa0-76a4-47bf-9f77-ed91905aae13';
const FIXTURE_CONTRIBUTOR_ID = '9651b151-a51e-4ac9-914a-854230fbaa0a';

function createBackendContributor(
  overrides: Partial<IUnifiedRegisterItem> = {}
): IUnifiedRegisterItem {
  return {
    contribuyenteId: REAL_BACKEND_CONTRIBUTOR_ID,
    cuit: '30501685212',
    businessName: 'CERAMICA DEL NORTE S A',
    activity: 'Fabricacion de materiales ceramicos',
    regime: 'Convenio Multilateral',
    status: 'Activo',
    riskLevel: 'A',
    ...overrides
  };
}

function mockBackendContributors(contribuyentes: IUnifiedRegisterItem[]) {
  mockGetUnifiedRegisterListAction.mockResolvedValue({
    data: {
      pagina: 1,
      itemsPagina: 50,
      totalPaginas: contribuyentes.length ? 1 : 0,
      contribuyentes
    }
  });
}

const mockGetUnifiedRegisterListAction =
  getUnifiedRegisterListAction as jest.MockedFunction<
    typeof getUnifiedRegisterListAction
  >;

describe('resolveUnifiedRegisterPreviewRouteData', () => {
  afterEach(() => {
    mockGetUnifiedRegisterListAction.mockReset();

    if (typeof ORIGINAL_USE_MOCK_UNIFIED_REGISTER === 'undefined') {
      delete process.env.NEXT_PUBLIC_USE_MOCK_UNIFIED_REGISTER;
      return;
    }

    process.env.NEXT_PUBLIC_USE_MOCK_UNIFIED_REGISTER =
      ORIGINAL_USE_MOCK_UNIFIED_REGISTER;
  });

  it('resolves a clean CUIT URL with the contributor id returned by backend', async () => {
    mockBackendContributors([
      createBackendContributor({
        cuit: '30200000001'
      })
    ]);

    const result = await resolveUnifiedRegisterPreviewRouteData({
      cuit: '30200000001'
    });

    expect(result?.item.contribuyenteId).toBe(REAL_BACKEND_CONTRIBUTOR_ID);
    expect(result?.cuitMatchedContribuyenteId).toBe(
      REAL_BACKEND_CONTRIBUTOR_ID
    );
    expect(result?.isFixtureItem).toBe(false);
  });

  it('prefers backend when backend and fixture contain the same CUIT', async () => {
    mockBackendContributors([createBackendContributor()]);

    const result = await resolveUnifiedRegisterPreviewRouteData({
      cuit: '30501685212'
    });

    expect(result?.item.contribuyenteId).toBe(REAL_BACKEND_CONTRIBUTOR_ID);
    expect(result?.item.contribuyenteId).not.toBe(FIXTURE_CONTRIBUTOR_ID);
    expect(result?.isFixtureItem).toBe(false);
  });

  it('falls back to fixture when backend has no matching CUIT', async () => {
    mockBackendContributors([]);

    const result = await resolveUnifiedRegisterPreviewRouteData({
      cuit: '30501685212'
    });

    expect(result?.item.contribuyenteId).toBe(FIXTURE_CONTRIBUTOR_ID);
    expect(result?.cuitMatchedContribuyenteId).toBe(FIXTURE_CONTRIBUTOR_ID);
    expect(result?.isFixtureItem).toBe(true);
  });

  it('uses the route id as a fast-path without querying the list endpoint', async () => {
    const routeContributorId = 'route-contributor-id';

    const result = await resolveUnifiedRegisterPreviewRouteData({
      cuit: '30501685212',
      id: routeContributorId
    });

    expect(result?.item.contribuyenteId).toBe(routeContributorId);
    expect(result?.item.cuit).toBe('30501685212');
    expect(result?.item.businessName).toBe('');
    expect(result?.cuitMatchedContribuyenteId).toBe(routeContributorId);
    expect(result?.isFixtureItem).toBe(false);
    expect(mockGetUnifiedRegisterListAction).not.toHaveBeenCalled();
  });

  it('uses fixture data without querying backend in explicit mock mode', async () => {
    process.env.NEXT_PUBLIC_USE_MOCK_UNIFIED_REGISTER = 'true';

    const result = await resolveUnifiedRegisterPreviewRouteData({
      cuit: '30501685212',
      id: 'route-contributor-id'
    });

    expect(result?.item.contribuyenteId).toBe(FIXTURE_CONTRIBUTOR_ID);
    expect(result?.item.contribuyenteId).not.toBe('route-contributor-id');
    expect(result?.isFixtureItem).toBe(true);
    expect(mockGetUnifiedRegisterListAction).not.toHaveBeenCalled();
  });

  it('does not fall back to fixture when backend lookup fails', async () => {
    mockGetUnifiedRegisterListAction.mockResolvedValue({
      data: null,
      error: 'No fue posible listar los contribuyentes.'
    });

    await expect(
      resolveUnifiedRegisterPreviewRouteData({
        cuit: '30501685212'
      })
    ).rejects.toThrow('No fue posible listar los contribuyentes.');
  });
});
