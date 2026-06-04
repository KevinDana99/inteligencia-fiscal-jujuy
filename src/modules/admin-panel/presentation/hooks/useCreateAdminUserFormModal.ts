'use client'

import {
  type ChangeEvent,
  type FormEvent,
  useActionState,
  useEffect,
  useRef,
  useState
} from 'react'
import { useRouter } from 'next/navigation'
import { createAdminUserAction } from '../../data/actions'
import { useAdminPanelConfigContext } from '../contexts'
import {
  getPasswordStrength,
  getPasswordStrengthColor
} from '../utils/adminPanelPassword'
import { INITIAL_CREATE_ADMIN_USER_STATE } from './mutations/createAdminUserState'

export function useCreateAdminUserFormModal(
  onClose: () => void,
  roleOptions: string[]
) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null)
  const { getEmailDomainError } = useAdminPanelConfigContext()
  const [state, formAction, isPending] = useActionState(
    createAdminUserAction,
    INITIAL_CREATE_ADMIN_USER_STATE
  )

  const passwordColor = getPasswordStrengthColor(passwordStrength)

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
    const password = String(formData.get('contrasena') ?? '')
    const confirmPassword = String(formData.get('confirmarContrasena') ?? '')
    const domainError = getEmailDomainError(email)

    if (domainError) {
      event.preventDefault()
      setEmailError(domainError)
      setConfirmPasswordError(null)
      setValidationError(null)
      return
    }

    if (confirmPassword !== password) {
      event.preventDefault()
      setEmailError(null)
      setConfirmPasswordError('Las contraseñas no coinciden.')
      setValidationError(null)
      return
    }

    setEmailError(null)
    setConfirmPasswordError(null)
    setValidationError(null)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (validationError) {
      setValidationError(null)
    }
    if (confirmPasswordError) {
      setConfirmPasswordError(null)
    }
    setPasswordStrength(getPasswordStrength(event.currentTarget.value))
  }

  const handleConfirmPasswordChange = () => {
    if (validationError) {
      setValidationError(null)
    }
    if (confirmPasswordError) {
      setConfirmPasswordError(null)
    }
  }

  return {
    formRef,
    passwordStrength,
    passwordColor,
    isPending,
    emailError,
    confirmPasswordError,
    error:
      emailError || confirmPasswordError
        ? null
        : (validationError ?? state.message),
    formAction,
    handleEmailChange,
    handleConfirmPasswordChange,
    handleSubmitCapture,
    handlePasswordChange,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      roleLabel: roleOptions[0] ?? ''
    }
  }
}
