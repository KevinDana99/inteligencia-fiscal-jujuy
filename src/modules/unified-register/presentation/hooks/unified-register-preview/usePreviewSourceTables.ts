'use client';

import { useState } from 'react';
import type { IUnifiedRegisterDetail } from '../../../data/models/UnifiedRegister';
import { resolveActiveSourceTable } from './utils';

export function usePreviewSourceTables(item: IUnifiedRegisterDetail) {
  const [activeSourceTableId, setActiveSourceTableId] =
    useState<IUnifiedRegisterDetail['sourceTables'][number]['id']>('inm');
  const activeSourceTable = resolveActiveSourceTable(
    item.sourceTables,
    activeSourceTableId
  );

  return {
    sourceTables: item.sourceTables,
    activeSourceTableId,
    activeSourceTable,
    setActiveSourceTableId
  };
}
