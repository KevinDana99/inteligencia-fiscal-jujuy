'use client';

import { Card, Pagination, Stack, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { UnifiedRegisterCard } from '../UnifiedRegisterCard';
import { useUnifiedRegisterPage } from '../../hooks/useUnifiedRegisterPage';
import classes from './UnifiedRegisterPage.module.css';

export function UnifiedRegisterPage() {
  const {
    search,
    handleSearchChange,
    filteredItems,
    hasResults,
    activePage,
    setActivePage,
    totalPages
  } = useUnifiedRegisterPage();

  return (
    <div className={classes.page}>
      <div className={classes.searchRow}>
        <TextInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por CUIT o razón social..."
          leftSection={<IconSearch size={16} stroke={2} />}
          className={classes.searchInput}
        />
      </div>

      {hasResults ? (
        <>
          <div className={classes.cards}>
            {filteredItems.map((item) => (
              <UnifiedRegisterCard key={item.cuit} item={item} />
            ))}
          </div>

          <div className={classes.paginationRow}>
            <Pagination
              total={totalPages}
              value={activePage}
              onChange={setActivePage}
              aria-label="Paginación del padrón unificado"
            />
          </div>
        </>
      ) : (
        <Card className={classes.emptyState} padding="xl" radius="lg">
          <Stack gap="xs">
            <Text className={classes.emptyText}>
              No se encontraron resultados para ese CUIT o razón social
            </Text>
          </Stack>
        </Card>
      )}
    </div>
  );
}
