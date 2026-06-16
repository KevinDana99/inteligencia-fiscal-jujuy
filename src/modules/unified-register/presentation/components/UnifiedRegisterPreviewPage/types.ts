import type { ReactNode } from 'react';
import type { IBatchAvailableCrosses } from '@/modules/batch-management/data/models/BatchManagement';
import type {
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterDetail,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterNotesListData
} from '../../../data/models/UnifiedRegister';
import type { useInformeGeneration } from '../../hooks/useInformeGeneration';
import type { useUnifiedRegisterPreview } from '../../hooks/useUnifiedRegisterPreview';

export type UnifiedRegisterPreviewPageProps = {
  item: IUnifiedRegisterDetail;
  initialAvailableCrosses: IBatchAvailableCrosses;
  initialIsReprocessing: boolean;
  initialContactsData: IUnifiedRegisterContactsListData | null;
  initialMercurioData: IUnifiedRegisterFinesListData | null;
  initialInterventionOrdersData: IUnifiedRegisterInterventionOrdersListData | null;
  initialNotesData: IUnifiedRegisterNotesListData | null;
  shouldHydrateMercurioOnMount?: boolean;
  shouldHydrateInterventionOrdersOnMount?: boolean;
  shouldHydrateAddressesOnMount?: boolean;
  shouldHydrateContactsOnMount?: boolean;
  shouldHydrateNotesOnMount?: boolean;
  shouldHydrateAvailableCrossesOnMount?: boolean;
  shouldHydrateReprocessingOnMount?: boolean;
  children?: ReactNode;
};

export type PreviewController = ReturnType<typeof useUnifiedRegisterPreview>;
export type InformeGenerationController = ReturnType<typeof useInformeGeneration>;
