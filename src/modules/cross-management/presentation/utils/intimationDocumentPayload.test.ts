import type { IntimationTemplateState } from '@/modules/configuration-module/presentation/hooks/intimation-template'
import { buildIntimationDocumentPayload } from './intimationDocumentPayload'

const contributor = {
  id: 'row-1',
  taxpayerId: '44292a56-7e66-48ac-84f0-5f35aa5ec46d',
  cuit: '30-50401884-5',
  businessName: 'Empresa SA',
  cells: ['30-50401884-5', 'Empresa SA', '2025'],
  values: {
    anio: '2025',
    baseImponibleIngresosBrutos: '1.234,50'
  }
}

const templateState: IntimationTemplateState = {
  asunto: 'Asunto',
  saludo: 'Hola',
  cuerpo: 'Cuerpo',
  fuenteInformacion: 'ARCA',
  fechaCorte: 'Fecha de corte 11/2025.',
  columnas: [
    { id: 'anio', value: 'AÑO' },
    {
      id: 'baseImponibleIngresosBrutos',
      value: 'Base Imponible Ingresos Brutos'
    }
  ]
}

describe('buildIntimationDocumentPayload', () => {
  it('maps selected columns at request root and keeps spreadsheet rows aligned', () => {
    const payload = buildIntimationDocumentPayload({
      contributor,
      format: 'Docx',
      templateState
    })

    expect(payload.columnasSeleccionadas).toEqual([
      'anio',
      'baseImponibleIngresosBrutos'
    ])
    expect(payload.snapshotIntimacion).toEqual({
      asunto: 'Asunto',
      saludo: 'Hola',
      cuerpo: 'Cuerpo',
      fuenteInformacion: 'ARCA',
      fechaCorte: 'Fecha de corte 11/2025.'
    })
    expect(payload.filasPlanilla).toEqual([
      {
        anio: '2025',
        baseImponibleIngresosBrutos: '1.234,50'
      }
    ])
  })
})
