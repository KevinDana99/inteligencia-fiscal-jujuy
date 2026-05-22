import { getReprocessingAction } from './data/actions'
import { ReprocessingPage } from './presentation/components/ReprocessingPage'

export default async function ReprocessingModule() {
  const result = await getReprocessingAction()

  return <ReprocessingPage initialData={result.data} />
}
