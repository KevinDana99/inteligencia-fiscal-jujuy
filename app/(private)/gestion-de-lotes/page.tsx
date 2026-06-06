import { getBatchManagementAction } from '@/modules/batch-management/data/actions'
import { BatchManagementPage } from '@/modules/batch-management/presentation/components/BatchManagementPage'

const DEFAULT_ITEMS_PER_PAGE = 20

export default async function GestionDeLotesPage() {
  const result = await getBatchManagementAction({
    page: 1,
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE
  })

  return <BatchManagementPage initialBatchData={result.data} />
}
