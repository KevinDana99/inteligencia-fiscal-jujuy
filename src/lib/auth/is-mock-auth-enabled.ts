export function isMockAuthEnabled(): boolean {
  if (typeof process.env.USE_MOCK_AUTH !== 'undefined') {
    return process.env.USE_MOCK_AUTH === 'true';
  }

  return process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';
}
