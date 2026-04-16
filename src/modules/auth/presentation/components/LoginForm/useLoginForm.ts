'use client';

import { useState } from 'react';
import { useSignIn } from '../../hooks';

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { signIn, isPending, error } = useSignIn();

  const handleSubmit = () => {
    if (!email.trim()) {
      setValidationError('Email is required.');
      return;
    }

    if (!password.trim()) {
      setValidationError('Password is required.');
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
    setEmail,
    setPassword,
    handleSubmit
  };
}
