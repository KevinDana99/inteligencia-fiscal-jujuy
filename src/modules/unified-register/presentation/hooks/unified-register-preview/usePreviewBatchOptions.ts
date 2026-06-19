'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { TOAST_DASHBOARD_MESSAGES, toast } from '@/components/core/toasts';
import type {
  IUnifiedRegisterBatchOption,
  IUnifiedRegisterDetail
} from '../../../data/models/UnifiedRegister';
import { addContributorToLot, getLotOptions } from './batchOperations';
import { BATCH_OPTIONS_SEARCH_DEBOUNCE_MS } from './constants';
import type { HeaderModal } from './types';
import { filterLotOptions } from './utils';

type UsePreviewBatchOptionsParams = {
  item: IUnifiedRegisterDetail;
  activeHeaderModal: HeaderModal;
  setActiveHeaderModal: (modal: HeaderModal) => void;
};

export function usePreviewBatchOptions({
  item,
  activeHeaderModal,
  setActiveHeaderModal
}: UsePreviewBatchOptionsParams) {
  const [batchSearch, setBatchSearch] = useState('');
  const [lotOptions, setLotOptions] = useState<IUnifiedRegisterBatchOption[]>([]);
  const [batchOptionsError, setBatchOptionsError] = useState<string | null>(null);
  const [addToBatchError, setAddToBatchError] = useState<string | null>(null);
  const [selectedLotOption, setSelectedLotOption] =
    useState<IUnifiedRegisterBatchOption | null>(null);
  const [isBatchOptionsPending, startBatchOptionsTransition] = useTransition();
  const [isAddToBatchPending, startAddToBatchTransition] = useTransition();
  const latestRequestIdRef = useRef(0);

  const filteredLotOptions = useMemo(
    () => filterLotOptions(lotOptions, batchSearch),
    [batchSearch, lotOptions]
  );

  useEffect(() => {
    if (activeHeaderModal !== 'batch') {
      return;
    }

    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;
    const timeoutId = setTimeout(() => {
      startBatchOptionsTransition(() => {
        void (async () => {
          const result = await getLotOptions(batchSearch);
          if (latestRequestIdRef.current !== requestId) {
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
    }, batchSearch.trim() ? BATCH_OPTIONS_SEARCH_DEBOUNCE_MS : 0);

    return () => clearTimeout(timeoutId);
  }, [activeHeaderModal, batchSearch]);

  const clearBatchErrors = () => {
    setBatchOptionsError(null);
    setAddToBatchError(null);
  };

  const resetBatchSearch = () => {
    setBatchSearch('');
  };

  const resetBatchOptions = () => {
    latestRequestIdRef.current += 1;
    setLotOptions([]);
    setBatchOptionsError(null);
    setAddToBatchError(null);
  };

  const selectLotOption = (lot: IUnifiedRegisterBatchOption) => {
    setSelectedLotOption(lot);
    setActiveHeaderModal(null);
    setBatchSearch('');
  };

  const closeLotConfirmModal = () => {
    if (isAddToBatchPending) {
      return;
    }

    setSelectedLotOption(null);
    setAddToBatchError(null);
  };

  const confirmLotSelection = () => {
    if (!selectedLotOption || isAddToBatchPending) {
      return;
    }

    const lotOption = selectedLotOption;
    setAddToBatchError(null);
    startAddToBatchTransition(() => {
      void addToLot(lotOption);
    });
  };

  async function addToLot(lotOption: IUnifiedRegisterBatchOption) {
    const result = await addContributorToLot(item, lotOption);

    if (!result.success) {
      setAddToBatchError(result.error ?? 'No fue posible agregar el CUIT al lote.');
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
  }

  return {
    batchSearch,
    filteredLotOptions,
    batchOptionsError,
    addToBatchError,
    selectedLotOption,
    isBatchOptionsPending,
    isAddToBatchPending,
    setBatchSearch,
    clearBatchErrors,
    resetBatchSearch,
    resetBatchOptions,
    selectLotOption,
    closeLotConfirmModal,
    confirmLotSelection
  };
}
