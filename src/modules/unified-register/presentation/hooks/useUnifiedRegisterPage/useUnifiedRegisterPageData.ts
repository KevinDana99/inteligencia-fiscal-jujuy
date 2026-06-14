'use client';

import { useState } from 'react';
import type {
  IUnifiedRegisterItems,
  IUnifiedRegisterListData
} from '../../../data/models/UnifiedRegister';

export function useUnifiedRegisterPageData(
  initialData: IUnifiedRegisterListData | null
) {
  const [items, setItems] = useState<IUnifiedRegisterItems>(
    initialData?.contribuyentes ?? []
  );

  return {
    items,
    setItems
  };
}
