'use client';

import type { CatalogShowcaseCardProps } from '../../../types';
import { formatCatalogDate } from '../../utils/formatCatalogDate';

export function useCatalogShowcaseCard({ catalog, id }: CatalogShowcaseCardProps) {
  return {
    state: {
      id,
      formattedUpdatedAt: formatCatalogDate(catalog.updatedAt),
      highlights: catalog.highlights,
      summary: catalog.summary
    }
  };
}
