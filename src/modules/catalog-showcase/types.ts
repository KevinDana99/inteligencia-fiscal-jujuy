import type {
  ICatalogHighlight,
  ICatalogHighlightCollection,
  ICatalogShowcase
} from './data/models/CatalogShowcase';

export interface CatalogShowcaseModuleProps {
  id: string;
}

export interface CatalogShowcaseCardProps {
  id: string;
  catalog: ICatalogShowcase;
}

export type { ICatalogHighlight, ICatalogHighlightCollection, ICatalogShowcase };
