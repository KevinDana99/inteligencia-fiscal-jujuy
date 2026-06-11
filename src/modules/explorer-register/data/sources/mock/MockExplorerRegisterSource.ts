import type { IExplorerRegisterSource } from '../../interfaces/ExplorerRegisterSource';
import type {
  IExplorerRegisterCatalog,
  IExplorerRegisterExploreData,
  IExplorerRegisterExplorePayload
} from '../../models/ExplorerRegister';
import { filterExplorerRegisterMockRows } from '../../utils/filterExplorerRegisterMockRows';
import {
  explorerRegisterCatalogFixture,
  explorerRegisterRowsFixture
} from './fixtures/explorerRegisterItems';

export class MockExplorerRegisterSource implements IExplorerRegisterSource {
  async getCatalog(): Promise<IExplorerRegisterCatalog> {
    return explorerRegisterCatalogFixture;
  }

  async explore(
    payload: IExplorerRegisterExplorePayload
  ): Promise<IExplorerRegisterExploreData> {
    const page = payload.page;
    const itemsPerPage = payload.itemsPerPage;
    const filteredRows = filterExplorerRegisterMockRows(
      explorerRegisterRowsFixture,
      payload.filters
    );
    const start = (page - 1) * itemsPerPage;
    const rows = filteredRows.slice(start, start + itemsPerPage);
    const selectedColumnCodes = new Set(payload.columns);
    const dynamicColumns = explorerRegisterCatalogFixture.availableColumns.filter(
      (column) => selectedColumnCodes.has(column.code)
    );

    return {
      page,
      itemsPerPage,
      totalItems: filteredRows.length,
      totalPages: Math.ceil(filteredRows.length / itemsPerPage),
      columns: [
        ...explorerRegisterCatalogFixture.fixedColumns,
        ...dynamicColumns
      ],
      appliedCriteria: {
        startDate: payload.startDate ?? null,
        endDate: payload.endDate ?? null,
        filters: payload.filters.map((filter) => filter.code),
        periodOrigin:
          payload.startDate && payload.endDate ? 'explicito' : 'defecto36Meses'
      },
      rows
    };
  }
}
