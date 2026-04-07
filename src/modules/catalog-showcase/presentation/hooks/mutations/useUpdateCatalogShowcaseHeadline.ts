'use client';

import { startTransition, useState } from 'react';
import { updateCatalogShowcaseHeadlineAction } from '../../../data/actions';

export function useUpdateCatalogShowcaseHeadline(id: string) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateHeadline = (headline: string) => {
    setError(null);
    setIsPending(true);

    startTransition(() => {
      void updateCatalogShowcaseHeadlineAction({ id, headline })
        .then((result) => {
          if (!result.success) {
            setError(result.error ?? 'Unknown error');
          }
        })
        .catch((mutationError) => {
          setError(mutationError instanceof Error ? mutationError.message : 'Unknown error');
        })
        .finally(() => {
          setIsPending(false);
        });
    });
  };

  return {
    updateHeadline,
    isPending,
    error
  };
}
