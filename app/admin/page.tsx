import { PAGE_METADATA } from '@/constants/metadata'
import AdminPanelModule from '@/modules/admin-panel'

export const metadata = PAGE_METADATA.admin

export default function AdminPage() {
  return <AdminPanelModule />
}
