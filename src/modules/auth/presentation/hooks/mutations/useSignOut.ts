'use client';

import { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOutAction } from '../../../data/actions';

export function useSignOut() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = () => {
    setError(null);
    setIsPending(true);

    startTransition(() => {
      void signOutAction()
        .then(() => {
          router.replace('/login');
          router.refresh();
        })
        .catch(() => {
          setError('Unable to sign out. Please try again.');
        })
        .finally(() => {
          setIsPending(false);
        });
    });
  };

  return { signOut, isPending, error };
}
