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
import { TOAST_ADMIN_MESSAGES, toast } from '@/components/core/toasts'
import { updateAdminUserAction } from '../../data/actions'
import type { IAdminPanelUser } from '../../data/models/AdminPanel'
import { useAdminPanelConfigContext } from '../contexts'
import {
  getPasswordStrength,
  getPasswordStrengthColor
} from '../utils/adminPanelPassword'
import { formatAdminPanelPersonName } from '../utils/formatAdminPanelPersonName'
import { splitAdminPanelUserFullName } from '../utils/splitAdminPanelUserFullName'
import { INITIAL_UPDATE_ADMIN_USER_STATE } from './mutations/updateAdminUserState'

export function useEditAdminUserFormModal(
  onClose: () => void,
  initialUser: IAdminPanelUser | null | undefined,
  roleOptions: string[]
) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const submittedUserRef = useRef({
    name: '',
    surname: ''
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null)
  const { getEmailDomainError } = useAdminPanelConfigContext()
  const [state, formAction, isPending] = useActionState(
    updateAdminUserAction,
    INITIAL_UPDATE_ADMIN_USER_STATE
  )

  const passwordColor = getPasswordStrengthColor(passwordStrength)
  const { firstName, lastName } = splitAdminPanelUserFullName(
    initialUser?.fullName
  )

  useEffect(() => {
    if (!state.success) {
      return
    }

    toast.show(TOAST_ADMIN_MESSAGES.UPDATE_USER_SUCCESS, {
      name: formatAdminPanelPersonName(
        submittedUserRef.current.name || firstName || 'Usuario'
      ),
      surname: formatAdminPanelPersonName(
        submittedUserRef.current.surname || lastName
      )
    })

    formRef.current?.reset()
    onClose()
    router.refresh()
  }, [firstName, lastName, onClose, router, state.success])

  const handleEmailChange = () => {
    if (emailError) {
      setEmailError(null)
    }
  }

  const handleSubmitCapture = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('correo') ?? '')
    const newPassword = String(formData.get('nuevaContrasena') ?? '')
    const confirmPassword = String(formData.get('confirmarContrasena') ?? '')
    const domainError = getEmailDomainError(email)

    if (domainError) {
      event.preventDefault()
      setEmailError(domainError)
      setConfirmPasswordError(null)
      setValidationError(null)
      return
    }

    if ((newPassword || confirmPassword) && confirmPassword !== newPassword) {
      event.preventDefault()
      setEmailError(null)
      setConfirmPasswordError('Las contraseñas no coinciden.')
      setValidationError(null)
      return
    }

    if (newPassword && newPassword.length <= 8) {
      event.preventDefault()
      setEmailError(null)
      setConfirmPasswordError(null)
      setValidationError('Las contraseñas deben tener más de 8 caracteres.')
      return
    }

    setEmailError(null)
    setConfirmPasswordError(null)
    setValidationError(null)
    submittedUserRef.current = {
      name: String(formData.get('nombre') ?? '').trim(),
      surname: String(formData.get('apellido') ?? '').trim()
    }
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
    handleSubmitCapture,
    handlePasswordChange,
    handleConfirmPasswordChange,
    defaultValues: {
      firstName,
      lastName,
      email: initialUser?.email ?? '',
      roleLabel: initialUser?.roleLabel ?? roleOptions[0] ?? ''
    }
  }
}
