import { Button, Text } from '@mantine/core';
import { EXPLORER_REGISTER_TEXTS } from '../../../constants';
import type { ExplorerRegisterController } from '../types';
import classes from '../styles/columnPills.module.css';

export function ExplorerRegisterColumnPills({
  controller
}: {
  controller: ExplorerRegisterController;
}) {
  return (
    <div>
      <Text className={classes.sectionLabel}>
        {EXPLORER_REGISTER_TEXTS.columnsTitle}
      </Text>
      <div className={classes.pillsRow}>
        {controller.columnPills.map((column) => {
          const isActive = controller.selectedColumnCodes.includes(column.code);

          return (
            <Button
              key={column.code}
              variant="default"
              radius="xl"
              className={`${classes.pillButton} ${
                isActive ? classes.pillButtonActive : ''
              }`}
              disabled={!controller.hasCatalog}
              onClick={() => controller.toggleColumn(column.code)}
            >
              {column.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
