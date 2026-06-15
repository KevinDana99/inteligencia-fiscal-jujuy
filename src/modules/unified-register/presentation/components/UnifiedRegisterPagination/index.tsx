'use client';

import { Pagination } from '@mantine/core';
import classes from '../UnifiedRegisterPage/UnifiedRegisterPage.module.css';

interface UnifiedRegisterPaginationProps {
  activePage: number;
  disabled: boolean;
  onChange: (page: number) => void;
  totalPages: number;
}

export function UnifiedRegisterPagination({
  activePage,
  disabled,
  onChange,
  totalPages
}: UnifiedRegisterPaginationProps) {
  return (
    <div className={classes.paginationRow}>
      <Pagination
        total={totalPages}
        value={activePage}
        onChange={onChange}
        disabled={disabled}
        aria-label="Paginación del padrón unificado"
      />
    </div>
  );
}
