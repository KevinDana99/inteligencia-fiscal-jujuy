import { Suspense } from 'react'
import { getCrossManagementAction } from './data/actions'
import {
  DEFAULT_CROSS_MANAGEMENT_ITEMS_PER_PAGE,
  DEFAULT_CROSS_MANAGEMENT_PAGE
} from './constants/crossManagementRequest'
import { CrossManagementPage } from './presentation/components/CrossManagementPage'
import { CrossManagementPageLoader } from './presentation/components/CrossManagementPage/CrossManagementPageLoader'

export default function CrossManagementModule() {
  return (
    <Suspense fallback={<CrossManagementPageLoader />}>
      <CrossManagementModuleContent />
    </Suspense>
  )
}

async function CrossManagementModuleContent() {
  const result = await getCrossManagementAction({
    itemsPerPage: DEFAULT_CROSS_MANAGEMENT_ITEMS_PER_PAGE,
    page: DEFAULT_CROSS_MANAGEMENT_PAGE
  })

  return <CrossManagementPage initialCrossData={result.data} />
}
