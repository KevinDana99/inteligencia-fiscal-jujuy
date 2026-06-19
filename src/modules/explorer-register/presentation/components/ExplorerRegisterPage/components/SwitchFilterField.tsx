import { Button, Group, Radio, Text } from '@mantine/core';
import {
  EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE,
  EXPLORER_REGISTER_SWITCH_INACTIVE_VALUE,
  EXPLORER_REGISTER_TEXTS
} from '../../../constants';
import type { IExplorerRegisterFilter } from '../../../../data/models/ExplorerRegister';
import type { ExplorerRegisterController } from '../types';
import layoutClasses from '../styles/filterLayout.module.css';
import classes from '../styles/switchFilter.module.css';

export function SwitchFilterField({
  controller,
  disabled,
  filter,
  filterValue
}: {
  controller: ExplorerRegisterController;
  disabled: boolean;
  filter: IExplorerRegisterFilter;
  filterValue: string[];
}) {
  return (
    <div className={classes.switchField}>
      <Text className={layoutClasses.filterLabel}>{filter.name}</Text>
      <Radio.Group
        value={
          filterValue.includes(EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE)
            ? EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE
            : EXPLORER_REGISTER_SWITCH_INACTIVE_VALUE
        }
        onChange={(value) =>
          controller.updateSwitchFilterValue(
            filter.code,
            value === EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE
          )
        }
      >
        <Group className={classes.switchOptions} gap="xs">
          <Radio
            value={EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE}
            label={EXPLORER_REGISTER_TEXTS.switchOn}
            color="blue"
            size="xs"
            disabled={disabled}
          />
          <Radio
            value={EXPLORER_REGISTER_SWITCH_INACTIVE_VALUE}
            label={EXPLORER_REGISTER_TEXTS.switchOff}
            color="blue"
            size="xs"
            disabled={disabled}
          />
          <Button
            variant="subtle"
            size="compact-xs"
            className={classes.switchClearButton}
            disabled={disabled}
            onClick={() => controller.updateSwitchFilterValue(filter.code, false)}
          >
            {EXPLORER_REGISTER_TEXTS.clearFilter}
          </Button>
        </Group>
      </Radio.Group>
    </div>
  );
}
