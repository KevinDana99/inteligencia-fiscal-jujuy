import { Suspense } from 'react';
import { ModalLoader } from '@/components/core/ModalLoader';
import { PreviewHeaderModule } from './PreviewHeaderModule';
import type { UnifiedRegisterPreviewModuleProps } from './types';

export default function UnifiedRegisterPreviewModule(
  props: UnifiedRegisterPreviewModuleProps
) {
  return (
    <Suspense fallback={<ModalLoader message="Cargando padrón..." opened />}>
      <PreviewHeaderModule {...props} />
    </Suspense>
  );
}
