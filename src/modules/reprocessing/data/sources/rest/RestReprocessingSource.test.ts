import { deleteJson, getJson, postJson } from '@/lib/api-client'
import { RestReprocessingSource } from './RestReprocessingSource'

jest.mock('@/lib/api-client', () => ({
  deleteJson: jest.fn(),
  getJson: jest.fn(),
  postJson: jest.fn()
}))

const mockPostJson = postJson as jest.MockedFunction<typeof postJson>
const mockGetJson = getJson as jest.MockedFunction<typeof getJson>
const mockDeleteJson = deleteJson as jest.MockedFunction<typeof deleteJson>

describe('RestReprocessingSource', () => {
  beforeEach(() => {
    mockDeleteJson.mockReset()
    mockGetJson.mockReset()
    mockPostJson.mockReset()
  })

  it('serializes mark reprocessing with the contributor CUIT field', async () => {
    mockPostJson.mockResolvedValueOnce({
      id: 'reprocessing-1',
      contribuyenteId: 'be0f84f1-dcc7-43b5-9ce8-6d0d845f777a',
      descripcion: 'Revisar cambios',
      estaActivo: true,
      fechaCreacionUtc: '2026-06-26T00:00:00.000Z'
    })

    const source = new RestReprocessingSource({})

    await source.markReprocessing({
      cuit: ' 30-50401884-5 ',
      description: 'Revisar cambios'
    })

    expect(mockPostJson).toHaveBeenCalledWith(
      '/api/reprocesos',
      {
        cuit: '30-50401884-5',
        descripcion: 'Revisar cambios'
      },
      {}
    )
  })
})
