'use client';

import { useCallback, useEffect, useState } from 'react';
import { getContributorCrossesAction } from '../../../data/actions';
import type { IUnifiedRegisterDetail } from '../../../data/models/UnifiedRegister';
import {
  DEFAULT_SELECTED_INFORME_CROSS_IDS,
  INFORME_CROSS_OPTIONS,
  type InformeCrossOption
} from '../../constants/informeGeneration';
import { mapContributorCrossesToInformeOptions } from '../../utils/buildInformeGenerationPayload';
import { getDefaultSelectedCrossIds } from './utils';

export function useInformeCrosses(
  item: IUnifiedRegisterDetail,
  shouldLoadCrosses: boolean
) {
  const [availableCrosses, setAvailableCrosses] =
    useState<InformeCrossOption[]>(INFORME_CROSS_OPTIONS);
  const [selectedCrossIds, setSelectedCrossIds] = useState<string[]>(
    DEFAULT_SELECTED_INFORME_CROSS_IDS
  );
  const [crossesError, setCrossesError] = useState<string | null>(null);
  const [loadedCrossesContributorId, setLoadedCrossesContributorId] =
    useState<string | null>(null);
  const isLoadingCrosses =
    shouldLoadCrosses && loadedCrossesContributorId !== item.contribuyenteId;

  const applyCrosses = useCallback(
    (nextCrosses: InformeCrossOption[]) => {
      setAvailableCrosses(nextCrosses);
      setSelectedCrossIds((current) => resolveSelectedCrosses(current, nextCrosses));
      setCrossesError(null);
      setLoadedCrossesContributorId(item.contribuyenteId);
    },
    [item.contribuyenteId]
  );

  const setEmptyCrosses = useCallback(
    (error?: string) => {
      setAvailableCrosses([]);
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

  const resetSelectedCrosses = () => {
    setSelectedCrossIds(getDefaultSelectedCrossIds(availableCrosses));
  };

  return {
    availableCrosses,
    crossesError,
    isLoadingCrosses,
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
