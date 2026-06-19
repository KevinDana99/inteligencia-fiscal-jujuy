import { BATCH_MANAGEMENT_AVAILABLE_LOTS_DROPDOWN_TEXTS } from '../../constants/batchManagementAvailableLotsDropdown';

export type BatchManagementAvailableLotOption = {
  id: string;
  label: string;
  cuitCount: number;
};

type UseBatchManagementAvailableLotsDropdownParams = {
  opened: boolean;
  options: BatchManagementAvailableLotOption[];
  isPending: boolean;
  error: string | null;
};

export function useBatchManagementAvailableLotsDropdown({
  opened,
  options,
  isPending,
  error
}: UseBatchManagementAvailableLotsDropdownParams) {
  if (!opened) {
    return {
      shouldRender: false,
      stateMessage: null,
      hasError: false
    };
  }

  if (error) {
    return {
      shouldRender: true,
      stateMessage: error,
      hasError: true
    };
  }

  if (options.length === 0) {
    return {
      shouldRender: true,
      stateMessage: isPending
        ? BATCH_MANAGEMENT_AVAILABLE_LOTS_DROPDOWN_TEXTS.loadingState
        : BATCH_MANAGEMENT_AVAILABLE_LOTS_DROPDOWN_TEXTS.emptyState,
      hasError: false
    };
  }

  return {
    shouldRender: true,
    stateMessage: null,
    hasError: false
  };
}
