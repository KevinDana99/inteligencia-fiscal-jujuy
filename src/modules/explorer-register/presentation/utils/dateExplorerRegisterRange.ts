import { EXPLORER_REGISTER_REQUEST_LIMITS } from '../../constants';
import { EXPLORER_REGISTER_TEXTS } from '../constants';

export interface IExplorerRegisterTemporalRange {
  startDate: string;
  endDate: string;
}

function getMonthDistance(startDate: Date, endDate: Date) {
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth())
  );
}

export function getDefaultExplorerRegisterTemporalRange(): IExplorerRegisterTemporalRange {
  return {
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  };
}

export function validateExplorerRegisterTemporalRange(
  range: IExplorerRegisterTemporalRange,
  isRequired: boolean
): string | null {
  const hasStartDate = Boolean(range.startDate);
  const hasEndDate = Boolean(range.endDate);

  if (!isRequired && !hasStartDate && !hasEndDate) {
    return null;
  }

  if (!hasStartDate || !hasEndDate) {
    return EXPLORER_REGISTER_TEXTS.temporalRangeRequired;
  }

  const startDate = new Date(`${range.startDate}T00:00:00`);
  const endDate = new Date(`${range.endDate}T00:00:00`);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return EXPLORER_REGISTER_TEXTS.temporalRangeRequired;
  }

  if (startDate.getTime() > endDate.getTime()) {
    return EXPLORER_REGISTER_TEXTS.temporalRangeOrder;
  }

  const monthDistance = getMonthDistance(startDate, endDate);
  const exceedsMonthLimit =
    monthDistance > EXPLORER_REGISTER_REQUEST_LIMITS.maxTemporalRangeMonths ||
    (monthDistance === EXPLORER_REGISTER_REQUEST_LIMITS.maxTemporalRangeMonths &&
      endDate.getDate() > startDate.getDate());

  return exceedsMonthLimit ? EXPLORER_REGISTER_TEXTS.temporalRangeLimit : null;
}
