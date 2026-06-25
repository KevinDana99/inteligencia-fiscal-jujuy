import { PAGE_METADATA } from '@/constants/metadata'
import BatchManagementModule from '@/modules/batch-management'

export const metadata = PAGE_METADATA.batchManagement

export default async function GestionDeLotesPage() {
  return <BatchManagementModule />
}
