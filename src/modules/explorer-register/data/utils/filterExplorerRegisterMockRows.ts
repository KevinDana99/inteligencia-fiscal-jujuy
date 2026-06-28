import type {
  IExplorerRegisterExploreFilter,
  IExplorerRegisterRow
} from '../models/ExplorerRegister';

function normalizeMockValue(value: unknown) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeMockCuit(value: string) {
  return value.replace(/\D/g, '');
}

function matchesMockFilter(
  row: IExplorerRegisterRow,
  filter: IExplorerRegisterExploreFilter
) {
  const normalizedValues = filter.values.map(normalizeMockValue);
  const rowValue =
    filter.code === 'cuit'
      ? row.cuit
      : filter.code === 'razonSocial'
        ? row.businessName
        : row.values[filter.code];
  const normalizedRowValue = normalizeMockValue(rowValue);

  return normalizedValues.some((value) => normalizedRowValue.includes(value));
}

function matchesMockSearch(row: IExplorerRegisterRow, search?: string | null) {
  const normalizedSearch = normalizeMockValue(search);
  const normalizedSearchCuit = normalizeMockCuit(search ?? '');

  if (!normalizedSearch && !normalizedSearchCuit) {
    return true;
  }

  const normalizedBusinessName = normalizeMockValue(row.businessName);
  const normalizedVisibleCuit = normalizeMockValue(row.cuit);
  const normalizedRowCuit = normalizeMockCuit(row.cuit);

  return (
    normalizedBusinessName.includes(normalizedSearch) ||
    normalizedVisibleCuit.includes(normalizedSearch) ||
    (Boolean(normalizedSearchCuit) &&
      normalizedRowCuit.includes(normalizedSearchCuit))
  );
}

export function filterExplorerRegisterMockRows(
  rows: IExplorerRegisterRow[],
  filters: IExplorerRegisterExploreFilter[],
  search?: string | null
) {
  if (filters.length === 0 && !search?.trim()) {
    return rows;
  }

  return rows.filter((row) =>
    filters.every((filter) => matchesMockFilter(row, filter)) &&
    matchesMockSearch(row, search)
  );
}
