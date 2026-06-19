'use client';

import { useCallback, useState, useTransition } from 'react';
import type { IBatchAvailableCrosses } from '@/modules/batch-management/data/models/BatchManagement';
import { useBatchManagementCrossFilters } from '@/modules/batch-management/presentation/hooks/batch-management/useBatchManagementCrossFilters';
import {
  buildBatchCrossExecutionPayloads,
  getBatchCrossValidationMessage,
  getEmptyExecutableBatchCrossMessage,
  hasExecutableBatchCrosses
} from '@/modules/batch-management/presentation/utils';
import { executePreviewCrossPayloads } from './crossOperations';

type UsePreviewCrossesParams = {
  contributorId: string;
  initialAvailableCrosses: IBatchAvailableCrosses;
  shouldHydrateOnMount?: boolean;
  onConfirmed: () => void;
};

export function usePreviewCrosses({
  contributorId,
  initialAvailableCrosses,
  shouldHydrateOnMount = false,
  onConfirmed
}: UsePreviewCrossesParams) {
  const crossFilters = useBatchManagementCrossFilters();
  const [availableCrosses, setAvailableCrosses] = useState(initialAvailableCrosses);
  const [isAvailableCrossesHydrating, setIsAvailableCrossesHydrating] =
    useState(shouldHydrateOnMount);
  const [crossExecutionError, setCrossExecutionError] = useState<string | null>(
    null
  );
  const [isCrossExecutionPending, startCrossExecutionTransition] =
    useTransition();
  const currentCrossFilters = crossFilters.getBatchCrossFilters(contributorId);
  const crossValidationMessage =
    getBatchCrossValidationMessage(currentCrossFilters);
  const canConfirmCrosses =
    !isAvailableCrossesHydrating &&
    hasExecutableBatchCrosses(contributorId, currentCrossFilters, availableCrosses) &&
    !crossValidationMessage &&
    !isCrossExecutionPending;

  const hydrateAvailableCrosses = useCallback((
    nextAvailableCrosses: IBatchAvailableCrosses
  ) => {
    setAvailableCrosses(nextAvailableCrosses);
    setIsAvailableCrossesHydrating(false);
  }, []);

  const clearCrossExecutionError = () => {
    setCrossExecutionError(null);
  };

  const toggleCrossSection = (section: 'monthly' | 'annual') => {
    clearCrossExecutionError();
    crossFilters.toggleBatchCrossSection(contributorId, section);
  };

  const setCrossYear = (
    section: 'monthly' | 'annual',
    field: 'fromYear' | 'toYear',
    value: string | null
  ) => {
    clearCrossExecutionError();
    crossFilters.setBatchCrossYear(contributorId, section, field, value);
  };

  const setCrossMonth = (
    field: 'fromMonth' | 'toMonth',
    value: string | null
  ) => {
    clearCrossExecutionError();
    crossFilters.setBatchCrossMonth(contributorId, field, value);
  };

  const toggleCrossType = (
    section: 'monthly' | 'annual',
    crossType: string
  ) => {
    clearCrossExecutionError();
    crossFilters.toggleBatchCrossType(contributorId, section, crossType);
  };

  const confirmCrossExecution = async () => {
    console.log(
      JSON.stringify(
        {
          action: 'usePreviewCrosses.confirmCrossExecution',
          contributorId,
          crossValidationMessage,
          canConfirmCrosses,
          currentCrossFilters,
          availableCrosses
        },
        null,
        2
      )
    )

    if (crossValidationMessage) {
      setCrossExecutionError(crossValidationMessage);
      return false;
    }

    const payloads = buildBatchCrossExecutionPayloads(
      contributorId,
      currentCrossFilters,
      availableCrosses
    );

    if (!payloads.length) {
      console.log(
        JSON.stringify(
          {
            action: 'usePreviewCrosses.confirmCrossExecution',
            contributorId,
            payloads
          },
          null,
          2
        )
      )
      setCrossExecutionError(getEmptyExecutableBatchCrossMessage(availableCrosses));
      return false;
    }

    console.log(
      JSON.stringify(
        {
          action: 'usePreviewCrosses.confirmCrossExecution',
          contributorId,
          payloads
        },
        null,
        2
      )
    )

    clearCrossExecutionError();
    return await new Promise<boolean>((resolve) => {
      startCrossExecutionTransition(() => {
        void executePayloads(payloads, resolve);
      });
    });
  };

  const executePayloads = async (
    payloads: ReturnType<typeof buildBatchCrossExecutionPayloads>,
    resolve: (value: boolean) => void
  ) => {
    const results = await executePreviewCrossPayloads(contributorId, payloads);
    const failedResult = results.find((result) => !result.success || !result.data);

    if (failedResult) {
      setCrossExecutionError(
        failedResult.error ?? 'No fue posible ejecutar el cruce.'
      );
      resolve(false);
      return;
    }

    onConfirmed();
    resolve(true);
  };

  return {
    availableCrosses,
    isAvailableCrossesHydrating,
    crossFilters: currentCrossFilters,
    crossValidationMessage,
    crossExecutionError,
    canConfirmCrosses,
    isCrossExecutionPending,
    hydrateAvailableCrosses,
    clearCrossExecutionError,
    toggleCrossSection,
    setCrossYear,
    setCrossMonth,
    toggleCrossType,
    confirmCrossExecution
  };
}
