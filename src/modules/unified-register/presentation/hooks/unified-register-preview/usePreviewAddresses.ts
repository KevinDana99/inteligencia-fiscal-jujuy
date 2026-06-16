'use client';

import { useState, useTransition } from 'react';
import { TOAST_DASHBOARD_MESSAGES, toast } from '@/components/core/toasts';
import {
  createAlternateAddressAction,
  deleteAlternateAddressAction,
  updateAlternateAddressAction
} from '../../../data/actions';
import { mapAlternateAddressRecordToViewModel } from '../../../data/mappers/mapAlternateAddress';
import type { IUnifiedRegisterAddress } from '../../../data/models/UnifiedRegister';

type UsePreviewAddressesParams = {
  contributorId: string;
  initialAddresses: IUnifiedRegisterAddress[];
  shouldHydrateOnMount?: boolean;
};

export function usePreviewAddresses({
  contributorId,
  initialAddresses,
  shouldHydrateOnMount = false
}: UsePreviewAddressesParams) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isAddressesHydrating, setIsAddressesHydrating] =
    useState(shouldHydrateOnMount);
  const [addressActionError, setAddressActionError] = useState<string | null>(
    null
  );
  const [isAddressSavePending, startAddressSaveTransition] = useTransition();
  const [isAddressDeletePending, startAddressDeleteTransition] = useTransition();

  const clearAddressError = () => {
    setAddressActionError(null);
  };

  const hydrateAddresses = (
    nextAddresses: IUnifiedRegisterAddress[],
    error?: string | null
  ) => {
    setAddresses(nextAddresses);
    setAddressActionError(error ?? null);
    setIsAddressesHydrating(false);
  };

  const saveAddress = (
    editingItemId: string | null,
    address: string,
    onSuccess: () => void
  ) => {
    const normalizedAddress = address.trim();

    if (!normalizedAddress) {
      return;
    }

    clearAddressError();
    startAddressSaveTransition(async () => {
      const result = editingItemId
        ? await updateAlternateAddressAction(contributorId, editingItemId, {
            direccion: normalizedAddress
          })
        : await createAlternateAddressAction(contributorId, {
            direccion: normalizedAddress
          });

      if (!result.success || !result.data) {
        setAddressActionError(
          result.error ?? 'No fue posible guardar el domicilio alternativo.'
        );
        return;
      }

      const nextAddress = mapAlternateAddressRecordToViewModel(result.data);
      setAddresses((current) =>
        editingItemId
          ? current.map((entry) => (entry.id === editingItemId ? nextAddress : entry))
          : [...current, nextAddress]
      );
      toast.show(
        editingItemId
          ? TOAST_DASHBOARD_MESSAGES.UPDATE_ADDRESS_SUCCESS
          : TOAST_DASHBOARD_MESSAGES.ADD_ADDRESS_SUCCESS
      );
      onSuccess();
    });
  };

  const deleteAddress = (addressId: string, onSuccess: () => void) => {
    clearAddressError();
    startAddressDeleteTransition(async () => {
      const result = await deleteAlternateAddressAction(contributorId, addressId);

      if (!result.success) {
        setAddressActionError(
          result.error ?? 'No fue posible eliminar el domicilio alternativo.'
        );
        return;
      }

      setAddresses((current) => current.filter((entry) => entry.id !== addressId));
      toast.show(TOAST_DASHBOARD_MESSAGES.DELETE_ADDRESS_ERROR);
      onSuccess();
    });
  };

  return {
    addresses,
    addressActionError,
    isAddressesHydrating,
    isAddressSavePending,
    isAddressDeletePending,
    clearAddressError,
    hydrateAddresses,
    saveAddress,
    deleteAddress
  };
}
