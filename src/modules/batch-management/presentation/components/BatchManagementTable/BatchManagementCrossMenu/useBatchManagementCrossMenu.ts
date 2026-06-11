'use client'

import { useRouter } from 'next/navigation'
import {
  ANNUAL_BATCH_CROSS_OPTIONS,
  BATCH_CROSS_MONTH_OPTIONS,
  BATCH_CROSS_SELECT_COMBOBOX_PROPS,
  MONTHLY_BATCH_CROSS_OPTIONS
} from '../../../constants'
import type { IBatchCrossFilters } from '../../../../data/models/BatchManagement'
import { createBatchCrossYearOptions } from '../../../utils'

type BatchManagementCrossMenuController = {
  batchId: string
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
}

export function useBatchManagementCrossMenu(
  controller: BatchManagementCrossMenuController
) {
  const router = useRouter()
  const yearOptions = createBatchCrossYearOptions()

  async function handleConfirm() {
    const wasConfirmed = await controller.onConfirm(controller.batchId)

    if (wasConfirmed) {
      router.push(`/gestion-de-cruces?batchId=${controller.batchId}`)
    }
  }

  return {
    feedbackMessage: controller.validationMessage ?? controller.executionError,
    sections: [
      ...(MONTHLY_BATCH_CROSS_OPTIONS.length
        ? [
            {
              key: 'monthly' as const,
              pillLabel: 'Mensual',
              title: 'Cruces mensuales',
              isOpen: controller.filters.monthly.isOpen,
              optionLabels: MONTHLY_BATCH_CROSS_OPTIONS,
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
      {
        key: 'annual' as const,
        pillLabel: 'Anual',
        title: 'Cruces anuales',
        isOpen: controller.filters.annual.isOpen,
        optionLabels: [...ANNUAL_BATCH_CROSS_OPTIONS],
        periodTone: 'annual' as const,
        fromMonth: null,
        toMonth: null,
        fromYear: {
          data: yearOptions,
          value: controller.filters.annual.fromYear,
          onChange: (value: string | null) =>
            controller.onYearChange(controller.batchId, 'annual', 'fromYear', value)
        },
        toYear: {
          data: yearOptions,
          value: controller.filters.annual.toYear,
          onChange: (value: string | null) =>
            controller.onYearChange(controller.batchId, 'annual', 'toYear', value)
        },
        selectedCrossTypes: controller.filters.annual.crossTypes,
        onToggle: () => controller.onSectionToggle(controller.batchId, 'annual'),
        onCrossTypeToggle: (crossType: string) =>
          controller.onCrossTypeToggle(controller.batchId, 'annual', crossType)
      }
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
