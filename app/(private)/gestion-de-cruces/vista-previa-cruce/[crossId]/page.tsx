import type { Metadata } from 'next'
import { buildCrossPreviewMetadata } from '@/constants/metadata'
import CrossPreviewModule from '@/modules/cross-management/preview'

type CrossPreviewRouteProps = {
  params: Promise<{ crossId: string }>
}

export async function generateMetadata({
  params
}: CrossPreviewRouteProps): Promise<Metadata> {
  const { crossId } = await params

  return buildCrossPreviewMetadata(crossId)
}

export default function CrossPreviewRoute({ params }: CrossPreviewRouteProps) {
  return <CrossPreviewModule params={params} />
}
