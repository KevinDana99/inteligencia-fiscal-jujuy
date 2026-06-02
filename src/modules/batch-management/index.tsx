import { getBatchManagementAction } from './data/actions'
import { BatchManagementPage } from './presentation/components/BatchManagementPage'

export default async function BatchManagementModule() {
  const result = await getBatchManagementAction()

  return <BatchManagementPage initialBatchData={result.data} />
}
