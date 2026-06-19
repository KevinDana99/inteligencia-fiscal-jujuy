import CrossPreviewModule from '@/modules/cross-management/preview'

export default function CrossPreviewRoute({
  params
}: {
  params: Promise<{ crossId: string }>
}) {
  return <CrossPreviewModule params={params} />
}

