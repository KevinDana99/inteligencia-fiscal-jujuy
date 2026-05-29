import { notFound } from 'next/navigation';
import { UnifiedRegisterPreviewPage } from '@/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage';
import { unifiedRegisterDetailsFixture } from '@/modules/unified-register/data/sources/mock/fixtures/unifiedRegisterItems';

export default async function UnifiedRegisterPreviewRoute({
  params
}: {
  params: Promise<{ cuit: string }>;
}) {
  const { cuit } = await params;
  const decodedCuit = decodeURIComponent(cuit);
  const item = unifiedRegisterDetailsFixture.find((entry) => entry.cuit === decodedCuit);

  if (!item) {
    notFound();
  }

  return <UnifiedRegisterPreviewPage item={item} />;
}
