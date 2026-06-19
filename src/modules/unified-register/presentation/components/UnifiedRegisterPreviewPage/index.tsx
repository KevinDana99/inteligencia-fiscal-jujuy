'use client';

import { useMemo } from 'react';
import { UnifiedRegisterPreviewHydrationProvider } from '../../contexts/UnifiedRegisterPreviewHydrationContext';
import { useInformeGeneration } from '../../hooks/useInformeGeneration';
import { useUnifiedRegisterPreview } from '../../hooks/useUnifiedRegisterPreview';
import { PreviewBackButton } from './components/PreviewBackButton';
import { PreviewHeader } from './components/PreviewHeader';
import { PreviewLeftColumn } from './components/PreviewLeftColumn';
import { PreviewMetrics } from './components/PreviewMetrics';
import { PreviewModals } from './components/PreviewModals';
import { PreviewRightColumn } from './components/PreviewRightColumn';
import type { UnifiedRegisterPreviewPageProps } from './types';
import classes from './UnifiedRegisterPreviewPage.module.css';

export function UnifiedRegisterPreviewPage({
  item,
  initialAvailableCrosses,
  initialIsReprocessing,
  initialContactsData,
  initialMercurioData,
  initialInterventionOrdersData,
  initialNotesData,
  shouldHydrateMercurioOnMount = false,
  shouldHydrateInterventionOrdersOnMount = false,
  shouldHydrateAddressesOnMount = false,
  shouldHydrateContactsOnMount = false,
  shouldHydrateNotesOnMount = false,
  shouldHydrateAvailableCrossesOnMount = false,
  shouldHydrateReprocessingOnMount = false,
  children
}: UnifiedRegisterPreviewPageProps) {
  const preview = useUnifiedRegisterPreview({
    item,
    initialAvailableCrosses,
    initialIsReprocessing,
    initialContactsData,
    initialNotesData,
    initialMercurioData,
    initialInterventionOrdersData,
    hydration: {
      addresses: shouldHydrateAddressesOnMount,
      contacts: shouldHydrateContactsOnMount,
      notes: shouldHydrateNotesOnMount,
      mercurio: shouldHydrateMercurioOnMount,
      interventionOrders: shouldHydrateInterventionOrdersOnMount,
      availableCrosses: shouldHydrateAvailableCrossesOnMount,
      reprocessing: shouldHydrateReprocessingOnMount
    }
  });
  const hydrationContextValue = useMemo(() => preview.hydration, [preview.hydration]);
  const report = useInformeGeneration(item, preview.activeHeaderModal === 'report');
  const closeInformeFlow = () => {
    report.resetFlow();
    preview.closeHeaderModal();
  };

  return (
    <UnifiedRegisterPreviewHydrationProvider value={hydrationContextValue}>
      {children}
      <div className={classes.page}>
        <PreviewBackButton />
        <PreviewHeader item={item} preview={preview} />
        <PreviewMetrics item={item} />
        <div className={classes.contentGrid}>
          <PreviewLeftColumn item={item} preview={preview} />
          <PreviewRightColumn preview={preview} />
        </div>
        <PreviewModals
          item={item}
          preview={preview}
          report={report}
          onCloseReport={closeInformeFlow}
        />
      </div>
    </UnifiedRegisterPreviewHydrationProvider>
  );
}
