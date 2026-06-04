export function isMockAdminPanelEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL === 'true';
}
