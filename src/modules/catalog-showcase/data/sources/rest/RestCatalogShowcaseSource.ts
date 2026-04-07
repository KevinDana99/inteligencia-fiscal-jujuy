import { getJson, type ApiClientConfig } from '@/lib/api-client';
import type { ICatalogShowcaseSource } from '../../interfaces/CatalogShowcaseSource';
import type {
  ICommandResult,
  ICatalogShowcase,
  IGetCatalogShowcaseParams,
  IUpdateCatalogShowcaseParams
} from '../../models/CatalogShowcase';
import type { ApiCatalogShowcaseDto } from './dtos/ApiCatalogShowcaseDto';
import { mapCatalogShowcaseDto } from './mappers/mapCatalogShowcaseDto';

export class RestCatalogShowcaseSource implements ICatalogShowcaseSource {
  constructor(private readonly config?: ApiClientConfig) {}

  async getCatalogShowcase(
    params: IGetCatalogShowcaseParams
  ): Promise<ICatalogShowcase> {
    const response = await getJson<ApiCatalogShowcaseDto>(
      `/api/catalog-showcase/${params.id}`,
      this.config,
      {
        next: { revalidate: 1800 }
      }
    );

    return mapCatalogShowcaseDto(response);
  }

  async updateCatalogShowcaseHeadline(
    params: IUpdateCatalogShowcaseParams
  ): Promise<ICommandResult> {
    const response = await fetch(
      `${this.config?.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}/api/catalog-showcase/${params.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config?.token
            ? { Authorization: `Bearer ${this.config.token}` }
            : {})
        },
        body: JSON.stringify({ headline: params.headline })
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Request failed with status ${response.status}`
      };
    }

    return { success: true };
  }
}
