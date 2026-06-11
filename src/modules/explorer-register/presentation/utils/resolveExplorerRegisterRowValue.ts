import type {
  ExplorerRegisterCellValue,
  IExplorerRegisterColumn,
  IExplorerRegisterRow
} from '../../data/models/ExplorerRegister';

export function resolveExplorerRegisterRowValue(
  row: IExplorerRegisterRow,
  column: IExplorerRegisterColumn
): ExplorerRegisterCellValue {
  if (column.code === 'cuit') {
    return row.cuit;
  }

  if (column.code === 'razonSocial') {
    return row.businessName;
  }

  return row.values[column.code] ?? null;
}

export function formatExplorerRegisterCellValue(
  value: ExplorerRegisterCellValue
) {
  return value === null || value === '' ? '-' : String(value);
}
