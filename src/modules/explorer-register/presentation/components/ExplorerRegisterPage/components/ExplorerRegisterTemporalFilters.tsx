import { DatePickerInput } from '@mantine/dates';
import { IconArrowRight, IconCalendar } from '@tabler/icons-react';
import { EXPLORER_REGISTER_TEXTS } from '../../../constants';
import type { ExplorerRegisterController } from '../types';
import classes from '../styles/filterInput.module.css';

export function ExplorerRegisterTemporalFilters({
  controller
}: {
  controller: ExplorerRegisterController;
}) {
  if (!controller.hasActiveTemporalFilters) {
    return null;
  }

  const startDate = controller.temporalRange.startDate;
  const endDate = controller.temporalRange.endDate;

  function handleStartDateChange(value: string | null) {
    const nextStartDate = value ?? '';
    controller.updateTemporalRange('startDate', nextStartDate);

    if (nextStartDate && endDate && endDate < nextStartDate) {
      controller.updateTemporalRange('endDate', nextStartDate);
    }
  }

  function handleEndDateChange(value: string | null) {
    const nextEndDate = value ?? '';

    controller.updateTemporalRange(
      'endDate',
      nextEndDate && startDate && nextEndDate < startDate
        ? startDate
        : nextEndDate
    );
  }

  return (
    <div id="ep-bloque-fechas" className={classes.temporalBlock}>
      <div className={classes.temporalTitle}>
        {EXPLORER_REGISTER_TEXTS.temporalPeriod}
      </div>
      <div className={classes.temporalControls}>
        <div className={classes.temporalField}>
          <label
            className={classes.temporalLabel}
            htmlFor="explorer-register-start-date"
          >
            {EXPLORER_REGISTER_TEXTS.temporalStart}
          </label>
          <DatePickerInput
            id="explorer-register-start-date"
            aria-label={EXPLORER_REGISTER_TEXTS.temporalStart}
            value={startDate || null}
            disabled={controller.isPending}
            maxDate={getDatePickerLimit(endDate)}
            valueFormat="YYYY-MM-DD"
            leftSection={<IconCalendar size={14} color="#94A3B8" />}
            leftSectionPointerEvents="none"
            leftSectionWidth={30}
            className={classes.temporalDateInput}
            onChange={handleStartDateChange}
          />
        </div>
        <IconArrowRight
          aria-hidden
          className={classes.temporalArrow}
          size={16}
          stroke={1.8}
        />
        <div className={classes.temporalField}>
          <label
            className={classes.temporalLabel}
            htmlFor="explorer-register-end-date"
          >
            {EXPLORER_REGISTER_TEXTS.temporalEnd}
          </label>
          <DatePickerInput
            id="explorer-register-end-date"
            aria-label={EXPLORER_REGISTER_TEXTS.temporalEnd}
            value={endDate || null}
            disabled={controller.isPending}
            minDate={getDatePickerLimit(startDate)}
            valueFormat="YYYY-MM-DD"
            leftSection={<IconCalendar size={14} color="#94A3B8" />}
            leftSectionPointerEvents="none"
            leftSectionWidth={30}
            className={classes.temporalDateInput}
            onChange={handleEndDateChange}
          />
        </div>
      </div>
    </div>
  );
}

function getDatePickerLimit(value: string) {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}
