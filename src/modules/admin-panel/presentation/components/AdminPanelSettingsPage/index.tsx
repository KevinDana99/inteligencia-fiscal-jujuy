import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import { AdminPanelSettingsSection } from '../AdminPanelSettingsSection';
import { AdminPanelTemplate } from '../AdminPanelTemplate';
import type { IAdminAllowedDomains } from '../../../data/models/AdminPanel'

export function AdminPanelSettingsPage({
  session,
  allowedDomains
}: {
  session: IAuthSession
  allowedDomains: IAdminAllowedDomains
}) {
  return (
    <AdminPanelTemplate
      session={session}
      currentSection="settings"
      initialAllowedDomains={allowedDomains}
    >
      <AdminPanelSettingsSection allowedDomains={allowedDomains} />
    </AdminPanelTemplate>
  );
}
