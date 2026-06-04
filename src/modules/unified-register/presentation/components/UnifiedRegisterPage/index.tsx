'use client';

import { Text } from '@mantine/core';
import type { IUnifiedRegisterListData } from '../../../data/models/UnifiedRegister';
import { UnifiedRegisterEmptyState } from '../UnifiedRegisterEmptyState';
import { UnifiedRegisterList } from '../UnifiedRegisterList';
import { UnifiedRegisterPagination } from '../UnifiedRegisterPagination';
import { UnifiedRegisterSearch } from '../UnifiedRegisterSearch';
import { useUnifiedRegisterPage } from '../../hooks/useUnifiedRegisterPage';
import classes from './UnifiedRegisterPage.module.css';

export function UnifiedRegisterPage({
  initialData
}: {
  initialData: IUnifiedRegisterListData | null;
}) {
  const {
    search,
    handleSearchChange,
    filteredItems,
    hasResults,
    activePage,
    setActivePage,
    totalPages,
    isPagePending,
    pageError
  } = useUnifiedRegisterPage(initialData);

  return (
    <div className={classes.page}>
      <UnifiedRegisterSearch value={search} onChange={handleSearchChange} />

      {hasResults ? (
        <>
          <UnifiedRegisterList items={filteredItems} />

          <UnifiedRegisterPagination
            totalPages={totalPages}
            activePage={activePage}
            onChange={setActivePage}
            disabled={isPagePending}
          />
        </>
      ) : (
        <UnifiedRegisterEmptyState />
      )}

      {pageError ? (
        <Text c="red" size="sm">
          {pageError}
        </Text>
      ) : null}
    </div>
  );
}
