'use client'

import {
  type FormEvent,
  useActionState,
  useEffect,
  useRef,
  useState
} from 'react'
import { useRouter } from 'next/navigation'
import { createAdminUserAction } from '../../data/actions'
import { useAdminPanelConfigContext } from '../contexts'
import { INITIAL_CREATE_ADMIN_USER_STATE } from './mutations/createAdminUserState'

export function useCreateAdminUserFormModal(onClose: () => void) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)
  const { getEmailDomainError } = useAdminPanelConfigContext()
  const [state, formAction, isPending] = useActionState(
    createAdminUserAction,
    INITIAL_CREATE_ADMIN_USER_STATE
  )

  function getPasswordStrength(value: string) {
    const checks = [
      value.length >= 8,
      /[a-z]/.test(value),
      /[A-Z]/.test(value),
      /\d/.test(value),
      /[^A-Za-z0-9]/.test(value)
    ]

    return checks.filter(Boolean).length
  }

  const passwordColor =
    passwordStrength <= 1
      ? 'red'
      : passwordStrength === 2
        ? 'orange'
        : passwordStrength === 3
          ? 'yellow'
          : passwordStrength === 4
            ? 'green'
            : 'teal'

  useEffect(() => {
    if (!state.success) {
      return
    }
    formRef.current?.reset()
    onClose()
    router.refresh()
  }, [onClose, router, state.success])

  const handleEmailChange = () => {
    if (validationError) {
      setValidationError(null)
    }
  }

  const handleSubmitCapture = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('correo') ?? '')
    const password = String(formData.get('contrasena') ?? '')
    const confirmPassword = String(formData.get('confirmarContrasena') ?? '')
    const domainError = getEmailDomainError(email)

    if (domainError) {
      event.preventDefault()
      setValidationError(domainError)
      return
    }

    if (confirmPassword !== password) {
      event.preventDefault()
      setValidationError('Las contraseñas no coinciden.')
      return
    }

    setValidationError(null)
  }

  const handlePasswordChange = (value: string) => {
    if (validationError) {
      setValidationError(null)
    }
    setPasswordStrength(getPasswordStrength(value))
  }

  const handleConfirmPasswordChange = () => {
    if (validationError) {
      setValidationError(null)
    }
  }

  return {
    formRef,
    passwordStrength,
    passwordColor,
    isPending,
    error: validationError ?? state.message,
    formAction,
    handleEmailChange,
    handleConfirmPasswordChange,
    handleSubmitCapture,
    handlePasswordChange
  }
}
