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
import {
  addAllowedDomainAction,
  deleteAllowedDomainAction
} from '../../data/actions'
import { useAdminPanelConfigContext } from '../contexts'
import { INITIAL_ADD_ALLOWED_DOMAIN_STATE } from './mutations/addAllowedDomainState'

export const useAdminPanelSettingsSection = () => {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
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
      formRef.current?.reset()
      router.refresh()
    }
  }, [addDomainState.success, router])

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
  }, [deleteError])

  const handleRemoveDomain = useCallback((domainId: number) => {
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
          router.refresh()
        })
        .catch(() => {
          setDeleteError('No fue posible eliminar el dominio.')
        })
    })
  }, [router])

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
