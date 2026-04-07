export interface ICatalogHighlight {
  id: string;
  title: string;
  description: string;
  tag: string;
  priceLabel: string;
}

export type ICatalogHighlightCollection = ICatalogHighlight[];

export interface ICatalogShowcase {
  id: string;
  headline: string;
  summary: string;
  updatedAt: string;
  highlights: ICatalogHighlightCollection;
}

export interface IGetCatalogShowcaseParams {
  id: string;
}

export interface IUpdateCatalogShowcaseParams {
  id: string;
  headline: string;
}

export interface ICommandResult {
  success: boolean;
  error?: string;
}

export interface IModuleQueryResult<TData> {
  data: TData | null;
  error?: string;
}
