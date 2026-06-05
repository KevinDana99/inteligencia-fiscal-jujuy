'use client'

import { useCallback, useMemo, useState } from 'react'
import { useConfig } from '../../contexts'

export type IntimationTemplateColumn = {
  id: string
  value: string
}

type IntimationTemplateColumnOption = {
  id: string
  label: string
}

export type IntimationTemplateState = {
  asunto: string
  saludo: string
  cuerpo: string
  fuenteInformacion: string
  fechaCorte: string
  columnas: IntimationTemplateColumn[]
}

export const INTIMATION_COLUMN_OPTIONS: IntimationTemplateColumnOption[] = [
  { id: 'anio', label: 'AÑO' },
  {
    id: 'base_imponible_ingresos_brutos',
    label: 'Base Imponible Ingresos Brutos'
  },
  {
    id: 'base_imponible_informada_por_terceros',
    label: 'Base Imponible Informada por Terceros (*)'
  },
  {
    id: 'diferencia_de_base_imponible',
    label: 'Diferencia de Base Imponible'
  },
  { id: 'fact_arca_fecha', label: 'Fact. ARCA (fecha)' },
  { id: 'est_final', label: 'EST. FINAL' },
  { id: 'ag_percepcion', label: 'Ag. Percepción' },
  { id: 'fact_arca_anio', label: 'Fact. ARCA (año)' },
  { id: 'imp_presuntivo', label: 'Imp. Presuntivo' },
  { id: 'ag_retencion', label: 'Ag. Retención' },
  { id: 'pago_a_cta', label: 'Pago a Cta.' },
  { id: 'mes', label: 'Mes' },
  { id: 'cierre_ej', label: 'Cierre Ej.' },
  { id: 'tot_ing_pais', label: 'Tot. Ing. País' },
  { id: 'ci_decl', label: 'CI Decl.' },
  { id: 'tot_egr', label: 'Tot. Egr.' },
  { id: 'coef_egr', label: 'Coef. Egr.' },
  { id: 'nuevo_ci', label: 'Nuevo CI' },
  { id: 'cu_decl', label: 'CU Decl.' },
  { id: 'ncu', label: 'NCU' },
  { id: 'bi_total_pais', label: 'BI Total País' },
  { id: 'bi_estimada', label: 'BI Estimada' },
  { id: 'bi_decl_cm03', label: 'BI Decl. CM03' },
  { id: 'alicuota', label: 'Alícuota' },
  { id: 'dif_creditos', label: 'Dif. Créditos' },
  { id: 'saf', label: 'SAF' }
]

const COLUMN_LABELS = new Map(
  INTIMATION_COLUMN_OPTIONS.map((option) => [option.id, option.label])
)

function getColumnLabel(columnId: string): string {
  const knownLabel = COLUMN_LABELS.get(columnId)

  if (knownLabel) {
    return knownLabel
  }

  return columnId
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export const DEFAULT_INTIMATION_TEMPLATE_STATE: IntimationTemplateState = {
  asunto: 'PRESUNTA DIFERENCIA DE BASE IMPONIBLE',
  saludo: 'Señor Contribuyente:',
  cuerpo:
    'Por medio de la presente, la Dirección Provincial de Rentas de Jujuy pone en su conocimiento que sobre la base de información cierta, derivada del cruce de bases de datos con el organismo recaudador nacional (ARCA) y los agentes de recaudación designados por este organismo, se han detectado inconsistencias en sus declaraciones juradas y en el cumplimiento de sus obligaciones fiscales en los periodos que se detallan en planilla adjunta.\n\nPor ello, y en uso de las facultades conferidas a este organismo por el art. 10º inc. 3 del Código Fiscal, Ley Nro. 5791/2013, se lo intima para que en el término de diez (10) días proceda a presentar las declaraciones juradas originales o rectificativas, e ingrese el impuesto omitido más los intereses a la fecha del efectivo pago.\n\nEn caso de no regularizar su situación fiscal, la Dirección podrá dar inicio a una verificación integral, perdiendo Ud. el beneficio del cumplimiento voluntario debiendo abonar además del tributo las sanciones previstas en los artículos 48° y 49º del Código Fiscal (Ley 5791/2013), sin perjuicio de dar inicio al procedimiento de determinación de oficio en los términos del artículo 37° del mencionado plexo normativo.\n\nPara dar cumplimiento a esta intimación podrá comunicarse con el Departamento Inteligencia Fiscal al siguiente correo electrónico: inteligenciafiscal@rentasjujuy.gob.ar o al Centro de Atención 0800-555-5599 en el horario de 07:30 a 12:30 o personalmente en Lavalle 55 - San Salvador de Jujuy - de Lunes a Viernes en el horario de 07:30 a 12:30.',
  fuenteInformacion: '',
  fechaCorte: 'Fecha de corte 11/2025.',
  columnas: [
    { id: 'anio', value: 'AÑO' },
    {
      id: 'base_imponible_ingresos_brutos',
      value: 'Base Imponible Ingresos Brutos'
    },
    {
      id: 'base_imponible_informada_por_terceros',
      value: 'Base Imponible Informada por Terceros (*)'
    },
    {
      id: 'diferencia_de_base_imponible',
      value: 'Diferencia de Base Imponible'
    }
  ]
}

function cloneState(
  state: IntimationTemplateState = DEFAULT_INTIMATION_TEMPLATE_STATE
): IntimationTemplateState {
  return {
    ...state,
    columnas: state.columnas.map((column) => ({ ...column }))
  }
}

export function useIntimationTemplate(
  initialState?: IntimationTemplateState
) {
  const { configuration, updateConfig } = useConfig()
  const [fallbackState, setFallbackState] = useState<IntimationTemplateState>(() =>
    cloneState(initialState)
  )
  const [columnPickerOpened, setColumnPickerOpened] = useState(false)
  const [selectedAvailableColumnId, setSelectedAvailableColumnId] = useState<
    string | null
  >(null)
  const [selectedVisibleColumnId, setSelectedVisibleColumnId] = useState<
    string | null
  >(null)
  const [columnPickerDraft, setColumnPickerDraft] = useState<
    IntimationTemplateColumn[]
  >(() => cloneState(initialState).columnas)

  const isProviderBacked = Boolean(configuration)

  const state = useMemo<IntimationTemplateState>(() => {
    if (!configuration) {
      return fallbackState
    }

    return {
      asunto: configuration.configuracion.intimacion.asunto,
      saludo: configuration.configuracion.intimacion.saludo,
      cuerpo: configuration.configuracion.intimacion.cuerpo,
      fuenteInformacion:
        configuration.configuracion.intimacion.fuente_informacion ?? '',
      fechaCorte: configuration.configuracion.intimacion.pie,
      columnas:
        configuration.configuracion.intimacion.columnas_seleccionadas.map(
          (columnId) => ({
            id: columnId,
            value: getColumnLabel(columnId)
          })
        )
    }
  }, [configuration, fallbackState])

  const updateField = useCallback(
    (field: keyof IntimationTemplateState, value: string) => {
      if (!configuration) {
        setFallbackState((current) => ({
          ...current,
          [field]: value
        }))
        return
      }

      switch (field) {
        case 'asunto':
        case 'saludo':
        case 'cuerpo':
          updateConfig({
            configuracion: {
              intimacion: {
                [field]: value
              }
            }
          })
          return
        case 'fuenteInformacion':
          updateConfig({
            configuracion: {
              intimacion: {
                fuente_informacion: value
              }
            }
          })
          return
        case 'fechaCorte':
          updateConfig({
            configuracion: {
              intimacion: {
                pie: value
              }
            }
          })
          return
        default:
          return
      }
    },
    [configuration, updateConfig]
  )

  const openColumnPicker = useCallback(() => {
    setColumnPickerDraft(state.columnas.map((column) => ({ ...column })))
    setSelectedAvailableColumnId(null)
    setSelectedVisibleColumnId(null)
    setColumnPickerOpened(true)
  }, [state.columnas])

  const closeColumnPicker = useCallback(() => {
    setColumnPickerOpened(false)
    setColumnPickerDraft(state.columnas.map((column) => ({ ...column })))
    setSelectedAvailableColumnId(null)
    setSelectedVisibleColumnId(null)
  }, [state.columnas])

  const confirmColumnPicker = useCallback(() => {
    if (!configuration) {
      setFallbackState((current) => ({
        ...current,
        columnas: columnPickerDraft.map((column) => ({ ...column }))
      }))
    } else {
      updateConfig({
        configuracion: {
          intimacion: {
            columnas_seleccionadas: columnPickerDraft.map((column) => column.id)
          }
        }
      })
    }

    setColumnPickerOpened(false)
    setSelectedAvailableColumnId(null)
    setSelectedVisibleColumnId(null)
  }, [columnPickerDraft, configuration, updateConfig])

  const selectAvailableColumn = useCallback((optionId: string) => {
    setSelectedAvailableColumnId(optionId)
    setSelectedVisibleColumnId(null)
  }, [])

  const selectVisibleColumn = useCallback((columnId: string) => {
    setSelectedVisibleColumnId(columnId)
    setSelectedAvailableColumnId(null)
  }, [])

  const addSelectedColumn = useCallback(() => {
    if (!selectedAvailableColumnId) {
      return
    }

    const option = INTIMATION_COLUMN_OPTIONS.find(
      (item) => item.id === selectedAvailableColumnId
    )

    if (!option) {
      return
    }

    setColumnPickerDraft((current) => {
      if (current.some((column) => column.id === option.id)) {
        return current
      }

      return [
        ...current,
        {
          id: option.id,
          value: option.label
        }
      ]
    })
    setSelectedAvailableColumnId(null)
  }, [selectedAvailableColumnId])

  const removeSelectedColumn = useCallback(() => {
    if (!selectedVisibleColumnId) {
      return
    }

    setColumnPickerDraft((current) =>
      current.filter((column) => column.id !== selectedVisibleColumnId)
    )
    setSelectedVisibleColumnId(null)
  }, [selectedVisibleColumnId])

  const updateColumn = useCallback(
    (columnId: string, value: string) => {
      if (configuration) {
        return
      }

      setFallbackState((current) => ({
        ...current,
        columnas: current.columnas.map((column) =>
          column.id === columnId ? { ...column, value } : column
        )
      }))
    },
    [configuration]
  )

  const removeColumn = useCallback(
    (columnId: string) => {
      if (!configuration) {
        setFallbackState((current) => ({
          ...current,
          columnas: current.columnas.filter((column) => column.id !== columnId)
        }))
        return
      }

      updateConfig({
        configuracion: {
          intimacion: {
            columnas_seleccionadas: state.columnas
              .filter((column) => column.id !== columnId)
              .map((column) => column.id)
          }
        }
      })
    },
    [configuration, state.columnas, updateConfig]
  )

  const visibleColumns = useMemo(() => state.columnas, [state.columnas])

  const availableColumns = useMemo(
    () =>
      INTIMATION_COLUMN_OPTIONS.filter(
        (option) => !columnPickerDraft.some((column) => column.id === option.id)
      ),
    [columnPickerDraft]
  )

  return {
    state,
    isProviderBacked,
    columnPickerOpened,
    columnPickerDraft,
    selectedAvailableColumnId,
    selectedVisibleColumnId,
    availableColumns,
    visibleColumns,
    updateField,
    openColumnPicker,
    closeColumnPicker,
    confirmColumnPicker,
    selectAvailableColumn,
    selectVisibleColumn,
    addSelectedColumn,
    removeSelectedColumn,
    updateColumn,
    removeColumn
  }
}

export type IntimationTemplateController = ReturnType<
  typeof useIntimationTemplate
>
