import { isMockAuthEnabled } from './is-mock-auth-enabled';

const ORIGINAL_USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH;
const ORIGINAL_RUNTIME_USE_MOCK_AUTH = process.env.USE_MOCK_AUTH;

describe('isMockAuthEnabled', () => {
  afterEach(() => {
    if (typeof ORIGINAL_USE_MOCK_AUTH === 'undefined') {
      delete process.env.NEXT_PUBLIC_USE_MOCK_AUTH;
    } else {
      process.env.NEXT_PUBLIC_USE_MOCK_AUTH = ORIGINAL_USE_MOCK_AUTH;
    }

    if (typeof ORIGINAL_RUNTIME_USE_MOCK_AUTH === 'undefined') {
      delete process.env.USE_MOCK_AUTH;
    } else {
      process.env.USE_MOCK_AUTH = ORIGINAL_RUNTIME_USE_MOCK_AUTH;
    }
  });

  it('returns false when both env vars are missing', () => {
    delete process.env.USE_MOCK_AUTH;
    delete process.env.NEXT_PUBLIC_USE_MOCK_AUTH;

    expect(isMockAuthEnabled()).toBe(false);
  });

  it('uses the public env var as a compatibility fallback', () => {
    delete process.env.USE_MOCK_AUTH;
    process.env.NEXT_PUBLIC_USE_MOCK_AUTH = 'true';

    expect(isMockAuthEnabled()).toBe(true);

    process.env.NEXT_PUBLIC_USE_MOCK_AUTH = 'false';

    expect(isMockAuthEnabled()).toBe(false);
  });

  it('prioritizes the server runtime env var', () => {
    process.env.NEXT_PUBLIC_USE_MOCK_AUTH = 'false';
    process.env.USE_MOCK_AUTH = 'true';

    expect(isMockAuthEnabled()).toBe(true);

    process.env.NEXT_PUBLIC_USE_MOCK_AUTH = 'true';
    process.env.USE_MOCK_AUTH = 'false';

    expect(isMockAuthEnabled()).toBe(false);
  });
});
