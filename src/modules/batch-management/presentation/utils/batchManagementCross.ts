import type {
  IBatchAvailableCrosses,
  IBatchCrossExecutionPayload,
  IBatchCrossFilters,
  IBatchCrossSectionFilters
} from '../../data/models/BatchManagement'
import {
  BATCH_CROSS_OPTIONS_BY_LABEL,
  EMPTY_EXECUTABLE_CROSS_MESSAGE
} from '../constants'
import {
  buildAnnualCrossPeriod,
  buildMonthlyCrossPeriod
} from './batchCrossPeriods'

const SUPPORTED_BATCH_CROSS_CONFIG_BY_CODE = {
  'desvio-bi-convenio-multilateral': {
    label: 'Control de desvio de BI - Regimen CM',
    parameters: {
      jurisdiccion: '910',
      jurisdiccionesExcluidasTotalIngresos: '923'
    }
  }
} as const

function getCurrentBatchCrossDate() {
  const currentDate = new Date()

  return {
    currentYear: String(currentDate.getFullYear()),
    currentMonth: String(currentDate.getMonth() + 1).padStart(2, '0')
  }
}

export function createDefaultCrossSection(
  type: 'monthly' | 'annual'
): IBatchCrossSectionFilters {
  const { currentMonth, currentYear } = getCurrentBatchCrossDate()

  return {
    isOpen: false,
    fromYear: currentYear,
    toYear: currentYear,
    fromMonth: type === 'monthly' ? currentMonth : null,
    toMonth: type === 'monthly' ? currentMonth : null,
    crossTypes: []
  }
}

export function createDefaultBatchCrossFilters(): IBatchCrossFilters {
  return {
    monthly: createDefaultCrossSection('monthly'),
    annual: createDefaultCrossSection('annual')
  }
}

export function getBatchCrossOption(crossType: string) {
  return BATCH_CROSS_OPTIONS_BY_LABEL[
    crossType as keyof typeof BATCH_CROSS_OPTIONS_BY_LABEL
  ] ?? null
}

function getExecutableBatchCrossOption(
  crossType: string,
  availableCrosses: IBatchAvailableCrosses
) {
  const availableCross = availableCrosses.find((cross) => {
    const supportedConfig =
      SUPPORTED_BATCH_CROSS_CONFIG_BY_CODE[
        cross.publicCode as keyof typeof SUPPORTED_BATCH_CROSS_CONFIG_BY_CODE
      ]

    return supportedConfig?.label === crossType || cross.label === crossType
  })

  if (availableCross && availableCross.publicCode in SUPPORTED_BATCH_CROSS_CONFIG_BY_CODE) {
    const supportedConfig =
      SUPPORTED_BATCH_CROSS_CONFIG_BY_CODE[
        availableCross.publicCode as keyof typeof SUPPORTED_BATCH_CROSS_CONFIG_BY_CODE
      ]

    return {
      publicCode: availableCross.publicCode,
      version: availableCross.version,
      parameters: supportedConfig.parameters
    }
  }

  return BATCH_CROSS_OPTIONS_BY_LABEL[
    crossType as keyof typeof BATCH_CROSS_OPTIONS_BY_LABEL
  ] ?? null
}

export function getBatchCrossOptionLabels(
  availableCrosses: IBatchAvailableCrosses,
  periodicity: 'monthly' | 'annual'
) {
  return Array.from(
    new Set(
      availableCrosses
        .filter((cross) => cross.periodicity === periodicity)
        .map<string | null>((cross) => {
          const supportedConfig =
            SUPPORTED_BATCH_CROSS_CONFIG_BY_CODE[
              cross.publicCode as keyof typeof SUPPORTED_BATCH_CROSS_CONFIG_BY_CODE
            ]

          return supportedConfig?.label ?? null
        })
        .filter((label): label is string => Boolean(label))
    )
  )
}

export function createBatchCrossYearOptions() {
  const currentYear = Number(getCurrentBatchCrossDate().currentYear)

  return Array.from({ length: 6 }, (_, index) => String(currentYear - 5 + index))
}

export function buildBatchCrossExecutionPayloads(
  batchId: string,
  filters: IBatchCrossFilters,
  availableCrosses: IBatchAvailableCrosses = []
): IBatchCrossExecutionPayload[] {
  const { currentMonth } = getCurrentBatchCrossDate()
  const monthlyPeriod = buildMonthlyCrossPeriod(filters.monthly, currentMonth)
  const annualPeriod = buildAnnualCrossPeriod(filters.annual)

  return [
    ...filters.monthly.crossTypes.map((crossType) => ({
      crossType,
      ...monthlyPeriod
    })),
    ...filters.annual.crossTypes.map((crossType) => ({
      crossType,
      ...annualPeriod
    }))
  ].reduce<IBatchCrossExecutionPayload[]>((payloads, selection) => {
    const option = getExecutableBatchCrossOption(
      selection.crossType,
      availableCrosses
    )

    if (!option || !('publicCode' in option)) {
      return payloads
    }

    payloads.push({
      batchId,
      crossCode: option.publicCode,
      crossVersion: option.version,
      periodFrom: selection.periodFrom,
      periodTo: selection.periodTo,
      parameters: option.parameters
    })

    return payloads
  }, [])
}

export function getBatchCrossValidationMessage(filters: IBatchCrossFilters) {
  const monthlyFrom = Number(
    `${filters.monthly.fromYear}${filters.monthly.fromMonth ?? '01'}`
  )
  const monthlyTo = Number(
    `${filters.monthly.toYear}${filters.monthly.toMonth ?? '01'}`
  )
  const annualFrom = Number(filters.annual.fromYear)
  const annualTo = Number(filters.annual.toYear)

  if (
    filters.monthly.crossTypes.length &&
    filters.monthly.fromMonth &&
    filters.monthly.toMonth &&
    monthlyFrom > monthlyTo
  ) {
    return 'Debes especificar un rango válido para realizar el cruce'
  }

  if (filters.annual.crossTypes.length && annualFrom > annualTo) {
    return 'Debes especificar un rango válido para realizar el cruce'
  }

  return null
}

export function hasExecutableBatchCrosses(
  batchId: string,
  filters: IBatchCrossFilters,
  availableCrosses: IBatchAvailableCrosses = []
) {
  return buildBatchCrossExecutionPayloads(
    batchId,
    filters,
    availableCrosses
  ).length > 0
}

export function getEmptyExecutableBatchCrossMessage(
  availableCrosses: IBatchAvailableCrosses = []
) {
  const optionLabels = availableCrosses
    .map<string | null>((cross) => {
      const supportedConfig =
        SUPPORTED_BATCH_CROSS_CONFIG_BY_CODE[
          cross.publicCode as keyof typeof SUPPORTED_BATCH_CROSS_CONFIG_BY_CODE
        ]

      return supportedConfig?.label ?? null
    })
    .filter((label): label is string => Boolean(label))

  if (!optionLabels.length) {
    return EMPTY_EXECUTABLE_CROSS_MESSAGE
  }

  return `Seleccioná un cruce disponible: ${optionLabels.join(', ')}.`
}
