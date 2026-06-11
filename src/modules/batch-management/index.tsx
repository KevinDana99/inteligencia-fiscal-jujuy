import { getBatchManagementAction } from './data/actions'
import { DEFAULT_BATCH_MANAGEMENT_LIST_QUERY } from './constants'
import { BatchManagementPage } from './presentation/components/BatchManagementPage'

export default async function BatchManagementModule() {
  const result = await getBatchManagementAction(DEFAULT_BATCH_MANAGEMENT_LIST_QUERY)

  return <BatchManagementPage initialBatchData={result.data} />
}
