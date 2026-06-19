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
import { createAdminUserAction } from '../../data/actions'
import { useAdminPanelConfigContext } from '../contexts'
import {
  getPasswordStrength,
  getPasswordStrengthColor
} from '../utils/adminPanelPassword'
import { formatAdminPanelPersonName } from '../utils/formatAdminPanelPersonName'
import { INITIAL_CREATE_ADMIN_USER_STATE } from './mutations/createAdminUserState'
import type { AdminPanelUserFormDefaultValues } from '../components/AdminPanelModals/AdminPanelUserFormFields'

export function useCreateAdminUserFormModal(
  onClose: () => void,
  roleOptions: string[]
) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const submittedUserRef = useRef({
    name: 'Usuario',
    surname: ''
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null)
  const [formValues, setFormValues] = useState<AdminPanelCreateUserFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    roleLabel: roleOptions[0] ?? '',
    password: '',
    confirmPassword: ''
  })
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

    toast.show(TOAST_ADMIN_MESSAGES.CREATE_USER_SUCCESS, {
      name: formatAdminPanelPersonName(
        state.data?.nombre?.trim() || submittedUserRef.current.name
      ),
      surname: formatAdminPanelPersonName(
        state.data?.apellido?.trim() || submittedUserRef.current.surname
      )
    })

    onClose()
    router.refresh()
  }, [onClose, router, state.data, state.success])

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFirstName = event.currentTarget.value

    setFormValues((currentValues) => ({
      ...currentValues,
      firstName: nextFirstName
    }))
  }

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextLastName = event.currentTarget.value

    setFormValues((currentValues) => ({
      ...currentValues,
      lastName: nextLastName
    }))
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextEmail = event.currentTarget.value

    setFormValues((currentValues) => ({
      ...currentValues,
      email: nextEmail
    }))

    if (emailError) {
      setEmailError(null)
    }
  }

  const handleRoleChange = (value: string | null) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      roleLabel: value ?? ''
    }))
  }

  const handleSubmitCapture = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget)
    const firstName = String(formData.get('nombre') ?? '').trim()
    const lastName = String(formData.get('apellido') ?? '').trim()
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
    submittedUserRef.current = {
      name: firstName || 'Usuario',
      surname: lastName
    }
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPassword = event.currentTarget.value

    setFormValues((currentValues) => ({
      ...currentValues,
      password: nextPassword
    }))

    if (validationError) {
      setValidationError(null)
    }
    if (confirmPasswordError) {
      setConfirmPasswordError(null)
    }
    setPasswordStrength(getPasswordStrength(nextPassword))
  }

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextConfirmPassword = event.currentTarget.value

    setFormValues((currentValues) => ({
      ...currentValues,
      confirmPassword: nextConfirmPassword
    }))

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
    formValues,
    handleFirstNameChange,
    handleLastNameChange,
    handleEmailChange,
    handleRoleChange,
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

interface AdminPanelCreateUserFormValues extends AdminPanelUserFormDefaultValues {
  password: string
  confirmPassword: string
}
