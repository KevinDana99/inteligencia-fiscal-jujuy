import type { IExplorerRegisterCatalog } from '../../../data/models/ExplorerRegister';
import type { useExplorerRegister } from '../../hooks/useExplorerRegister';

export interface ExplorerRegisterPageProps {
  catalog: IExplorerRegisterCatalog | null;
  catalogError?: string;
}

export type ExplorerRegisterController = ReturnType<typeof useExplorerRegister>;
