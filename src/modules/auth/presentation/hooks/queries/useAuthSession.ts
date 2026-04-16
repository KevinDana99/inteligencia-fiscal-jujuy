'use client';

import { useEffect, useState } from 'react';
import { getAuthSessionAction } from '../../../data/actions';
import type { IAuthSession } from '../../../data/models/Auth';

export function useAuthSession(initialData?: IAuthSession | null) {
  const [data, setData] = useState<IAuthSession | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      return;
    }

    let isMounted = true;

    async function fetchSession() {
      setIsLoading(true);

      try {
        const result = await getAuthSessionAction();

        if (!isMounted) {
          return;
        }

        setData(result.data);
        setError(result.error ?? null);
      } catch (sessionError) {
        if (isMounted) {
          setError(
            sessionError instanceof Error ? sessionError.message : 'Unknown error'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchSession();

    return () => {
      isMounted = false;
    };
  }, [initialData]);

  return { data, isLoading, error };
}
