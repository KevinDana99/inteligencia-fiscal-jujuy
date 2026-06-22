'use client';

import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import classes from '../UnifiedRegisterPage/UnifiedRegisterPage.module.css';

interface UnifiedRegisterSearchProps {
  disabled: boolean;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  value: string;
}

export function UnifiedRegisterSearch({
  disabled,
  onBlur,
  onChange,
  onKeyDown,
  value
}: UnifiedRegisterSearchProps) {
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
        className={classes.searchInput}
      />
    </div>
  );
}
