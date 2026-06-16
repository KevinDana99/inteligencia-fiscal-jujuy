'use client'

import { useRouter } from 'next/navigation'
import {
  BATCH_CROSS_MONTH_OPTIONS,
  BATCH_CROSS_SELECT_COMBOBOX_PROPS
} from '../../../constants'
import type {
  IBatchAvailableCrosses,
  IBatchCrossFilters
} from '../../../../data/models/BatchManagement'
import {
  createBatchCrossYearOptions,
  getBatchCrossOptionLabels
} from '../../../utils'

type BatchManagementCrossMenuController = {
  batchId: string
  availableCrosses: IBatchAvailableCrosses
  filters: IBatchCrossFilters
  validationMessage: string | null
  executionError: string | null
  canConfirm: boolean
  isExecuting: boolean
  onSectionToggle: (batchId: string, section: keyof IBatchCrossFilters) => void
  onYearChange: (
    batchId: string,
    section: keyof IBatchCrossFilters,
    field: 'fromYear' | 'toYear',
    value: string | null
  ) => void
  onMonthChange: (
    batchId: string,
    field: 'fromMonth' | 'toMonth',
    value: string | null
  ) => void
  onCrossTypeToggle: (
    batchId: string,
    section: keyof IBatchCrossFilters,
    crossType: string
  ) => void
  onConfirm: (batchId: string) => Promise<boolean>
  navigateOnConfirm?: boolean
  onConfirmed?: () => void
}

export function useBatchManagementCrossMenu(
  controller: BatchManagementCrossMenuController
) {
  const router = useRouter()
  const yearOptions = createBatchCrossYearOptions()
  const monthlyOptionLabels = getBatchCrossOptionLabels(
    controller.availableCrosses,
    'monthly'
  )
  const annualOptionLabels = getBatchCrossOptionLabels(
    controller.availableCrosses,
    'annual'
  )

  async function handleConfirm() {
    const wasConfirmed = await controller.onConfirm(controller.batchId)

    if (wasConfirmed) {
      if (controller.navigateOnConfirm === false) {
        controller.onConfirmed?.()
        return
      }

      router.push(`/gestion-de-cruces?batchId=${controller.batchId}`)
    }
  }

  return {
    feedbackMessage: controller.validationMessage ?? controller.executionError,
    emptyMessage:
      monthlyOptionLabels.length || annualOptionLabels.length
        ? null
        : 'No hay cruces disponibles para ejecutar.',
    sections: [
      ...(monthlyOptionLabels.length
        ? [
            {
              key: 'monthly' as const,
              pillLabel: 'Mensual',
              title: 'Cruces mensuales',
              isOpen: controller.filters.monthly.isOpen,
              optionLabels: monthlyOptionLabels,
              periodTone: 'monthly' as const,
              fromMonth: {
                data: BATCH_CROSS_MONTH_OPTIONS,
                value: controller.filters.monthly.fromMonth,
                onChange: (value: string | null) =>
                  controller.onMonthChange(controller.batchId, 'fromMonth', value)
              },
              toMonth: {
                data: BATCH_CROSS_MONTH_OPTIONS,
                value: controller.filters.monthly.toMonth,
                onChange: (value: string | null) =>
                  controller.onMonthChange(controller.batchId, 'toMonth', value)
              },
              fromYear: {
                data: yearOptions,
                value: controller.filters.monthly.fromYear,
                onChange: (value: string | null) =>
                  controller.onYearChange(
                    controller.batchId,
                    'monthly',
                    'fromYear',
                    value
                  )
              },
              toYear: {
                data: yearOptions,
                value: controller.filters.monthly.toYear,
                onChange: (value: string | null) =>
                  controller.onYearChange(
                    controller.batchId,
                    'monthly',
                    'toYear',
                    value
                  )
              },
              selectedCrossTypes: controller.filters.monthly.crossTypes,
              onToggle: () => controller.onSectionToggle(controller.batchId, 'monthly'),
              onCrossTypeToggle: (crossType: string) =>
                controller.onCrossTypeToggle(
                  controller.batchId,
                  'monthly',
                  crossType
                )
            }
          ]
        : []),
      ...(annualOptionLabels.length
        ? [
            {
              key: 'annual' as const,
              pillLabel: 'Anual',
              title: 'Cruces anuales',
              isOpen: controller.filters.annual.isOpen,
              optionLabels: annualOptionLabels,
              periodTone: 'annual' as const,
              fromMonth: null,
              toMonth: null,
              fromYear: {
                data: yearOptions,
                value: controller.filters.annual.fromYear,
                onChange: (value: string | null) =>
                  controller.onYearChange(
                    controller.batchId,
                    'annual',
                    'fromYear',
                    value
                  )
              },
              toYear: {
                data: yearOptions,
                value: controller.filters.annual.toYear,
                onChange: (value: string | null) =>
                  controller.onYearChange(
                    controller.batchId,
                    'annual',
                    'toYear',
                    value
                  )
              },
              selectedCrossTypes: controller.filters.annual.crossTypes,
              onToggle: () => controller.onSectionToggle(controller.batchId, 'annual'),
              onCrossTypeToggle: (crossType: string) =>
                controller.onCrossTypeToggle(controller.batchId, 'annual', crossType)
            }
          ]
        : [])
    ],
    confirmButton: {
      disabled: !controller.canConfirm || controller.isExecuting,
      loading: controller.isExecuting,
      onClick: handleConfirm
    },
    comboboxProps: BATCH_CROSS_SELECT_COMBOBOX_PROPS
  }
}

export type BatchManagementCrossSectionController = ReturnType<
  typeof useBatchManagementCrossMenu
>['sections'][number]
