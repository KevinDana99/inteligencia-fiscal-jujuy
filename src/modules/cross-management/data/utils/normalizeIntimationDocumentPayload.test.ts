import type { IGenerateIntimationDocumentPayload } from '../models/CrossManagement'
import { normalizeIntimationDocumentPayload } from './normalizeIntimationDocumentPayload'

const payload: IGenerateIntimationDocumentPayload = {
  contribuyente: {
    id: 'ba2affa0-76a4-47bf-9f77-ed91905aae13',
    cuit: '30-50168521-2',
    razonSocial: 'CERAMICA DEL NORTE S A'
  },
  formato: 'Pdf',
  snapshotIntimacion: {
    asunto: 'PRESUNTA DIFERENCIA DE BASE IMPONIBLE',
    saludo: 'Senor Contribuyente:',
    cuerpo: 'Por medio de la presente...',
    fuenteInformacion: 'prueba de cambio',
    fechaCorte: '11/2025'
  },
  columnasSeleccionadas: [
    'anio',
    'baseImponibleIngresosBrutos',
    'baseImponibleInformadaPorTerceros',
    'diferenciaBaseImponible'
  ],
  filasPlanilla: [
    {
      anio: '2024',
      baseImponibleIngresosBrutos: '$$ 0',
      baseImponibleInformadaPorTerceros: '$$ 0',
      diferenciaBaseImponible: '$$ 55.803.248'
    }
  ]
}

describe('normalizeIntimationDocumentPayload', () => {
  it('normalizes currency rows before sending them to the document API', () => {
    expect(normalizeIntimationDocumentPayload(payload).filasPlanilla).toEqual([
      {
        anio: '2024',
        baseImponibleIngresosBrutos: '$ 0',
        baseImponibleInformadaPorTerceros: '$ 0',
        diferenciaBaseImponible: '$ 55.803.248'
      }
    ])
  })
})
