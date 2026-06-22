'use client';

import { CloseButton, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent
} from 'react';
import classes from '../UnifiedRegisterPage/UnifiedRegisterPage.module.css';

interface UnifiedRegisterSearchProps {
  disabled: boolean;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onReset: () => void;
  value: string;
}

export function UnifiedRegisterSearch({
  disabled,
  onBlur,
  onChange,
  onKeyDown,
  onReset,
  value
}: UnifiedRegisterSearchProps) {
  const handleResetMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className={classes.searchRow}>
      <TextInput
        disabled={disabled}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Buscar por CUIT o razón social..."
        leftSection={<IconSearch size={16} stroke={2} />}
        rightSection={
          value ? (
            <CloseButton
              aria-label="Limpiar búsqueda"
              disabled={disabled}
              onMouseDown={handleResetMouseDown}
              onClick={onReset}
              size="sm"
            />
          ) : null
        }
        rightSectionPointerEvents={value ? 'all' : 'none'}
        className={classes.searchInput}
      />
    </div>
  );
}
