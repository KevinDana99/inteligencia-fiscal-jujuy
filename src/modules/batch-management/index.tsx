import {
  getBatchAvailableCrossesAction,
  getBatchManagementAction
} from './data/actions'
import { DEFAULT_BATCH_MANAGEMENT_LIST_QUERY } from './constants'
import { BatchManagementPage } from './presentation/components/BatchManagementPage'

export default async function BatchManagementModule() {
  const [batchResult, availableCrossesResult] = await Promise.all([
    getBatchManagementAction(DEFAULT_BATCH_MANAGEMENT_LIST_QUERY),
    getBatchAvailableCrossesAction()
  ])

  return (
    <BatchManagementPage
      initialBatchData={batchResult.data}
      initialAvailableCrosses={availableCrossesResult.data ?? []}
    />
  )
}
