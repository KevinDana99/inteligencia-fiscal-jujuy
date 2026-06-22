export const UNIFIED_REGISTER_HEADER_EMPTY_VALUE = '-';

export function formatUnifiedRegisterHeaderText(
  value: string | null | undefined
) {
  const normalizedValue = value?.trim();

  return normalizedValue || UNIFIED_REGISTER_HEADER_EMPTY_VALUE;
}
