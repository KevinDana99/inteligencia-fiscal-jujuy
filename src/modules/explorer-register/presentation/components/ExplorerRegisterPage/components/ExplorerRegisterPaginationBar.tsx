import { Group, Pagination, Select, Text } from '@mantine/core';
import {
  EXPLORER_REGISTER_ITEMS_PER_PAGE_OPTIONS,
  EXPLORER_REGISTER_TEXTS
} from '../../../constants';
import type { ExplorerRegisterController } from '../types';
import classes from '../styles/results.module.css';

export function ExplorerRegisterPaginationBar({
  controller
}: {
  controller: ExplorerRegisterController;
}) {
  const result = controller.result;

  if (!result) {
    return null;
  }

  return (
    <Group justify="space-between" className={classes.paginationBar}>
      <Text className={classes.paginationText}>
        {EXPLORER_REGISTER_TEXTS.totalResults}: {result.totalItems}
      </Text>
      <Group gap="sm">
        <Select
          aria-label={EXPLORER_REGISTER_TEXTS.pageSize}
          value={String(controller.itemsPerPage)}
          data={EXPLORER_REGISTER_ITEMS_PER_PAGE_OPTIONS.map((option) => ({
            value: String(option),
            label: String(option)
          }))}
          className={classes.pageSizeSelect}
          disabled={controller.isPending}
          onChange={(value) =>
            controller.changeItemsPerPage(Number(value ?? 20))
          }
        />
        <Pagination
          value={result.page}
          total={Math.max(result.totalPages, 1)}
          disabled={controller.isPending || result.totalPages <= 1}
          onChange={controller.changePage}
        />
      </Group>
    </Group>
  );
}
