'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { TOAST_DASHBOARD_MESSAGES, toast } from '@/components/core/toasts';
import { markReprocessingAction } from '@/modules/reprocessing/data/actions';
import type { IReprocessingMarkPayload } from '@/modules/reprocessing/data/models/Reprocessing';
import type {
  IUnifiedRegisterBatchOption,
  IUnifiedRegisterItem
} from '../../../data/models/UnifiedRegister';
import { addContributorToLot, getLotOptions } from '../unified-register-preview/batchOperations';
import { BATCH_OPTIONS_SEARCH_DEBOUNCE_MS } from '../unified-register-preview/constants';
import { filterLotOptions } from '../unified-register-preview/utils';

export function useUnifiedRegisterPageActions() {
  const [selectedReprocessingItem, setSelectedReprocessingItem] =
    useState<IUnifiedRegisterItem | null>(null);
  const [selectedBatchItem, setSelectedBatchItem] =
    useState<IUnifiedRegisterItem | null>(null);
  const [pendingBatchContributor, setPendingBatchContributor] =
    useState<IUnifiedRegisterItem | null>(null);
  const [selectedLotOption, setSelectedLotOption] =
    useState<IUnifiedRegisterBatchOption | null>(null);
  const [reprocessingActionError, setReprocessingActionError] = useState<
    string | null
  >(null);
  const [batchOptionsError, setBatchOptionsError] = useState<string | null>(
    null
  );
  const [addToBatchError, setAddToBatchError] = useState<string | null>(null);
  const [batchSearch, setBatchSearch] = useState('');
  const [lotOptions, setLotOptions] = useState<IUnifiedRegisterBatchOption[]>(
    []
  );
  const [isReprocessingPending, startReprocessingTransition] =
    useTransition();
  const [isBatchOptionsPending, startBatchOptionsTransition] = useTransition();
  const [isAddToBatchPending, startAddToBatchTransition] = useTransition();
  const latestBatchOptionsRequestIdRef = useRef(0);

  const filteredLotOptions = useMemo(() => {
    return filterLotOptions(lotOptions, batchSearch);
  }, [batchSearch, lotOptions]);

  useEffect(() => {
    if (!selectedBatchItem) {
      return;
    }

    const requestId = latestBatchOptionsRequestIdRef.current + 1;
    latestBatchOptionsRequestIdRef.current = requestId;

    const timeoutId = setTimeout(
      () => {
        startBatchOptionsTransition(() => {
          void (async () => {
            const result = await getLotOptions(batchSearch);

            if (latestBatchOptionsRequestIdRef.current !== requestId) {
              return;
            }

            if (!result.options) {
              setBatchOptionsError(result.error);
              return;
            }

            setLotOptions(result.options);
            setBatchOptionsError(null);
          })();
        });
      },
      batchSearch.trim() ? BATCH_OPTIONS_SEARCH_DEBOUNCE_MS : 0
    );

    return () => {
      clearTimeout(timeoutId);
    };
  }, [selectedBatchItem, batchSearch]);

  function openReprocessingModal(item: IUnifiedRegisterItem) {
    setReprocessingActionError(null);
    setSelectedReprocessingItem(item);
  }

  function closeReprocessingModal() {
    if (isReprocessingPending) {
      return;
    }

    setSelectedReprocessingItem(null);
    setReprocessingActionError(null);
  }

  function openBatchModal(item: IUnifiedRegisterItem) {
    setSelectedBatchItem(item);
    setPendingBatchContributor(null);
    setSelectedLotOption(null);
    setBatchSearch('');
    setLotOptions([]);
    setBatchOptionsError(null);
    setAddToBatchError(null);
  }

  function closeBatchModal() {
    if (isBatchOptionsPending) {
      return;
    }

    setSelectedBatchItem(null);
  }

  function selectLotOption(lot: IUnifiedRegisterBatchOption) {
    if (!selectedBatchItem) {
      return;
    }

    setPendingBatchContributor(selectedBatchItem);
    setSelectedLotOption(lot);
    setSelectedBatchItem(null);
    setBatchSearch('');
  }

  function closeLotConfirmModal() {
    if (isAddToBatchPending) {
      return;
    }

    setSelectedLotOption(null);
    setSelectedBatchItem(null);
    setPendingBatchContributor(null);
    setAddToBatchError(null);
  }

  const confirmReprocessing = async (payload: IReprocessingMarkPayload) => {
    if (!selectedReprocessingItem) {
      return;
    }

    setReprocessingActionError(null);

    return await new Promise<void>((resolve, reject) => {
      startReprocessingTransition(() => {
        void (async () => {
          const result = await markReprocessingAction({
            contribuyenteId: selectedReprocessingItem.contribuyenteId,
            description: payload.description?.trim() || null
          });

          if (!result.success) {
            const errorMessage =
              result.error ?? 'No fue posible marcar el CUIT en reproceso.';

            setReprocessingActionError(errorMessage);
            reject(new Error(errorMessage));
            return;
          }

          toast.show(TOAST_DASHBOARD_MESSAGES.SEND_REPROCESSING_ERROR);
          setSelectedReprocessingItem(null);
          resolve();
        })();
      });
    });
  };

  function confirmLotSelection() {
    if (!selectedLotOption || !pendingBatchContributor || isAddToBatchPending) {
      return;
    }

    const lotOption = selectedLotOption;
    const batchItem = pendingBatchContributor;

    setAddToBatchError(null);

    startAddToBatchTransition(() => {
      void (async () => {
        const result = await addContributorToLot(batchItem, lotOption);

        if (!result.success) {
          setAddToBatchError(
            result.error ?? 'No fue posible agregar el CUIT al lote.'
          );
          return;
        }

        setLotOptions((current) =>
          current.map((option) =>
            option.id === lotOption.id
              ? { ...option, cuitCount: option.cuitCount + 1 }
              : option
          )
        );
        toast.show(TOAST_DASHBOARD_MESSAGES.ADD_TO_BATCH_SUCCESS, {
          name: lotOption.label
        });
        setSelectedLotOption(null);
        setSelectedBatchItem(null);
        setPendingBatchContributor(null);
      })();
    });
  }

  return {
    selectedReprocessingItem,
    selectedBatchItem,
    selectedLotOption,
    reprocessingActionError,
    batchOptionsError,
    addToBatchError,
    batchSearch,
    filteredLotOptions,
    isReprocessingPending,
    isBatchOptionsPending,
    isAddToBatchPending,
    setBatchSearch,
    openReprocessingModal,
    closeReprocessingModal,
    openBatchModal,
    closeBatchModal,
    selectLotOption,
    closeLotConfirmModal,
    confirmReprocessing,
    confirmLotSelection
  };
}
