'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getContributorCrossesAction } from '../../../data/actions';
import type { IUnifiedRegisterDetail } from '../../../data/models/UnifiedRegister';
import {
  DEFAULT_SELECTED_INFORME_CROSS_IDS,
  INFORME_CROSS_OPTIONS,
  type InformeCrossOption
} from '../../constants/informeGeneration';
import { mapContributorCrossesToInformeOptions } from '../../utils/buildInformeGenerationPayload';
import {
  applyInformeCrossColumnSelections,
  getAvailableInformeCrossColumns,
  getInformeCrossColumnsByKeys,
  type InformeCrossColumnSelectionMap
} from '../../utils/informeCrossColumnSelection';
import { getDefaultSelectedCrossIds } from './utils';

export function useInformeCrosses(
  item: IUnifiedRegisterDetail,
  shouldLoadCrosses: boolean
) {
  const [sourceCrosses, setSourceCrosses] =
    useState<InformeCrossOption[]>(INFORME_CROSS_OPTIONS);
  const [selectedCrossIds, setSelectedCrossIds] = useState<string[]>(
    DEFAULT_SELECTED_INFORME_CROSS_IDS
  );
  const [selectedColumnKeysByCrossId, setSelectedColumnKeysByCrossId] =
    useState<InformeCrossColumnSelectionMap>({});
  const [columnPickerCrossId, setColumnPickerCrossId] = useState<string | null>(
    null
  );
  const [columnPickerDraftKeys, setColumnPickerDraftKeys] = useState<string[]>(
    []
  );
  const [selectedAvailableColumnKey, setSelectedAvailableColumnKey] =
    useState<string | null>(null);
  const [selectedVisibleColumnKey, setSelectedVisibleColumnKey] =
    useState<string | null>(null);
  const [crossesError, setCrossesError] = useState<string | null>(null);
  const [loadedCrossesContributorId, setLoadedCrossesContributorId] =
    useState<string | null>(null);
  const isLoadingCrosses =
    shouldLoadCrosses && loadedCrossesContributorId !== item.contribuyenteId;
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
    setSelectedAvailableColumnKey(null);
    setSelectedVisibleColumnKey(null);
  }, []);

  const applyCrosses = useCallback(
    (nextCrosses: InformeCrossOption[]) => {
      setSourceCrosses(nextCrosses);
      setSelectedCrossIds((current) => resolveSelectedCrosses(current, nextCrosses));
      setCrossesError(null);
      setLoadedCrossesContributorId(item.contribuyenteId);
    },
    [item.contribuyenteId]
  );

  const setEmptyCrosses = useCallback(
    (error?: string) => {
      setSourceCrosses([]);
      setSelectedCrossIds([]);
      setCrossesError(error ?? 'No fue posible listar los cruces del contribuyente.');
      setLoadedCrossesContributorId(item.contribuyenteId);
    },
    [item.contribuyenteId]
  );

  useEffect(() => {
    if (!shouldLoadCrosses || loadedCrossesContributorId === item.contribuyenteId) {
      return;
    }

    let isActive = true;
    getContributorCrossesAction(item.contribuyenteId)
      .then((result) => {
        if (!isActive) return;
        if (!result.data) {
          setEmptyCrosses(result.error);
          return;
        }
        applyCrosses(mapContributorCrossesToInformeOptions(result.data.crosses));
      })
      .catch(() => {
        if (isActive) setEmptyCrosses();
      });

    return () => {
      isActive = false;
    };
  }, [
    applyCrosses,
    item.contribuyenteId,
    loadedCrossesContributorId,
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
    setSelectedAvailableColumnKey(columnKey);
    setSelectedVisibleColumnKey(null);
  };

  const selectVisibleColumn = (columnKey: string) => {
    setSelectedVisibleColumnKey(columnKey);
    setSelectedAvailableColumnKey(null);
  };

  const addSelectedColumn = () => {
    if (!selectedAvailableColumnKey) {
      return;
    }

    setColumnPickerDraftKeys((current) =>
      current.includes(selectedAvailableColumnKey)
        ? current
        : [...current, selectedAvailableColumnKey]
    );
    setSelectedAvailableColumnKey(null);
  };

  const removeSelectedColumn = () => {
    if (!selectedVisibleColumnKey) {
      return;
    }

    setColumnPickerDraftKeys((current) =>
      current.filter((columnKey) => columnKey !== selectedVisibleColumnKey)
    );
    setSelectedVisibleColumnKey(null);
  };

  const confirmCrossColumnPicker = () => {
    if (!activeColumnPickerCross) {
      return;
    }

    setSelectedColumnKeysByCrossId((current) => ({
      ...current,
      [activeColumnPickerCross.id]: [...columnPickerDraftKeys]
    }));
    closeCrossColumnPicker();
  };

  const resetSelectedCrosses = () => {
    setSelectedCrossIds(getDefaultSelectedCrossIds(availableCrosses));
  };

  return {
    availableCrosses,
    crossColumnPicker: {
      activeCrossName: activeColumnPickerCross?.nombre ?? '',
      addSelectedColumn,
      availableColumns: columnPickerAvailableColumns,
      close: closeCrossColumnPicker,
      confirm: confirmCrossColumnPicker,
      opened: Boolean(activeColumnPickerCross),
      removeSelectedColumn,
      selectAvailableColumn,
      selectVisibleColumn,
      selectedAvailableColumnKey,
      selectedVisibleColumnKey,
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
  return currentAvailableIds.length
    ? currentAvailableIds
    : getDefaultSelectedCrossIds(nextCrosses);
}
