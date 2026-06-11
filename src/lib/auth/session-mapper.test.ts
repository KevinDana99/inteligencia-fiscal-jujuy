import { AUTH_REFRESH_SKEW_MS } from './constants';
import {
  isSessionExpired,
  isSessionExpiredOrWithinSkew
} from './session-mapper';

const NOW = new Date('2026-01-01T00:00:00.000Z');

describe('session-mapper expiry helpers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('detects expired sessions without applying refresh skew', () => {
    expect(isSessionExpired(new Date(NOW.getTime() - 1).toISOString())).toBe(
      true
    );
    expect(isSessionExpired(new Date(NOW.getTime() + 1).toISOString())).toBe(
      false
    );
  });

  it('treats sessions inside the refresh skew as stale', () => {
    expect(
      isSessionExpiredOrWithinSkew(
        new Date(NOW.getTime() + AUTH_REFRESH_SKEW_MS - 1).toISOString()
      )
    ).toBe(true);
  });

  it('keeps sessions outside the refresh skew as usable', () => {
    expect(
      isSessionExpiredOrWithinSkew(
        new Date(NOW.getTime() + AUTH_REFRESH_SKEW_MS + 1).toISOString()
      )
    ).toBe(false);
  });
});
