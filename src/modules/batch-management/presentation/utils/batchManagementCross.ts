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

const BATCH_CROSS_EXECUTION_CONFIG_BY_CODE = {
  'cruce-bi-papel': {
    parameters: {
      jurisdiccion: '910',
      umbralAnalisisDeudaTotal: '1',
      jurisdiccionesExcluidasTotalIngresos: '923'
    }
  },
  'desvio-bi-convenio-multilateral': {
    parameters: {
      jurisdiccion: '910',
      jurisdiccionesExcluidasTotalIngresos: '923'
    }
  }
} as const

function getBatchCrossExecutionConfig(publicCode: string) {
  return (
    BATCH_CROSS_EXECUTION_CONFIG_BY_CODE[
      publicCode as keyof typeof BATCH_CROSS_EXECUTION_CONFIG_BY_CODE
    ] ?? null
  )
}

function getBatchCrossDisplayLabel(
  cross: IBatchAvailableCrosses[number]
): string {
  return cross.label
}

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
    return (
      getBatchCrossDisplayLabel(cross) === crossType ||
      cross.label === crossType ||
      cross.publicCode === crossType
    )
  })

  if (availableCross) {
    const executionConfig = getBatchCrossExecutionConfig(availableCross.publicCode)

    return {
      publicCode: availableCross.publicCode,
      version: availableCross.version,
      parameters: executionConfig?.parameters
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
        .map(getBatchCrossDisplayLabel)
        .filter((label) => Boolean(label.trim()))
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

    const payload: IBatchCrossExecutionPayload = {
      batchId,
      crossCode: option.publicCode,
      crossVersion: option.version,
      periodFrom: selection.periodFrom,
      periodTo: selection.periodTo
    }

    if (option.parameters) {
      payload.parameters = option.parameters
    }

    payloads.push(payload)

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
  const optionLabels = Array.from(
    new Set(
      availableCrosses
        .map(getBatchCrossDisplayLabel)
        .filter((label) => Boolean(label.trim()))
    )
  )

  if (!optionLabels.length) {
    return EMPTY_EXECUTABLE_CROSS_MESSAGE
  }

  return `Seleccioná un cruce disponible: ${optionLabels.join(', ')}.`
}
