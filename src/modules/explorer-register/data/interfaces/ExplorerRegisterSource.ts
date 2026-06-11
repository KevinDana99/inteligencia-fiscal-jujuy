import type {
  IExplorerRegisterCatalog,
  IExplorerRegisterExploreData,
  IExplorerRegisterExplorePayload
} from '../models/ExplorerRegister';

export interface IExplorerRegisterQueryPort {
  getCatalog(): Promise<IExplorerRegisterCatalog>;
  explore(
    payload: IExplorerRegisterExplorePayload
  ): Promise<IExplorerRegisterExploreData>;
}

export type IExplorerRegisterSource = IExplorerRegisterQueryPort;
