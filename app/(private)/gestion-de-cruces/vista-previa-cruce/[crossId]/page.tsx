import { CrossPreviewPage } from '@/modules/cross-management/presentation/components/CrossPreviewPage'

export default async function CrossPreviewRoute({
  params
}: {
  params: Promise<{ crossId: string }>
}) {
  const { crossId } = await params

  return <CrossPreviewPage crossId={crossId} />
}
