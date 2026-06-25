import { PAGE_METADATA } from '@/constants/metadata'
import CrossManagementModule from '@/modules/cross-management'

export const metadata = PAGE_METADATA.crossManagement

export default function GestionDeCrucesPage() {
  return <CrossManagementModule />
}
