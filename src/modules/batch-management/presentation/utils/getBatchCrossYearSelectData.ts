import type { ComboboxItem } from '@mantine/core';

type BatchCrossYearSelectMode = 'default' | 'fromAnnual' | 'toAnnual';

export function getBatchCrossYearSelectData(
  yearOptions: string[],
  mode: BatchCrossYearSelectMode = 'default'
): ComboboxItem[] {
  return yearOptions.map((year) => ({
    value: year,
    label:
      mode === 'fromAnnual'
        ? `${year}/01`
        : mode === 'toAnnual'
          ? `${year}/12`
          : year
  }));
}
