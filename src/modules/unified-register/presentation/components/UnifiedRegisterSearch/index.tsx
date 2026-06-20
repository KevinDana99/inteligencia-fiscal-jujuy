'use client';

import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { ChangeEvent, FocusEvent } from 'react';
import classes from '../UnifiedRegisterPage/UnifiedRegisterPage.module.css';

interface UnifiedRegisterSearchProps {
  disabled: boolean;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export function UnifiedRegisterSearch({
  disabled,
  onBlur,
  onChange,
  value
}: UnifiedRegisterSearchProps) {
  return (
    <div className={classes.searchRow}>
      <TextInput
        disabled={disabled}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        placeholder="Buscar por CUIT o razón social..."
        leftSection={<IconSearch size={16} stroke={2} />}
        className={classes.searchInput}
      />
    </div>
  );
}
