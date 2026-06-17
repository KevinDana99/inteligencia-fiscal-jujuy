import { EXPLORER_REGISTER_TEXTS } from '../constants';

export function getExplorerRegisterDisplayedError({
  catalogError,
  searchError,
  searchStatus
}: {
  catalogError?: string;
  searchError?: string | null;
  searchStatus?: number;
}) {
  return (
    catalogError ??
    searchError ??
    (searchStatus === 409 ? EXPLORER_REGISTER_TEXTS.sourceUnavailable : null)
  );
}
