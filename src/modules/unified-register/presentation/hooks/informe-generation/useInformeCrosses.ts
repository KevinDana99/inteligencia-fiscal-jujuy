'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getContributorCrossColumnsAction,
  getContributorCrossesAction
} from '../../../data/actions';
import type { IUnifiedRegisterDetail } from '../../../data/models/UnifiedRegister';
import type { InformeCrossOption } from '../../constants/informeGeneration';
import { mapContributorCrossesToInformeOptions } from '../../utils/buildInformeGenerationPayload';
import {
  applyInformeCrossColumnSelections,
  getAvailableInformeCrossColumns,
  getInformeCrossColumnsByKeys,
  type InformeCrossColumnSelectionMap
} from '../../utils/informeCrossColumnSelection';

const DYNAMIC_CROSS_COLUMNS_LOAD_VERSION = 'dynamic-cross-columns-v1';

export function useInformeCrosses(
  item: IUnifiedRegisterDetail,
  shouldLoadCrosses: boolean
) {
  const [sourceCrosses, setSourceCrosses] = useState<InformeCrossOption[]>([]);
  const [selectedCrossIds, setSelectedCrossIds] = useState<string[]>([]);
  const [selectedColumnKeysByCrossId, setSelectedColumnKeysByCrossId] =
    useState<InformeCrossColumnSelectionMap>({});
  const [columnPickerCrossId, setColumnPickerCrossId] = useState<string | null>(
    null
  );
  const [columnPickerDraftKeys, setColumnPickerDraftKeys] = useState<string[]>(
    []
  );
  const [selectedAvailableColumnKeys, setSelectedAvailableColumnKeys] =
    useState<string[]>([]);
  const [selectedVisibleColumnKeys, setSelectedVisibleColumnKeys] = useState<
    string[]
  >([]);
  const [draggingDraftColumnKey, setDraggingDraftColumnKey] = useState<
    string | null
  >(null);
  const [dragOverDraftColumnKey, setDragOverDraftColumnKey] = useState<
    string | null
  >(null);
  const [crossesError, setCrossesError] = useState<string | null>(null);
  const [loadedCrossesKey, setLoadedCrossesKey] = useState<string | null>(null);
  const activeCrossesLoadKey = `${item.contribuyenteId}:${DYNAMIC_CROSS_COLUMNS_LOAD_VERSION}`;
  const isLoadingCrosses =
    shouldLoadCrosses && loadedCrossesKey !== activeCrossesLoadKey;
  const availableCrosses = useMemo(
    () =>
      applyInformeCrossColumnSelections(
        sourceCrosses,
        selectedColumnKeysByCrossId
      ),
    [selectedColumnKeysByCrossId, sourceCrosses]
  );
  const activeColumnPickerCross = useMemo(
    () =>
      availableCrosses.find((cross) => cross.id === columnPickerCrossId) ??
      null,
    [availableCrosses, columnPickerCrossId]
  );
  const columnPickerAvailableColumns = useMemo(
    () =>
      activeColumnPickerCross
        ? getAvailableInformeCrossColumns(
            activeColumnPickerCross,
            columnPickerDraftKeys
          )
        : [],
    [activeColumnPickerCross, columnPickerDraftKeys]
  );
  const columnPickerVisibleColumns = useMemo(
    () =>
      activeColumnPickerCross
        ? getInformeCrossColumnsByKeys(
            activeColumnPickerCross,
            columnPickerDraftKeys
          )
        : [],
    [activeColumnPickerCross, columnPickerDraftKeys]
  );

  const resetPickerSelection = useCallback(() => {
    setSelectedAvailableColumnKeys([]);
    setSelectedVisibleColumnKeys([]);
    setDraggingDraftColumnKey(null);
    setDragOverDraftColumnKey(null);
  }, []);

  const applyCrosses = useCallback(
    (nextCrosses: InformeCrossOption[]) => {
      setSourceCrosses(nextCrosses);
      setSelectedCrossIds((current) => resolveSelectedCrosses(current, nextCrosses));
      setCrossesError(null);
      setLoadedCrossesKey(activeCrossesLoadKey);
    },
    [activeCrossesLoadKey]
  );

  const setEmptyCrosses = useCallback(
    (error?: string) => {
      setSourceCrosses([]);
      setSelectedCrossIds([]);
      setCrossesError(error ?? 'No fue posible listar los cruces del contribuyente.');
      setLoadedCrossesKey(activeCrossesLoadKey);
    },
    [activeCrossesLoadKey]
  );

  useEffect(() => {
    if (!shouldLoadCrosses || loadedCrossesKey === activeCrossesLoadKey) {
      return;
    }

    let isActive = true;

    async function loadContributorCrosses() {
      const result = await getContributorCrossesAction(item.contribuyenteId);

      if (!isActive) return;
      if (!result.data) {
        setEmptyCrosses(result.error);
        return;
      }

      const crossesWithColumns = await Promise.all(
        result.data.crosses.map(async (cross) => {
          const columnsResult = await getContributorCrossColumnsAction({
            contribuyenteId: item.contribuyenteId,
            cruceId: cross.id
          });

          return {
            cross,
            columnsData: columnsResult.data,
            error: columnsResult.error
          };
        })
      );

      if (!isActive) return;
      applyCrosses(mapContributorCrossesToInformeOptions(crossesWithColumns));
    }

    loadContributorCrosses().catch(() => {
      if (isActive) setEmptyCrosses();
    });

    return () => {
      isActive = false;
    };
  }, [
    activeCrossesLoadKey,
    applyCrosses,
    item.contribuyenteId,
    loadedCrossesKey,
    setEmptyCrosses,
    shouldLoadCrosses
  ]);

  const toggleCrossSelection = (crossId: string) => {
    const cross = availableCrosses.find((option) => option.id === crossId);
    if (cross?.isReportReady === false) {
      return;
    }
    setSelectedCrossIds((current) =>
      current.includes(crossId)
        ? current.filter((selectedCrossId) => selectedCrossId !== crossId)
        : [...current, crossId]
    );
  };

  const openCrossColumnPicker = (crossId: string) => {
    const cross = availableCrosses.find((option) => option.id === crossId);

    if (!cross || cross.isReportReady === false) {
      return;
    }

    setColumnPickerCrossId(cross.id);
    setColumnPickerDraftKeys([...cross.columnasSeleccionadas.claves]);
    resetPickerSelection();
  };

  const closeCrossColumnPicker = () => {
    setColumnPickerCrossId(null);
    setColumnPickerDraftKeys([]);
    resetPickerSelection();
  };

  const selectAvailableColumn = (columnKey: string) => {
    setSelectedAvailableColumnKeys((current) =>
      toggleSelectedColumnKey(current, columnKey)
    );
    setSelectedVisibleColumnKeys([]);
  };

  const selectVisibleColumn = (columnKey: string) => {
    setSelectedVisibleColumnKeys((current) =>
      toggleSelectedColumnKey(current, columnKey)
    );
    setSelectedAvailableColumnKeys([]);
  };

  const addSelectedColumn = () => {
    if (selectedAvailableColumnKeys.length === 0) {
      return;
    }

    const selectedKeys = columnPickerAvailableColumns
      .filter((column) => selectedAvailableColumnKeys.includes(column.key))
      .map((column) => column.key);

    setColumnPickerDraftKeys((current) => {
      const currentKeys = new Set(current);
      return [
        ...current,
        ...selectedKeys.filter((columnKey) => !currentKeys.has(columnKey))
      ];
    });
    setSelectedAvailableColumnKeys([]);
  };

  const removeSelectedColumn = () => {
    if (selectedVisibleColumnKeys.length === 0) {
      return;
    }

    const selectedKeys = new Set(selectedVisibleColumnKeys);
    setColumnPickerDraftKeys((current) =>
      current.filter((columnKey) => !selectedKeys.has(columnKey))
    );
    setSelectedVisibleColumnKeys([]);
  };

  const reorderDraftColumn = (sourceColumnKey: string, targetColumnKey: string) => {
    setColumnPickerDraftKeys((current) =>
      reorderColumnKeys(current, sourceColumnKey, targetColumnKey)
    );
    setSelectedAvailableColumnKeys([]);
    setSelectedVisibleColumnKeys([sourceColumnKey]);
  };

  const confirmCrossColumnPicker = () => {
    if (!activeColumnPickerCross) {
      return;
    }

    setSelectedColumnKeysByCrossId((current) => ({
      ...current,
      [activeColumnPickerCross.id]: [...columnPickerDraftKeys]
    }));
    setSelectedCrossIds((current) => {
      const nextSelectedIds = current.filter(
        (crossId) => crossId !== activeColumnPickerCross.id
      );

      return columnPickerDraftKeys.length > 0
        ? [...nextSelectedIds, activeColumnPickerCross.id]
        : nextSelectedIds;
    });
    closeCrossColumnPicker();
  };

  const resetSelectedCrosses = () => {
    setSelectedCrossIds([]);
    setSelectedColumnKeysByCrossId({});
  };

  return {
    availableCrosses,
    crossColumnPicker: {
      activeCrossName: activeColumnPickerCross?.nombre ?? '',
      addSelectedColumn,
      availableColumns: columnPickerAvailableColumns,
      close: closeCrossColumnPicker,
      confirm: confirmCrossColumnPicker,
      dragOverDraftColumnKey,
      draggingDraftColumnKey,
      opened: Boolean(activeColumnPickerCross),
      removeSelectedColumn,
      reorderDraftColumn,
      selectAvailableColumn,
      selectVisibleColumn,
      selectedAvailableColumnKeys,
      selectedVisibleColumnKeys,
      setDragOverDraftColumnKey,
      setDraggingDraftColumnKey,
      visibleColumns: columnPickerVisibleColumns
    },
    crossesError,
    isLoadingCrosses,
    openCrossColumnPicker,
    selectedCrossIds,
    resetSelectedCrosses,
    toggleCrossSelection
  };
}

function resolveSelectedCrosses(
  current: string[],
  nextCrosses: InformeCrossOption[]
) {
  const availableIds = new Set(
    nextCrosses
      .filter((cross) => cross.isReportReady !== false)
      .map((cross) => cross.id)
  );
  const currentAvailableIds = current.filter((crossId) => availableIds.has(crossId));
  return currentAvailableIds;
}

function toggleSelectedColumnKey(currentKeys: string[], columnKey: string) {
  if (currentKeys.includes(columnKey)) {
    return currentKeys.filter((currentKey) => currentKey !== columnKey);
  }

  return [...currentKeys, columnKey];
}

function reorderColumnKeys(
  columnKeys: string[],
  sourceColumnKey: string,
  targetColumnKey: string
) {
  if (sourceColumnKey === targetColumnKey) {
    return columnKeys;
  }

  const sourceIndex = columnKeys.indexOf(sourceColumnKey);
  const targetIndex = columnKeys.indexOf(targetColumnKey);

  if (sourceIndex === -1 || targetIndex === -1) {
    return columnKeys;
  }

  const nextColumnKeys = [...columnKeys];
  const [sourceColumn] = nextColumnKeys.splice(sourceIndex, 1);
  nextColumnKeys.splice(targetIndex, 0, sourceColumn);

  return nextColumnKeys;
}
