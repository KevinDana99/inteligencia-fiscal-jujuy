import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildUnifiedRegisterPreviewMetadata } from '@/constants/metadata';
import UnifiedRegisterPreviewModule from '@/modules/unified-register/preview';
import { resolveUnifiedRegisterPreviewRouteData } from '@/modules/unified-register/preview/resolvePreviewRouteData';

type UnifiedRegisterPreviewRouteProps = {
  params: Promise<{ cuit: string }>;
  searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({
  params
}: UnifiedRegisterPreviewRouteProps): Promise<Metadata> {
  const { cuit } = await params;

  return buildUnifiedRegisterPreviewMetadata(cuit);
}

export default async function UnifiedRegisterPreviewRoute({
  params,
  searchParams
}: UnifiedRegisterPreviewRouteProps) {
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
