import type { ICatalogShowcaseSource } from '../../interfaces/CatalogShowcaseSource';
import type {
  ICommandResult,
  ICatalogShowcase,
  IGetCatalogShowcaseParams,
  IUpdateCatalogShowcaseParams
} from '../../models/CatalogShowcase';
import { catalogShowcaseFixture } from './fixtures/catalogShowcaseFixture';

export class MockCatalogShowcaseSource implements ICatalogShowcaseSource {
  constructor(private readonly delayMs = 80) {}

  async getCatalogShowcase(
    params: IGetCatalogShowcaseParams
  ): Promise<ICatalogShowcase> {
    void params;
    await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    return catalogShowcaseFixture;
  }

  async updateCatalogShowcaseHeadline(
    params: IUpdateCatalogShowcaseParams
  ): Promise<ICommandResult> {
    void params;
    await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    return { success: true };
  }
}
