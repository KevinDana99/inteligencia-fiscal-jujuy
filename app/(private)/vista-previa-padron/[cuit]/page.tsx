import { getUnifiedRegisterItemByCuitAction } from '@/modules/unified-register/data/actions';
import { UnifiedRegisterPreviewPage } from '@/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage';

export default async function UnifiedRegisterPreviewRoute({
  params
}: {
  params: Promise<{ cuit: string }>;
}) {
  const { cuit } = await params;
  const decodedCuit = decodeURIComponent(cuit);
  const item = await getUnifiedRegisterItemByCuitAction(decodedCuit);

  return <UnifiedRegisterPreviewPage cuit={decodedCuit} item={item} />;
}
