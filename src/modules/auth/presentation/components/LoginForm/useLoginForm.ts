'use client';

import { useState } from 'react';
import { useAuthSession, useSignIn } from '../../hooks';

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { data: session } = useAuthSession();
  const { signIn, isPending, error, clearError } = useSignIn();

  const resetErrors = () => {
    setValidationError(null);
    clearError();
  };

  const handleEmailChange = (value: string) => {
    resetErrors();
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    resetErrors();
    setPassword(value);
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      setValidationError('El campo mail esta vacio.');
      return;
    }

    if (!password.trim()) {
      setValidationError('El campo contrasena esta vacio.');
      return;
    }

    setValidationError(null);
    signIn(email.trim(), password);
  };

  return {
    email,
    password,
    isPending,
    error: validationError ?? error,
    recoveryHref: session?.user.role === 'admin' ? '/admin' : '/login?mode=admin',
    setEmail: handleEmailChange,
    setPassword: handlePasswordChange,
    handleSubmit
  };
}
