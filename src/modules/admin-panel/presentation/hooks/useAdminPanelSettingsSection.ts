import { useState } from 'react'
import { useAdminConfig } from '../contexts'

export const useAdminPanelSettingsSection = () => {
  const { adminConfig, addWhitelistDomain, removeWhitelistDomain } =
    useAdminConfig()
  const [domainValue, setDomainValue] = useState('')
  const [domainError, setDomainError] = useState<string | null>(null)

  const handleAddDomain = () => {
    const normalizedDomain = domainValue.trim().toLowerCase()

    if (!normalizedDomain) {
      setDomainError('Ingresá un dominio.')
      return
    }

    if (!normalizedDomain.includes('@')) {
      setDomainError('El dominio debe incluir @.')
      return
    }

    const wasAdded = addWhitelistDomain(normalizedDomain)

    if (!wasAdded) {
      setDomainError('Ese dominio ya está configurado.')
      return
    }

    setDomainValue('')
    setDomainError(null)
  }

  const handleChangeDomain = (value: string) => {
    setDomainValue(value)
    if (domainError) {
      setDomainError(null)
    }
  }
  return {
    adminConfig,
    addWhitelistDomain,
    removeWhitelistDomain,
    handleAddDomain,
    domainValue,
    domainError,
    handleChangeDomain
  }
}
