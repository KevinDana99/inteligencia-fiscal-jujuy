'use client';

import { useMemo } from 'react';
import { Text, TextInput } from '@mantine/core';
import classes from './BatchManagementAvailableLotsDropdown.module.css';

type BatchManagementAvailableLotOption = {
  id: string;
  label: string;
  cuitCount: number;
};

type BatchManagementAvailableLotsDropdownAnchor = {
  bottom: number;
  right: number;
};

type BatchManagementAvailableLotsDropdownProps = {
  opened: boolean;
  search: string;
  options: BatchManagementAvailableLotOption[];
  isPending: boolean;
  error: string | null;
  onClose: () => void;
  onSearchChange: (value: string) => void;
  onSelect: (lot: BatchManagementAvailableLotOption) => void;
  mode?: 'inline-right' | 'fixed-anchor';
  anchor?: BatchManagementAvailableLotsDropdownAnchor | null;
};

export function BatchManagementAvailableLotsDropdown({
  opened,
  search,
  options,
  isPending,
  error,
  onClose,
  onSearchChange,
  onSelect,
  mode = 'inline-right',
  anchor = null
}: BatchManagementAvailableLotsDropdownProps) {
  const fixedStyle = useMemo(() => {
    if (mode !== 'fixed-anchor' || !anchor) {
      return undefined;
    }

    const viewportWidth =
      typeof window === 'undefined' ? anchor.right + 16 : window.innerWidth;

    return {
      top: anchor.bottom + 8,
      right: Math.max(16, viewportWidth - anchor.right)
    };
  }, [anchor, mode]);

  if (!opened) {
    return null;
  }

  if (mode === 'fixed-anchor' && !anchor) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar selector de lote"
        className={classes.backdrop}
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      />
      <div
        className={`${classes.dropdown} ${
          mode === 'fixed-anchor' ? classes.dropdownFixed : classes.dropdownInline
        }`}
        style={fixedStyle}
        onClick={(event) => event.stopPropagation()}
      >
        <TextInput
          classNames={{ input: classes.input }}
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder="Buscar lote..."
        />
        <div className={classes.list}>
          {error ? (
            <Text className={`${classes.state} ${classes.error}`}>{error}</Text>
          ) : options.length === 0 ? (
            <Text className={classes.state}>
              {isPending ? 'Cargando lotes...' : 'No se encontraron lotes.'}
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
                <Text className={classes.optionMeta}>{lot.cuitCount} CUITs</Text>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
