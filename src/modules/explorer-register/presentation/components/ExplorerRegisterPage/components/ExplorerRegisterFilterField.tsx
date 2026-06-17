import { Fragment } from 'react';
import { Text } from '@mantine/core';
import type { IExplorerRegisterFilter } from '../../../../data/models/ExplorerRegister';
import { getExplorerRegisterFilterOptionData } from '../../../utils';
import type { ExplorerRegisterController } from '../types';
import classes from '../styles/filterLayout.module.css';
import { ExplorerRegisterFilterInput } from './ExplorerRegisterFilterInput';
import { FilterDivider } from './FilterDivider';
import { SwitchFilterField } from './SwitchFilterField';

export function ExplorerRegisterFilterField({
  controller,
  filter,
  shouldRenderDivider
}: {
  controller: ExplorerRegisterController;
  filter: IExplorerRegisterFilter;
  shouldRenderDivider: boolean;
}) {
  const filterValue = controller.filterValues[filter.code] ?? [];
  const filterOptions = getExplorerRegisterFilterOptionData(filter);
  const disabled = !filter.available || controller.isPending;

  return (
    <Fragment>
      <div className={classes.filterField}>
        {filter.inputType === 'switch' ? (
          <SwitchFilterField
            controller={controller}
            disabled={disabled}
            filter={filter}
            filterValue={filterValue}
          />
        ) : (
          <>
            <Text className={classes.filterLabel}>{filter.name}</Text>
            <ExplorerRegisterFilterInput
              controller={controller}
              disabled={disabled}
              filter={filter}
              filterOptions={filterOptions}
              filterValue={filterValue}
            />
          </>
        )}
        {!filter.available && filter.unavailableReason ? (
          <Text className={classes.filterHint}>{filter.unavailableReason}</Text>
        ) : null}
      </div>
      {shouldRenderDivider ? <FilterDivider /> : null}
    </Fragment>
  );
}
