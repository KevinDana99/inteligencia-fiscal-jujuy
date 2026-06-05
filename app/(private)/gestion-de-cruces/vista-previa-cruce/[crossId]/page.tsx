import { getCrossManagementAction, getCrossResultsAction } from '@/modules/cross-management/data/actions'
import { mapCrossResultsToPreview } from '@/modules/cross-management/data/mappers/mapCrossResultsToPreview'
import { CrossPreviewPage } from '@/modules/cross-management/presentation/components/CrossPreviewPage'

const RESULTS_PREVIEW_ITEMS_PER_PAGE = 100

export default async function CrossPreviewRoute({
  params
}: {
  params: Promise<{ crossId: string }>
}) {
  const { crossId } = await params
  const executionId = Number(crossId)

  if (!Number.isInteger(executionId) || executionId <= 0) {
    return <CrossPreviewPage cross={null} />
  }

  const [resultsResponse, executionsResponse] = await Promise.all([
    getCrossResultsAction(executionId, {
      page: 1,
      itemsPerPage: RESULTS_PREVIEW_ITEMS_PER_PAGE
    }),
    getCrossManagementAction({
      page: 1,
      itemsPerPage: RESULTS_PREVIEW_ITEMS_PER_PAGE
    })
  ])
  const execution =
    executionsResponse.data?.items.find((item) => item.id === crossId) ?? null
  const cross = resultsResponse.data
    ? mapCrossResultsToPreview(executionId, resultsResponse.data, execution)
    : null

  return <CrossPreviewPage cross={cross} error={resultsResponse.error} />
}
