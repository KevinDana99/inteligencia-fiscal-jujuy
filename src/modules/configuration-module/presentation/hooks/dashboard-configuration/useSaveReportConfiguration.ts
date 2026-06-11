'use client'

import { useCallback, useTransition } from 'react'
import { updateReportConfigurationAction } from '../../../data/actions/commands'
import { useConfig } from '../useConfig'

type UseSaveReportConfigurationParams = {
  onSuccess?: () => void
}

export function useSaveReportConfiguration({
  onSuccess
}: UseSaveReportConfigurationParams = {}) {
  const { configuration } = useConfig()
  const [isSavePending, startSaveTransition] = useTransition()

  const saveReportConfiguration = useCallback(() => {
    const plantillaId = configuration.informe.id

    if (!plantillaId) {
      return
    }

    startSaveTransition(() => {
      void (async () => {
        const result = await updateReportConfigurationAction(
          plantillaId,
          configuration.informe
        )

        if (!result.success) {
          return
        }

        onSuccess?.()
      })()
    })
  }, [configuration.informe, onSuccess])

  return {
    isSavePending,
    saveReportConfiguration
  }
}
