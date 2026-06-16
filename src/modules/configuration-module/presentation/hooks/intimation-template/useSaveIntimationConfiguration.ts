'use client'

import { useCallback, useTransition } from 'react'
import { updateIntimationConfigurationAction } from '../../../data/actions/commands'
import { useConfig } from '../useConfig'

type UseSaveIntimationConfigurationParams = {
  onSuccess?: () => void
}

type SaveIntimationConfigurationOptions = {
  allowedColumns?: boolean
}

export function useSaveIntimationConfiguration({
  onSuccess
}: UseSaveIntimationConfigurationParams = {}) {
  const { configuration } = useConfig()
  const [isSavePending, startSaveTransition] = useTransition()

  const saveIntimationConfiguration = useCallback(
    ({ allowedColumns = true }: SaveIntimationConfigurationOptions = {}) => {
      const plantillaId = configuration.intimacion.id

      if (!plantillaId) {
        return
      }

      startSaveTransition(() => {
        void (async () => {
          const result = await updateIntimationConfigurationAction(
            plantillaId,
            configuration.intimacion,
            { allowedColumns }
          )

          if (!result.success) {
            return
          }

          onSuccess?.()
        })()
      })
    },
    [configuration.intimacion, onSuccess]
  )

  return {
    isSavePending,
    saveIntimationConfiguration
  }
}
