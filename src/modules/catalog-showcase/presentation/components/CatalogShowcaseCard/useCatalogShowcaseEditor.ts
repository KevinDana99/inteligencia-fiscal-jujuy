'use client';

import { useDeferredValue, useState } from 'react';
import { useUpdateCatalogShowcaseHeadline } from '../../hooks';

export function useCatalogShowcaseEditor(id: string, initialHeadline: string) {
  const [headline, setHeadline] = useState(initialHeadline);
  const deferredHeadline = useDeferredValue(headline);
  const { updateHeadline, isPending, error } = useUpdateCatalogShowcaseHeadline(id);

  return {
    state: {
      headline,
      deferredHeadline,
      isPending,
      error
    },
    handlers: {
      setHeadline,
      saveHeadline: () => updateHeadline(headline)
    }
  };
}
