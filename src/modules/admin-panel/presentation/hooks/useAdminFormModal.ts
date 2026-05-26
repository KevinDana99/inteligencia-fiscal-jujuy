'use client'
import { useMemo, useState } from 'react'
import { useAdminConfig } from '../contexts'
import {
  IAdminPanelCreateUserInput,
  IAdminPanelUpdateUserInput,
  IAdminPanelUser
} from '../../types'

const useAdminFormModal = (
  onSubmit: (
    payload: IAdminPanelCreateUserInput | IAdminPanelUpdateUserInput
  ) => Promise<boolean>,
  roleOptions: string[],
  initialUser?: IAdminPanelUser | null
) => {
  function getPasswordStrength(password: string) {
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ]

    return checks.filter(Boolean).length
  }

  const { isEmailAllowed } = useAdminConfig()
  const [firstName, setFirstName] = useState(
    initialUser?.fullName?.split(' ')[0] ?? ''
  )
  const [lastName, setLastName] = useState(
    initialUser?.fullName?.split(' ').slice(1).join(' ') ?? ''
  )
  const [email, setEmail] = useState(initialUser?.email ?? '')
  const [roleLabel, setRoleLabel] = useState(
    initialUser?.roleLabel ?? roleOptions[0] ?? ''
  )
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password]
  )
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

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {}

    if (!firstName.trim()) {
      nextErrors.firstName = 'El nombre es obligatorio.'
    }

    if (!lastName.trim()) {
      nextErrors.lastName = 'El apellido es obligatorio.'
    }

    if (!email.trim()) {
      nextErrors.email = 'El email es obligatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Ingresá un email válido.'
    } else if (!isEmailAllowed(email.trim())) {
      nextErrors.email = 'El dominio del email no está permitido.'
    }

    if (!roleLabel.trim()) {
      nextErrors.roleLabel = 'Seleccioná un cargo.'
    }

    const requiresPassword = !initialUser
    const hasPasswordValue = password.trim().length > 0

    if ((requiresPassword || hasPasswordValue) && password.trim().length < 8) {
      nextErrors.password = 'Mínimo 8 caracteres.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    if (initialUser) {
      await onSubmit({
        id: initialUser.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
        roleLabel,
        password
      })
      return
    }

    await onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      roleLabel,
      password
    })
  }

  return {
    handleSubmit,
    getPasswordStrength,
    setEmail,
    setErrors,
    setFirstName,
    setLastName,
    setPassword,
    setRoleLabel,
    password,
    email,
    lastName,
    firstName,
    roleLabel,
    passwordStrength,
    errors,
    passwordColor
  }
}

export default useAdminFormModal
