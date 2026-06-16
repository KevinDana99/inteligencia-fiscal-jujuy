import type { IntimationTemplateState } from '@/modules/configuration-module/presentation/hooks/intimation-template'
import type { ICrossPreviewPlanRow } from '../../data/models/CrossManagement'
import { buildIntimationDocumentPayload } from './intimationDocumentPayload'

const firstPlanillaRow: ICrossPreviewPlanRow = {
  id: '44292a56-7e66-48ac-84f0-5f35aa5ec46d',
  taxpayerId: '44292a56-7e66-48ac-84f0-5f35aa5ec46d',
  cuit: '30-50026913-4',
  businessName: 'VOLKSWAGEN S.A.',
  cells: [],
  values: {
    anio: '2.023',
    baseImponibleIngresosBrutos: '2.238.725.397',
    baseImponibleInformadaPorTerceros: '4.598.994.951',
    diferenciaBaseImponible: '2.360.269.554'
  }
}

const secondPlanillaRow: ICrossPreviewPlanRow = {
  ...firstPlanillaRow,
  id: '44292a56-7e66-48ac-84f0-5f35aa5ec46d-2024',
  values: {
    anio: '2.024',
    baseImponibleIngresosBrutos: '1.044.794.031',
    baseImponibleInformadaPorTerceros: '1.760.516.865',
    diferenciaBaseImponible: '715.722.834'
  }
}

const contributor = {
  ...firstPlanillaRow,
  planillaRows: [firstPlanillaRow, secondPlanillaRow]
}

const templateState: IntimationTemplateState = {
  asunto: 'PRESUNTA DIFERENCIA DE BASE IMPONIBLE',
  saludo: 'Senor Contribuyente:',
  cuerpo: 'Por medio de la presente...',
  fuenteInformacion: 'Facturacion de compras, ARCA, etc.',
  fechaCorte: 'Fecha de corte 11/2025.',
  columnas: [
    { id: 'anio', value: 'AÑO' },
    {
      id: 'baseImponibleIngresosBrutos',
      value: 'Base Imponible Ingresos Brutos'
    },
    {
      id: 'baseImponibleInformadaPorTerceros',
      value: 'Base Imponible Informada por Terceros (*)'
    },
    {
      id: 'diferenciaBaseImponible',
      value: 'Diferencia de Base Imponible'
    }
  ]
}

describe('buildIntimationDocumentPayload', () => {
  it('maps selected columns at request root and keeps spreadsheet rows aligned', () => {
    const payload = buildIntimationDocumentPayload({
      contributor,
      format: 'Pdf',
      templateState
    })

    expect(payload.contribuyente).toEqual({
      id: '44292a56-7e66-48ac-84f0-5f35aa5ec46d',
      cuit: '30-50026913-4',
      razonSocial: 'VOLKSWAGEN S.A.'
    })
    expect(payload.formato).toBe('Pdf')
    expect(payload.columnasSeleccionadas).toEqual([
      'anio',
      'baseImponibleIngresosBrutos',
      'baseImponibleInformadaPorTerceros',
      'diferenciaBaseImponible'
    ])
    expect(payload.snapshotIntimacion).toEqual({
      asunto: 'PRESUNTA DIFERENCIA DE BASE IMPONIBLE',
      saludo: 'Senor Contribuyente:',
      cuerpo: 'Por medio de la presente...',
      fuenteInformacion: 'Facturacion de compras, ARCA, etc.',
      fechaCorte: '11/2025'
    })
    expect(payload.filasPlanilla).toEqual([
      {
        anio: '2023',
        baseImponibleIngresosBrutos: '$ 2.238.725.397',
        baseImponibleInformadaPorTerceros: '$ 4.598.994.951',
        diferenciaBaseImponible: '$ 2.360.269.554'
      },
      {
        anio: '2024',
        baseImponibleIngresosBrutos: '$ 1.044.794.031',
        baseImponibleInformadaPorTerceros: '$ 1.760.516.865',
        diferenciaBaseImponible: '$ 715.722.834'
      }
    ])
  })
})
