"use client";

import { useTransition } from "react";
import { unmarkReprocessingAction } from "../../data/actions";
import type { IReprocessingItem } from "../../data/models/Reprocessing";
import { toast, TOAST_DASHBOARD_MESSAGES } from "@/components/core/toasts";

interface UseReprocessingRemoveModalParams {
  pendingRemovalItem: IReprocessingItem | null;
  setPendingRemovalItem: (item: IReprocessingItem | null) => void;
  onRemoved: (itemId: string) => void;
}

export function useReprocessingRemoveModal({
  pendingRemovalItem,
  setPendingRemovalItem,
  onRemoved,
}: UseReprocessingRemoveModalParams) {
  const [isRemovePending, startRemoveTransition] = useTransition();

  const closeRemoveModal = () => {
    setPendingRemovalItem(null);
  };

  const confirmRemoveFromReprocessing = () => {
    if (!pendingRemovalItem) {
      return;
    }

    startRemoveTransition(() => {
      void (async () => {
        const result = await unmarkReprocessingAction(
          pendingRemovalItem.contribuyenteId
        );

        if (!result.success) {
          return;
        }

        onRemoved(pendingRemovalItem.id);
        toast.show(TOAST_DASHBOARD_MESSAGES.REMOVE_REPROCESSING_SUCCESS);
        setPendingRemovalItem(null);
      })();
    });
  };

  return {
    isRemovePending,
    closeRemoveModal,
    confirmRemoveFromReprocessing,
  };
}
