import type { IGenerateIntimationDocumentPayload } from '../../data/models/CrossManagement'
import { generateIntimationDocument } from './intimationDocumentGeneration'

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
      baseImponibleIngresosBrutos: '$ 0',
      baseImponibleInformadaPorTerceros: '$ 0',
      diferenciaBaseImponible: '$ 55.803.248'
    }
  ]
}

const fetchMock = jest.fn()

describe('generateIntimationDocument', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  it('posts the intimation payload to the backend API route', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          documentoId: 'documento-1',
          urlDescarga: '/api/documentos/documento-1/descargar?formato=pdf'
        }),
        { status: 201 }
      )
    )

    const result = await generateIntimationDocument(payload)
    const requestInit = fetchMock.mock.calls[0][1] as RequestInit

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/documentos/intimacion/generar',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    )
    expect(JSON.parse(requestInit.body as string)).toEqual(payload)
    expect(result).toEqual({
      documentId: 'documento-1',
      downloadUrl: '/api/documentos/documento-1/descargar?formato=pdf'
    })
  })

  it('throws the backend error message when generation fails', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          mensaje: 'Ocurrio un error no controlado en la API.'
        }),
        { status: 500 }
      )
    )

    await expect(generateIntimationDocument(payload)).rejects.toThrow(
      'Ocurrio un error no controlado en la API.'
    )
  })
})
