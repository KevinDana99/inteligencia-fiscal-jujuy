import type { IUnifiedRegisterItem } from '../../data/models/UnifiedRegister';
import type { UnifiedRegisterSearchField } from '../constants/unifiedRegisterPage';

export function normalizeUnifiedRegisterSearchValue(value: string) {
  return value.trim().toLowerCase();
}

export function matchesUnifiedRegisterSearch(
  item: IUnifiedRegisterItem,
  normalizedSearch: string,
  searchFields: readonly UnifiedRegisterSearchField[]
) {
  return searchFields.some((field) =>
    normalizeUnifiedRegisterSearchValue(item[field]).includes(normalizedSearch)
  );
}
