'use client'

import {
  type FormEvent,
  useActionState,
  useEffect,
  useRef,
  useState
} from 'react'
import { useRouter } from 'next/navigation'
import { updateAdminUserAction } from '../../data/actions'
import { useAdminPanelConfigContext } from '../contexts'
import { INITIAL_UPDATE_ADMIN_USER_STATE } from './mutations/updateAdminUserState'

export function useEditAdminUserFormModal(onClose: () => void) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [emailError, setEmailError] = useState<string | null>(null)
  const { getEmailDomainError } = useAdminPanelConfigContext()
  const [state, formAction, isPending] = useActionState(
    updateAdminUserAction,
    INITIAL_UPDATE_ADMIN_USER_STATE
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
    if (emailError) {
      setEmailError(null)
    }
  }

  const handleSubmitCapture = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('correo') ?? '')
    const domainError = getEmailDomainError(email)

    if (domainError) {
      event.preventDefault()
      setEmailError(domainError)
      return
    }

    setEmailError(null)
  }

  const handlePasswordChange = (value: string) => {
    setPasswordStrength(getPasswordStrength(value))
  }

  return {
    formRef,
    passwordStrength,
    passwordColor,
    isPending,
    error: emailError ?? state.message,
    formAction,
    handleEmailChange,
    handleSubmitCapture,
    handlePasswordChange
  }
}
