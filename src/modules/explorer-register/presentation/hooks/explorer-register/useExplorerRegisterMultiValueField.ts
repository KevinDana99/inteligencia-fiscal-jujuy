'use client';

import { useDisclosure } from '@mantine/hooks';
import { useMemo, useState } from 'react';
import {
  filterExplorerRegisterOptionData,
  type IExplorerRegisterFilterOptionData
} from '../../utils';

interface UseExplorerRegisterMultiValueFieldParams {
  disabled: boolean;
  options: IExplorerRegisterFilterOptionData[];
  values: string[];
  onChange: (values: string[]) => void;
}

export function useExplorerRegisterMultiValueField({
  disabled,
  options,
  values,
  onChange
}: UseExplorerRegisterMultiValueFieldParams) {
  const allowsCustomValues = options.length === 0;
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, { close: closeDropdown, open: openDropdown }] =
    useDisclosure(false);
  const allowedOptionValues = useMemo(
    () => new Set(options.map((option) => option.value.toUpperCase())),
    [options]
  );
  const filteredOptions = useMemo(
    () =>
      filterExplorerRegisterOptionData(options, values, searchValue).slice(
        0,
        8
      ),
    [options, searchValue, values]
  );
  const optionLabels = useMemo(
    () => new Map(options.map((option) => [option.value, option.label])),
    [options]
  );

  function addValue(value: string) {
    const nextValue = value.trim();

    if (!nextValue || disabled || values.includes(nextValue)) {
      return;
    }

    onChange([...values, nextValue]);
    setSearchValue('');
    closeDropdown();
  }

  function addSearchValue() {
    if (filteredOptions.length > 0) {
      addValue(filteredOptions[0].value);
      return;
    }

    if (allowsCustomValues) {
      addValue(searchValue);
    }
  }

  function removeValue(value: string) {
    onChange(values.filter((selectedValue) => selectedValue !== value));
  }

  function handleInputFocus() {
    if (options.length > 0) {
      openDropdown();
    }
  }

  function handleInputBlur() {
    closeDropdown();
  }

  function handleInputChange(nextValue: string) {
    if (!allowsCustomValues) {
      const normalizedValue = nextValue.trim().toUpperCase();

      if (!normalizedValue) {
        setSearchValue('');
        if (options.length > 0) {
          openDropdown();
        }
        return;
      }

      if (!allowedOptionValues.has(normalizedValue)) {
        return;
      }

      setSearchValue(normalizedValue);
      if (options.length > 0) {
        openDropdown();
      }
      return;
    }

    setSearchValue(nextValue);
    if (options.length > 0) {
      openDropdown();
    }
  }

  function handleInputKeyDown(key: string) {
    if (key !== 'Enter') {
      return false;
    }

    addSearchValue();
    return true;
  }

  return {
    filteredOptions,
    isOpen,
    optionLabels,
    searchValue,
    handleInputBlur,
    handleInputChange,
    handleInputFocus,
    handleInputKeyDown,
    addValue,
    removeValue
  };
}
