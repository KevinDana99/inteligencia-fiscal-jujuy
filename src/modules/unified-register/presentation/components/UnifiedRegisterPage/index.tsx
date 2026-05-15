'use client';

import { Card, Stack, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { UnifiedRegisterCard } from '../UnifiedRegisterCard';
import { useUnifiedRegister } from '../../hooks/useUnifiedRegister';
import classes from './UnifiedRegisterPage.module.css';

export function UnifiedRegisterPage() {
  const { search, setSearch, filteredItems } = useUnifiedRegister();

  return (
    <div className={classes.page}>
      <div className={classes.searchRow}>
        <TextInput
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Buscar por CUIT o razón social..."
          leftSection={<IconSearch size={16} stroke={2} />}
          className={classes.searchInput}
        />
      </div>

      {filteredItems.length > 0 ? (
        <div className={classes.cards}>
          {filteredItems.map((item) => (
            <UnifiedRegisterCard key={item.cuit} item={item} />
          ))}
        </div>
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
