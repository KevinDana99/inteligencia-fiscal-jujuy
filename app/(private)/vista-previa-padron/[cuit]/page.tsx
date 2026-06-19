import { notFound } from 'next/navigation';
import UnifiedRegisterPreviewModule from '@/modules/unified-register/preview';
import { resolveUnifiedRegisterPreviewRouteData } from '@/modules/unified-register/preview/resolvePreviewRouteData';

export default async function UnifiedRegisterPreviewRoute({
  params,
  searchParams
}: {
  params: Promise<{ cuit: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { cuit } = await params;
  const { id } = await searchParams;
  const decodedCuit = decodeURIComponent(cuit);
  const previewRouteData = await resolveUnifiedRegisterPreviewRouteData({
    cuit: decodedCuit,
    id
  });

  if (!previewRouteData) {
    notFound();
  }

  return (
    <UnifiedRegisterPreviewModule
      cuit={decodedCuit}
      cuitMatchedContribuyenteId={
        previewRouteData.cuitMatchedContribuyenteId
      }
      isFixtureItem={previewRouteData.isFixtureItem}
      item={previewRouteData.item}
    />
  );
}
