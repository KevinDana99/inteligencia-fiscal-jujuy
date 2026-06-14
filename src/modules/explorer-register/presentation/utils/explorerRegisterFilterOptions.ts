import type { IExplorerRegisterFilter } from '../../data/models/ExplorerRegister';

export interface IExplorerRegisterFilterOptionData {
  value: string;
  label: string;
}

export interface IExplorerRegisterFilterTagParts {
  code: string;
  detail: string;
}

export function getExplorerRegisterFilterOptionData(
  filter: IExplorerRegisterFilter
): IExplorerRegisterFilterOptionData[] {
  return filter.allowedValues.map((value) => ({
    value,
    label: value
  }));
}

export function filterExplorerRegisterOptionData(
  options: IExplorerRegisterFilterOptionData[],
  selectedValues: string[],
  searchValue: string
): IExplorerRegisterFilterOptionData[] {
  const normalizedSearch = searchValue.trim().toLowerCase();

  return options
    .filter((option) => !selectedValues.includes(option.value))
    .filter((option) => {
      if (!normalizedSearch) {
        return true;
      }

      return `${option.value} ${option.label}`
        .toLowerCase()
        .includes(normalizedSearch);
    });
}

export function getExplorerRegisterFilterTagParts(
  value: string,
  label = value
): IExplorerRegisterFilterTagParts {
  const labelPrefix = `${value} - `;

  if (label.startsWith(labelPrefix)) {
    return {
      code: value,
      detail: label.slice(labelPrefix.length)
    };
  }

  return {
    code: value,
    detail: label === value ? '' : label
  };
}
