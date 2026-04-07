'use client';

import { useEffect, useState } from 'react';
import { getCatalogShowcaseAction } from '../../../data/actions';
import type { ICatalogShowcase } from '../../../data/models/CatalogShowcase';

export function useCatalogShowcaseData(id: string, initialData?: ICatalogShowcase) {
  const [data, setData] = useState<ICatalogShowcase | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      return;
    }

    let isMounted = true;

    async function fetchCatalog() {
      setIsLoading(true);

      try {
        const result = await getCatalogShowcaseAction({ id });
        if (!isMounted) {
          return;
        }

        setData(result.data);
        setError(result.error ?? null);
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchCatalog();

    return () => {
      isMounted = false;
    };
  }, [id, initialData]);

  return { data, isLoading, error };
}
