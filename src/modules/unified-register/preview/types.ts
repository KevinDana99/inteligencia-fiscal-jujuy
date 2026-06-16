import type { IUnifiedRegisterDetail } from '../data/models/UnifiedRegister';

export type UnifiedRegisterPreviewModuleProps = {
  cuit: string;
  cuitMatchedContribuyenteId: string | null;
  isFixtureItem: boolean;
  item: IUnifiedRegisterDetail;
};

export type ContributorModuleProps = {
  contribuyenteId: string;
  cuit: string;
};
