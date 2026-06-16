'use client';

import { useState, useTransition } from 'react';
import { TOAST_DASHBOARD_MESSAGES, toast } from '@/components/core/toasts';
import {
  markReprocessingAction,
  unmarkReprocessingAction
} from '@/modules/reprocessing/data/actions';
import type { IReprocessingMarkPayload } from '@/modules/reprocessing/data/models/Reprocessing';

type UsePreviewReprocessingParams = {
  contributorId: string;
  cuit: string;
  initialIsReprocessing: boolean;
  shouldHydrateOnMount?: boolean;
  openReprocessingModal: () => void;
};

export function usePreviewReprocessing({
  contributorId,
  cuit,
  initialIsReprocessing,
  shouldHydrateOnMount = false,
  openReprocessingModal
}: UsePreviewReprocessingParams) {
  const [reprocessingActionError, setReprocessingActionError] = useState<
    string | null
  >(null);
  const [isReprocessingMarked, setIsReprocessingMarked] = useState(
    initialIsReprocessing
  );
  const [isReprocessingHydrating, setIsReprocessingHydrating] = useState(
    shouldHydrateOnMount
  );
  const [isReprocessingTogglePending, startReprocessingToggleTransition] =
    useTransition();

  const clearReprocessingError = () => {
    setReprocessingActionError(null);
  };

  const hydrateReprocessingState = (nextIsReprocessingMarked: boolean) => {
    setIsReprocessingMarked(nextIsReprocessingMarked);
    setIsReprocessingHydrating(false);
  };

  const toggleReprocessing = () => {
    clearReprocessingError();

    if (!isReprocessingMarked) {
      openReprocessingModal();
      return;
    }

    startReprocessingToggleTransition(() => {
      void unmarkContributor();
    });
  };

  const confirmReprocessing = async (payload: IReprocessingMarkPayload) => {
    clearReprocessingError();
    const reprocessingPayload: IReprocessingMarkPayload = {
      contribuyenteId: contributorId,
      description: payload.description?.trim() || null
    };

    console.log({
      action: 'vista-previa-padron.markReprocessing',
      cuitMostrado: cuit,
      contribuyenteIdEnviado: reprocessingPayload.contribuyenteId
    });

    const result = await markReprocessingAction(reprocessingPayload);

    if (!result.success) {
      const errorMessage =
        result.error ?? 'No fue posible marcar el CUIT en reproceso.';
      setReprocessingActionError(errorMessage);
      throw new Error(errorMessage);
    }

    setIsReprocessingMarked(true);
    toast.show(TOAST_DASHBOARD_MESSAGES.SEND_REPROCESSING_ERROR);
  };

  const unmarkContributor = async () => {
    const result = await unmarkReprocessingAction(contributorId);

    if (!result.success) {
      setReprocessingActionError(
        result.error ?? 'No fue posible quitar el CUIT de reproceso.'
      );
      return;
    }

    setIsReprocessingMarked(false);
    toast.show(TOAST_DASHBOARD_MESSAGES.REMOVE_REPROCESSING_SUCCESS);
  };

  return {
    reprocessingActionError,
    isReprocessingMarked,
    isReprocessingHydrating,
    isReprocessingTogglePending,
    clearReprocessingError,
    hydrateReprocessingState,
    toggleReprocessing,
    confirmReprocessing
  };
}
