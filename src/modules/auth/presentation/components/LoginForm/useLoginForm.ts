'use client'

import { useState } from 'react'
import { useSignIn } from '../../hooks'

export function useLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [recoveryNoticeVisible, setRecoveryNoticeVisible] = useState(false)
  const { signIn, isPending, error, clearError } = useSignIn()
  const hasError = Boolean(error) && !recoveryNoticeVisible

  const resetErrors = () => {
    setValidationError(null)
    clearError()
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
  }

  const handleEmailChange = (value: string) => {
    resetErrors()
    setRecoveryNoticeVisible(false)
    setEmail(value)
  }

  const handlePasswordChange = (value: string) => {
    resetErrors()
    setRecoveryNoticeVisible(false)
    setPassword(value)
  }

  const showRecoveryNotice = () => {
    resetErrors()
    resetForm()
    setRecoveryNoticeVisible(true)
  }

  const handleSubmit = () => {
    setRecoveryNoticeVisible(false)

    if (!email.trim()) {
      setValidationError('El campo mail esta vacio.')
      return
    }

    if (!password.trim()) {
      setValidationError('El campo contrasena esta vacio.')
      return
    }

    setValidationError(null)
    signIn(email.trim(), password)
  }

  return {
    email,
    password,
    isPending,
    error: validationError ?? error,
    recoveryNoticeVisible,
    hasError,
    setEmail: handleEmailChange,
    setPassword: handlePasswordChange,
    showRecoveryNotice,
    handleSubmit
  }
}
