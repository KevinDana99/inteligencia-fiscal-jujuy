'use client';

import { Text, TextInput } from '@mantine/core';
import { BATCH_MANAGEMENT_AVAILABLE_LOTS_DROPDOWN_TEXTS } from '../../constants/batchManagementAvailableLotsDropdown';
import {
  useBatchManagementAvailableLotsDropdown,
  type BatchManagementAvailableLotOption
} from '../../hooks/batch-management/useBatchManagementAvailableLotsDropdown';
import classes from './BatchManagementAvailableLotsDropdown.module.css';

type BatchManagementAvailableLotsDropdownProps<
  TLot extends BatchManagementAvailableLotOption
> = {
  opened: boolean;
  search: string;
  options: TLot[];
  isPending: boolean;
  error: string | null;
  onClose: () => void;
  onSearchChange: (value: string) => void;
  onSelect: (lot: TLot) => void;
};

export function BatchManagementAvailableLotsDropdown<
  TLot extends BatchManagementAvailableLotOption
>({
  opened,
  search,
  options,
  isPending,
  error,
  onClose,
  onSearchChange,
  onSelect
}: BatchManagementAvailableLotsDropdownProps<TLot>) {
  const dropdown = useBatchManagementAvailableLotsDropdown({
    opened,
    options,
    isPending,
    error
  });

  if (!dropdown.shouldRender) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label={BATCH_MANAGEMENT_AVAILABLE_LOTS_DROPDOWN_TEXTS.closeAriaLabel}
        className={classes.backdrop}
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      />
      <div className={classes.dropdown} onClick={(event) => event.stopPropagation()}>
        <TextInput
          classNames={{ input: classes.input }}
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder={BATCH_MANAGEMENT_AVAILABLE_LOTS_DROPDOWN_TEXTS.searchPlaceholder}
        />
        <div className={classes.list}>
          {dropdown.stateMessage ? (
            <Text
              className={`${classes.state} ${
                dropdown.hasError ? classes.error : ''
              }`}
            >
              {dropdown.stateMessage}
            </Text>
          ) : (
            options.map((lot) => (
              <button
                key={lot.id}
                type="button"
                className={classes.option}
                onClick={() => onSelect(lot)}
              >
                <Text className={classes.optionTitle}>{lot.label}</Text>
                <Text className={classes.optionMeta}>
                  {lot.cuitCount} {BATCH_MANAGEMENT_AVAILABLE_LOTS_DROPDOWN_TEXTS.cuitCountSuffix}
                </Text>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
