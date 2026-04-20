'use client';

import { startTransition, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AUTH_MODE, AUTH_MOCK_USERS, AUTH_ROUTES } from '@/lib/auth/constants';
import { signInAction } from '../../../data/actions';

export function useSignIn(
  forcedMode?: (typeof AUTH_MODE)[keyof typeof AUTH_MODE]
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const signIn = (email: string, password: string) => {
    clearError();
    setIsPending(true);

    startTransition(() => {
      void signInAction({ correo: email, contrasena: password })
        .then((result) => {
          if ('error' in result) {
            setError(
              result.error === 'Invalid credentials'
                ? 'El correo electronico o la contrasena son incorrectos. Verifica tus datos e intenta nuevamente.'
                : 'No fue posible iniciar sesion. Intenta nuevamente.'
            );
            return;
          }

          const requestedMode =
            forcedMode ??
            (searchParams.get('mode') === AUTH_MODE.admin
              ? AUTH_MODE.admin
              : AUTH_MODE.user);
          const isAdminUser = result.usuario.correo === AUTH_MOCK_USERS.admin.email;
          const targetPath =
            isAdminUser || requestedMode === AUTH_MODE.admin
              ? AUTH_ROUTES.admin
              : AUTH_ROUTES.home;

          router.replace(targetPath as never);
          router.refresh();
        })
        .catch(() => {
          setError('No fue posible iniciar sesion. Intenta nuevamente.');
        })
        .finally(() => {
          setIsPending(false);
        });
    });
  };

  return {
    signIn,
    isPending,
    error,
    clearError
  };
}
