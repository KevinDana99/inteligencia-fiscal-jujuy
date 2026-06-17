import { DatePickerInput } from '@mantine/dates';
import { EXPLORER_REGISTER_TEXTS } from '../../../constants';
import type { ExplorerRegisterController } from '../types';
import classes from '../styles/filterInput.module.css';
import { FilterDivider } from './FilterDivider';

export function ExplorerRegisterTemporalFilters({
  controller
}: {
  controller: ExplorerRegisterController;
}) {
  if (!controller.hasActiveTemporalFilters) {
    return null;
  }

  return (
    <>
      <DatePickerInput
        label={EXPLORER_REGISTER_TEXTS.temporalStart}
        placeholder={EXPLORER_REGISTER_TEXTS.temporalStart}
        value={controller.temporalRange.startDate || null}
        clearable
        disabled={controller.isPending}
        valueFormat="YYYY-MM-DD"
        className={`${classes.filterSelect} ${classes.datePickerInput}`}
        onChange={(value) =>
          controller.updateTemporalRange('startDate', value ?? '')
        }
      />
      <FilterDivider />
      <DatePickerInput
        label={EXPLORER_REGISTER_TEXTS.temporalEnd}
        placeholder={EXPLORER_REGISTER_TEXTS.temporalEnd}
        value={controller.temporalRange.endDate || null}
        clearable
        disabled={controller.isPending}
        valueFormat="YYYY-MM-DD"
        className={`${classes.filterSelect} ${classes.datePickerInput}`}
        onChange={(value) =>
          controller.updateTemporalRange('endDate', value ?? '')
        }
      />
    </>
  );
}
