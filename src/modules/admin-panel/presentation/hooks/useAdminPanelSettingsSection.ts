'use client'

import {
  useCallback,
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition
} from 'react'
import { useRouter } from 'next/navigation'
import { TOAST_ADMIN_MESSAGES, toast } from '@/components/core/toasts'
import {
  addAllowedDomainAction,
  deleteAllowedDomainAction
} from '../../data/actions'
import { useAdminPanelConfigContext } from '../contexts'
import { INITIAL_ADD_ALLOWED_DOMAIN_STATE } from './mutations/addAllowedDomainState'

export const useAdminPanelSettingsSection = () => {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const submittedDomainRef = useRef('')
  const { allowedDomains } = useAdminPanelConfigContext()
  const [hideAddError, setHideAddError] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [addDomainState, formAction, isSubmitting] = useActionState(
    addAllowedDomainAction,
    INITIAL_ADD_ALLOWED_DOMAIN_STATE
  )
  const [isRemoving, startTransition] = useTransition()

  useEffect(() => {
    if (addDomainState.success) {
      const formattedSubmittedDomain = submittedDomainRef.current
        ? `@${submittedDomainRef.current.replace(/^@/, '')}`
        : ''

      toast.show(TOAST_ADMIN_MESSAGES.ADD_DOMAIN_SUCCESS, {
        domain: formattedSubmittedDomain
      })
      formRef.current?.reset()
      router.refresh()
    }
  }, [addDomainState, router])

  const handleChangeDomain = useCallback(() => {
    setHideAddError(true)
    if (deleteError) {
      setDeleteError(null)
    }
  }, [deleteError])

  const handleAddDomainSubmit = useCallback(() => {
    setHideAddError(false)
    if (deleteError) {
      setDeleteError(null)
    }
    const formData = formRef.current ? new FormData(formRef.current) : null
    submittedDomainRef.current = String(formData?.get('dominio') ?? '')
      .trim()
      .toLowerCase()
      .replace(/^@/, '')
  }, [deleteError])

  const handleRemoveDomain = useCallback((domainId: number) => {
    const domainToRemove =
      allowedDomains.find((domain) => domain.id === domainId)?.domain ?? ''
    const formattedDomainToRemove = domainToRemove
      ? `@${domainToRemove.replace(/^@/, '')}`
      : ''

    startTransition(() => {
      void deleteAllowedDomainAction(domainId)
        .then((result) => {
          if (!result.success) {
            setDeleteError(
              result.error ?? 'No fue posible eliminar el dominio.'
            )
            return
          }

          setDeleteError(null)
          toast.show(TOAST_ADMIN_MESSAGES.DELETE_DOMAIN_INFO, {
            domain: formattedDomainToRemove
          })
          router.refresh()
        })
        .catch(() => {
          setDeleteError('No fue posible eliminar el dominio.')
        })
    })
  }, [allowedDomains, router])

  const domainError =
    deleteError ?? (!hideAddError && !isSubmitting ? addDomainState.message : null)

  return {
    allowedDomains,
    formRef,
    handleRemoveDomain,
    domainError,
    handleChangeDomain,
    handleAddDomainSubmit,
    formAction,
    isPending: isSubmitting || isRemoving
  }
}
