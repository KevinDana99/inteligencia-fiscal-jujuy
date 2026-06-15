'use client';

import { Card, Stack, Text } from '@mantine/core';
import { UNIFIED_REGISTER_EMPTY_SEARCH_MESSAGE } from '../../constants/unifiedRegisterPage';
import classes from '../UnifiedRegisterPage/UnifiedRegisterPage.module.css';

export function UnifiedRegisterEmptyState() {
  return (
    <Card className={classes.emptyState} padding="xl" radius="lg">
      <Stack gap="xs">
        <Text className={classes.emptyText}>
          {UNIFIED_REGISTER_EMPTY_SEARCH_MESSAGE}
        </Text>
      </Stack>
    </Card>
  );
}
