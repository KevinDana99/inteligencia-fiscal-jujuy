'use client'

import {
  useActionState,
  useEffect,
  useRef,
  useState
} from 'react'
import { useRouter } from 'next/navigation'
import { updateAdminUserAction } from '../../data/actions'
import { INITIAL_UPDATE_ADMIN_USER_STATE } from './mutations/updateAdminUserState'

export function useEditAdminUserFormModal(onClose: () => void) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
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
    setPasswordStrength(0)
    onClose()
    router.refresh()
  }, [onClose, router, state.success])

  const handlePasswordChange = (value: string) => {
    setPasswordStrength(getPasswordStrength(value))
  }

  return {
    formRef,
    passwordStrength,
    passwordColor,
    isPending,
    error: state.message,
    formAction,
    handlePasswordChange
  }
}
