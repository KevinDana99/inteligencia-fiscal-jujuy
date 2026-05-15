import { UnifiedRegisterPreviewPage } from '@/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage';

export default async function UnifiedRegisterPreviewRoute({
  params
}: {
  params: Promise<{ cuit: string }>;
}) {
  const { cuit } = await params;

  return <UnifiedRegisterPreviewPage cuit={decodeURIComponent(cuit)} />;
}
