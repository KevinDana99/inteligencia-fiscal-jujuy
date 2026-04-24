import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import { AdminPanelSettingsSection } from '../AdminPanelSettingsSection';
import { AdminPanelTemplate } from '../AdminPanelTemplate';

export function AdminPanelSettingsPage({ session }: { session: IAuthSession }) {
  return (
    <AdminPanelTemplate session={session} currentSection="settings">
      <AdminPanelSettingsSection />
    </AdminPanelTemplate>
  );
}
