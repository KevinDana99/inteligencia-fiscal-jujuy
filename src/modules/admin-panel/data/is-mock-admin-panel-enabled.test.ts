import { isMockAdminPanelEnabled } from './is-mock-admin-panel-enabled';

const ORIGINAL_USE_MOCK_ADMIN_PANEL = process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL;

describe('isMockAdminPanelEnabled', () => {
  afterEach(() => {
    if (typeof ORIGINAL_USE_MOCK_ADMIN_PANEL === 'undefined') {
      delete process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL;
      return;
    }

    process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL = ORIGINAL_USE_MOCK_ADMIN_PANEL;
  });

  it('returns false when the env var is missing', () => {
    delete process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL;

    expect(isMockAdminPanelEnabled()).toBe(false);
  });

  it('returns true only when the env var is explicitly true', () => {
    process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL = 'true';

    expect(isMockAdminPanelEnabled()).toBe(true);

    process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL = 'false';

    expect(isMockAdminPanelEnabled()).toBe(false);
  });
});
