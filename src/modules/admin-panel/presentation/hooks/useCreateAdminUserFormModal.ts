'use client'

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent
} from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { createAdminUserAction } from '../../data/actions'
import { useAdminConfig } from '../contexts'
import { INITIAL_CREATE_ADMIN_USER_STATE } from './mutations/createAdminUserState'

const createUserFieldErrorsSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio.'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio.'),
  correo: z.email('El correo debe tener un formato válido.'),
  cargo: z.string().trim().min(1, 'Seleccioná un cargo.'),
  contrasena: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
})

type CreateUserFieldErrors = Partial<
  Record<'nombre' | 'apellido' | 'correo' | 'cargo' | 'contrasena', string>
>

export function useCreateAdminUserFormModal(onClose: () => void) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const { isEmailAllowed } = useAdminConfig()
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [fieldErrors, setFieldErrors] = useState<CreateUserFieldErrors>({})
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
    setFieldErrors({})
    setPasswordStrength(0)
    onClose()
    router.refresh()
  }, [onClose, router, state.success])

  const handleSubmitValidation = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget)
    const candidate = {
      nombre: String(formData.get('nombre') ?? ''),
      apellido: String(formData.get('apellido') ?? ''),
      correo: String(formData.get('correo') ?? '')
        .trim()
        .toLowerCase(),
      cargo: String(formData.get('cargo') ?? ''),
      contrasena: String(formData.get('contrasena') ?? '')
    }

    const validation = createUserFieldErrorsSchema.safeParse(candidate)

    if (!validation.success) {
      event.preventDefault()

      const nextFieldErrors: CreateUserFieldErrors = {}

      for (const issue of validation.error.issues) {
        const field = issue.path[0]

        if (typeof field === 'string' && !(field in nextFieldErrors)) {
          nextFieldErrors[field as keyof CreateUserFieldErrors] = issue.message
        }
      }

      setFieldErrors(nextFieldErrors)
      return
    }

    if (!isEmailAllowed(candidate.correo)) {
      event.preventDefault()
      setFieldErrors({
        correo: 'El dominio del correo no está permitido.'
      })
      return
    }

    setFieldErrors({})
  }

  const handlePasswordChange = (value: string) => {
    setPasswordStrength(getPasswordStrength(value))
    setFieldErrors((currentErrors) => {
      if (!currentErrors.contrasena) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors.contrasena
      return nextErrors
    })
  }

  const handleFieldInput = (
    field: keyof CreateUserFieldErrors,
    value?: string
  ) => {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[field]
      return nextErrors
    })

    if (field === 'contrasena') {
      handlePasswordChange(value ?? '')
    }
  }

  return {
    formRef,
    passwordStrength,
    passwordColor,
    isPending,
    error: state.message,
    fieldErrors,
    formAction,
    handleSubmitValidation,
    handleFieldInput
  }
}
