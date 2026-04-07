import type { ICatalogShowcase } from '../../../models/CatalogShowcase';
import type { ApiCatalogShowcaseDto } from '../dtos/ApiCatalogShowcaseDto';

export function mapCatalogShowcaseDto(dto: ApiCatalogShowcaseDto): ICatalogShowcase {
  return {
    id: dto.id,
    headline: dto.headline,
    summary: dto.summary,
    updatedAt: dto.updated_at,
    highlights: dto.highlights.map((highlight) => ({
      id: highlight.id,
      title: highlight.title,
      description: highlight.description,
      tag: highlight.tag,
      priceLabel: highlight.price_label
    }))
  };
}
