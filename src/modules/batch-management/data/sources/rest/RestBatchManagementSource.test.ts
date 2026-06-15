import { postFormData } from '@/lib/api-client';
import { RestBatchManagementSource } from './RestBatchManagementSource';

jest.mock('@/lib/api-client', () => ({
  getJson: jest.fn(),
  postFormData: jest.fn(),
  postJson: jest.fn()
}));

const mockPostFormData = postFormData as jest.MockedFunction<typeof postFormData>;

function getFormDataValue(formData: FormData, key: string) {
  return Array.from(formData.entries()).find(([entryKey]) => entryKey === key)?.[1];
}

describe('RestBatchManagementSource', () => {
  beforeEach(() => {
    mockPostFormData.mockReset();
  });

  it('normalizes legacy CM when previewing a batch load', async () => {
    mockPostFormData.mockResolvedValueOnce({
      nombreArchivo: null,
      registrosEncontrados: 0,
      cantidadValidos: 0,
      cantidadInvalidos: 0,
      cantidadDuplicados: 0,
      cantidadImportable: 0,
      registros: []
    });

    const source = new RestBatchManagementSource({});

    await source.previewBatchLoad({
      regime: 'CM',
      cuitsText: '30-70123456-8'
    });

    const formData = mockPostFormData.mock.calls[0]?.[1] as FormData;

    expect(getFormDataValue(formData, 'Regimen')).toBe('ConvenioMultilateral');
  });

  it('normalizes legacy CM when creating a batch', async () => {
    mockPostFormData.mockResolvedValueOnce({
      id: 'batch-1',
      numero: 1,
      numeroFormateado: '001',
      nombre: 'LOTE CM',
      descripcion: null,
      regimen: 'Convenio Multilateral',
      cantidadCuits: 1,
      fechaGeneracion: '2026-06-15T00:00:00.000Z'
    });

    const source = new RestBatchManagementSource({});

    await source.createBatch({
      name: 'LOTE CM',
      regime: 'CM',
      cuitsText: '30-70123456-8'
    });

    const formData = mockPostFormData.mock.calls[0]?.[1] as FormData;

    expect(getFormDataValue(formData, 'Regimen')).toBe('ConvenioMultilateral');
  });

  it('normalizes local regime aliases to the backend contract value', async () => {
    mockPostFormData.mockResolvedValueOnce({
      nombreArchivo: null,
      registrosEncontrados: 0,
      cantidadValidos: 0,
      cantidadInvalidos: 0,
      cantidadDuplicados: 0,
      cantidadImportable: 0,
      registros: []
    });

    const source = new RestBatchManagementSource({});

    await source.previewBatchLoad({
      regime: 'Regimen Local',
      cuitsText: '20-12345678-9'
    });

    const formData = mockPostFormData.mock.calls[0]?.[1] as FormData;

    expect(getFormDataValue(formData, 'Regimen')).toBe('RegimenLocal');
  });
});
