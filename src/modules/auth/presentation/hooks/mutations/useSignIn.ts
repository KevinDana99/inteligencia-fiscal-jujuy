'use client';

import { startTransition, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AUTH_MODE, AUTH_ROUTES } from '@/lib/auth/constants';
import { signInAction } from '../../../data/actions';

export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = (email: string, password: string) => {
    setError(null);
    setIsPending(true);

    startTransition(() => {
      void signInAction({ correo: email, contrasena: password })
        .then((result) => {
          if ('error' in result) {
            setError(
              result.error === 'Invalid credentials'
                ? 'Invalid email or password'
                : 'Unable to sign in. Please try again.'
            );
            return;
          }

          const mode = searchParams.get('mode') ?? AUTH_MODE.user;
          const targetPath = mode === AUTH_MODE.admin ? AUTH_ROUTES.admin : AUTH_ROUTES.home;

          router.replace(targetPath as never);
          router.refresh();
        })
        .catch(() => {
          setError('Unable to sign in. Please try again.');
        })
        .finally(() => {
          setIsPending(false);
        });
    });
  };

  return {
    signIn,
    isPending,
    error
  };
}
