import type {
  IExplorerRegisterExploreFilter,
  IExplorerRegisterRow
} from '../models/ExplorerRegister';

function normalizeMockValue(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
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

export function filterExplorerRegisterMockRows(
  rows: IExplorerRegisterRow[],
  filters: IExplorerRegisterExploreFilter[]
) {
  if (filters.length === 0) {
    return rows;
  }

  return rows.filter((row) =>
    filters.every((filter) => matchesMockFilter(row, filter))
  );
}
