import type { IExplorerRegisterRow } from '../../data/models/ExplorerRegister';

function normalizeLocalSearchText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeLocalSearchCuit(value: string) {
  return value.replace(/\D/g, '');
}

export function filterExplorerRegisterRowsByLocalSearch(
  rows: IExplorerRegisterRow[],
  searchValue: string
) {
  const normalizedSearchValue = normalizeLocalSearchText(searchValue);
  const normalizedSearchCuit = normalizeLocalSearchCuit(searchValue);

  if (!normalizedSearchValue && !normalizedSearchCuit) {
    return rows;
  }

  return rows.filter((row) => {
    const normalizedBusinessName = normalizeLocalSearchText(row.businessName);
    const normalizedRowCuit = normalizeLocalSearchCuit(row.cuit);
    const normalizedVisibleCuit = normalizeLocalSearchText(row.cuit);

    return (
      normalizedBusinessName.includes(normalizedSearchValue) ||
      normalizedVisibleCuit.includes(normalizedSearchValue) ||
      (Boolean(normalizedSearchCuit) &&
        normalizedRowCuit.includes(normalizedSearchCuit))
    );
  });
}
