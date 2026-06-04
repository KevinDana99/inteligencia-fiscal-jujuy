import { isMockAuthEnabled } from './is-mock-auth-enabled';

const ORIGINAL_USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH;

describe('isMockAuthEnabled', () => {
  afterEach(() => {
    if (typeof ORIGINAL_USE_MOCK_AUTH === 'undefined') {
      delete process.env.NEXT_PUBLIC_USE_MOCK_AUTH;
      return;
    }

    process.env.NEXT_PUBLIC_USE_MOCK_AUTH = ORIGINAL_USE_MOCK_AUTH;
  });

  it('returns false when the env var is missing', () => {
    delete process.env.NEXT_PUBLIC_USE_MOCK_AUTH;

    expect(isMockAuthEnabled()).toBe(false);
  });

  it('returns true only when the env var is explicitly true', () => {
    process.env.NEXT_PUBLIC_USE_MOCK_AUTH = 'true';

    expect(isMockAuthEnabled()).toBe(true);

    process.env.NEXT_PUBLIC_USE_MOCK_AUTH = 'false';

    expect(isMockAuthEnabled()).toBe(false);
  });
});
