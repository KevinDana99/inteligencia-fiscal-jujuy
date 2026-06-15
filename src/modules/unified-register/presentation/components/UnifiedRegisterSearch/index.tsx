'use client';

import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { ChangeEvent } from 'react';
import classes from '../UnifiedRegisterPage/UnifiedRegisterPage.module.css';

interface UnifiedRegisterSearchProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export function UnifiedRegisterSearch({
  onChange,
  value
}: UnifiedRegisterSearchProps) {
  return (
    <div className={classes.searchRow}>
      <TextInput
        value={value}
        onChange={onChange}
        placeholder="Buscar por CUIT o razón social..."
        leftSection={<IconSearch size={16} stroke={2} />}
        className={classes.searchInput}
      />
    </div>
  );
}
