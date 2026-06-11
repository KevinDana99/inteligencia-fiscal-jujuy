'use client';

import { useMemo } from 'react';
import type { IExplorerRegisterCatalog } from '../../../data/models/ExplorerRegister';
import { EMPTY_EXPLORER_REGISTER_CATALOG } from '../../constants';

export function useExplorerRegisterCatalog(
  initialCatalog: IExplorerRegisterCatalog | null
) {
  const catalog = initialCatalog ?? EMPTY_EXPLORER_REGISTER_CATALOG;
  const columnPills = useMemo(
    () => catalog.availableColumns.filter((column) => !column.fixed),
    [catalog]
  );

  return {
    catalog,
    columnPills,
    hasCatalog: Boolean(initialCatalog)
  };
}
