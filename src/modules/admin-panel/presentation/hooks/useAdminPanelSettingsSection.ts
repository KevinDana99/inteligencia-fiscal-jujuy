import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { IAdminAllowedDomains } from '../../data/models/AdminPanel'
import {
  addAllowedDomainAction,
  deleteAllowedDomainAction
} from '../../data/actions'

export const useAdminPanelSettingsSection = (
  allowedDomains: IAdminAllowedDomains
) => {
  const router = useRouter()
  const [domainValue, setDomainValue] = useState('')
  const [domainError, setDomainError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleAddDomain = () => {
    const normalizedDomain = domainValue.trim().toLowerCase().replace(/^@/, '')

    startTransition(() => {
      void addAllowedDomainAction(normalizedDomain).then((result) => {
        if (!result.success) {
          setDomainError(result.error ?? 'No fue posible agregar el dominio.')
          return
        }

        setDomainValue('')
        setDomainError(null)
        router.refresh()
      })
    })
  }

  const handleChangeDomain = (value: string) => {
    setDomainValue(value)
    if (domainError) {
      setDomainError(null)
    }
  }

  const handleRemoveDomain = (domainId: number) => {
    startTransition(() => {
      void deleteAllowedDomainAction(domainId).then((result) => {
        if (!result.success) {
          setDomainError(result.error ?? 'No fue posible eliminar el dominio.')
          return
        }

        setDomainError(null)
        router.refresh()
      })
    })
  }

  return {
    allowedDomains,
    handleAddDomain,
    handleRemoveDomain,
    domainValue,
    domainError,
    handleChangeDomain,
    isPending
  }
}
