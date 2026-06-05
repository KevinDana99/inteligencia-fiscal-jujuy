import { getCrossManagementAction } from '@/modules/cross-management/data/actions'
import { CrossManagementPage } from '@/modules/cross-management/presentation/components/CrossManagementPage'

const DEFAULT_ITEMS_PER_PAGE = 20

export default async function GestionDeCrucesPage() {
  const result = await getCrossManagementAction({
    page: 1,
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE
  })

  return <CrossManagementPage initialCrossData={result.data} />
}
