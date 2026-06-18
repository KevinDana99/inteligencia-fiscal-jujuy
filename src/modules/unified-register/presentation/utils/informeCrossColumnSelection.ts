import type {
  InformeCrossOption,
  InformeCrossPreviewColumn
} from '../constants/informeGeneration';

export type InformeCrossColumnSelectionMap = Record<string, string[]>;

export function getInformeCrossColumnsByKeys(
  cross: InformeCrossOption,
  columnKeys: string[] = cross.columnasSeleccionadas.claves
): InformeCrossPreviewColumn[] {
  const columnsByKey = new Map(
    cross.previewColumns.map((column) => [column.key, column])
  );

  return columnKeys.flatMap((columnKey) => {
    const column = columnsByKey.get(columnKey);
    return column ? [column] : [];
  });
}

export function getAvailableInformeCrossColumns(
  cross: InformeCrossOption,
  selectedColumnKeys: string[]
): InformeCrossPreviewColumn[] {
  const selectedColumns = new Set(selectedColumnKeys);

  return cross.previewColumns.filter(
    (column) => !selectedColumns.has(column.key)
  );
}

export function applyInformeCrossColumnSelection(
  cross: InformeCrossOption,
  selectedColumnKeys: string[]
): InformeCrossOption {
  const availableColumnKeys = new Set(
    cross.previewColumns.map((column) => column.key)
  );
  const validColumnKeys = selectedColumnKeys.filter((columnKey) =>
    availableColumnKeys.has(columnKey)
  );

  return {
    ...cross,
    columnasSeleccionadas: {
      ...cross.columnasSeleccionadas,
      claves: validColumnKeys
    }
  };
}

export function applyInformeCrossColumnSelections(
  crosses: InformeCrossOption[],
  selectedColumnKeysByCrossId: InformeCrossColumnSelectionMap
): InformeCrossOption[] {
  return crosses.map((cross) => {
    const selectedColumnKeys = selectedColumnKeysByCrossId[cross.id];

    if (!selectedColumnKeys) {
      return cross;
    }

    return applyInformeCrossColumnSelection(cross, selectedColumnKeys);
  });
}
