import type {
  ICommandResult,
  ICatalogShowcase,
  IGetCatalogShowcaseParams,
  IUpdateCatalogShowcaseParams
} from '../models/CatalogShowcase';

export interface ICatalogShowcaseQueryPort {
  getCatalogShowcase(params: IGetCatalogShowcaseParams): Promise<ICatalogShowcase>;
}

export interface ICatalogShowcaseCommandPort {
  updateCatalogShowcaseHeadline(
    params: IUpdateCatalogShowcaseParams
  ): Promise<ICommandResult>;
}

export interface ICatalogShowcaseSource
  extends ICatalogShowcaseQueryPort,
    ICatalogShowcaseCommandPort {}
