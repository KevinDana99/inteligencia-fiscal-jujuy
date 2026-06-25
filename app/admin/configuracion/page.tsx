import { PAGE_METADATA } from '@/constants/metadata';
import { AdminPanelSettingsPage } from '@/modules/admin-panel/presentation/components/AdminPanelSettingsPage';

export const metadata = PAGE_METADATA.adminSettings;

export default function AdminSettingsPage() {
  return <AdminPanelSettingsPage />;
}
