import { Button, Card, Stack, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { EXPLORER_REGISTER_TEXTS } from '../../../constants';
import type { ExplorerRegisterController } from '../types';
import classes from '../styles/filterLayout.module.css';
import { ExplorerRegisterFilterField } from './ExplorerRegisterFilterField';
import { ExplorerRegisterTemporalFilters } from './ExplorerRegisterTemporalFilters';

export function ExplorerRegisterFiltersCard({
  controller
}: {
  controller: ExplorerRegisterController;
}) {
  return (
    <Card className={classes.filtersCard} radius="lg" padding="lg">
      <Stack gap="md">
        <div className={classes.filtersHeader}>
          <Text className={classes.filtersTitle}>
            {EXPLORER_REGISTER_TEXTS.filtersTitle}
          </Text>
          <div className={classes.filtersActions}>
            <Button
              variant="default"
              radius="xl"
              className={classes.clearButton}
              disabled={!controller.hasCatalog || controller.isPending}
              onClick={controller.clearFilters}
            >
              {EXPLORER_REGISTER_TEXTS.clearFilters}
            </Button>
            <Button
              radius="xl"
              leftSection={<IconSearch size={13} />}
              className={classes.searchButton}
              disabled={!controller.hasCatalog}
              loading={controller.isPending}
              onClick={controller.search}
            >
              {EXPLORER_REGISTER_TEXTS.search}
            </Button>
          </div>
        </div>
        <div className={classes.filtersGrid}>
          {controller.activeFilters.map((filter, index) => (
            <ExplorerRegisterFilterField
              key={filter.code}
              controller={controller}
              filter={filter}
              shouldRenderDivider={shouldRenderFilterDivider(controller, index)}
            />
          ))}
          <ExplorerRegisterTemporalFilters controller={controller} />
        </div>
      </Stack>
    </Card>
  );
}

function shouldRenderFilterDivider(
  controller: ExplorerRegisterController,
  index: number
) {
  const filter = controller.activeFilters[index];
  const nextFilter = controller.activeFilters[index + 1];

  return (
    index < controller.activeFilters.length - 1 &&
    filter.inputType !== 'switch' &&
    nextFilter?.inputType !== 'switch'
  );
}
