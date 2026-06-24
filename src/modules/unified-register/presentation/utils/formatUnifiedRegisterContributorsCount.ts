import {
  UNIFIED_REGISTER_COUNT_PLURAL_LABEL,
  UNIFIED_REGISTER_COUNT_SINGULAR_LABEL,
} from "../constants/unifiedRegisterPage";

export function formatUnifiedRegisterContributorsCount(totalItems: number) {
  const normalizedTotalItems = Math.max(0, totalItems);
  const label =
    normalizedTotalItems === 1
      ? UNIFIED_REGISTER_COUNT_SINGULAR_LABEL
      : UNIFIED_REGISTER_COUNT_PLURAL_LABEL;

  return `${new Intl.NumberFormat("es-AR").format(
    normalizedTotalItems
  )} ${label}`;
}
