export interface ApiCatalogHighlightDto {
  id: string;
  title: string;
  description: string;
  tag: string;
  price_label: string;
}

export interface ApiCatalogShowcaseDto {
  id: string;
  headline: string;
  summary: string;
  updated_at: string;
  highlights: ApiCatalogHighlightDto[];
}
