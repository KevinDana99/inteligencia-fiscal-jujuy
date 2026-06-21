import { getJson, patchJson, postFormData } from '@/lib/api-client';
import { RestBatchManagementSource } from './RestBatchManagementSource';

jest.mock('@/lib/api-client', () => ({
  getJson: jest.fn(),
  patchJson: jest.fn(),
  postFormData: jest.fn(),
  postJson: jest.fn()
}));

const mockPostFormData = postFormData as jest.MockedFunction<typeof postFormData>;
const mockPatchJson = patchJson as jest.MockedFunction<typeof patchJson>;
const mockGetJson = getJson as jest.MockedFunction<typeof getJson>;

function getFormDataValue(formData: FormData, key: string) {
  return Array.from(formData.entries()).find(([entryKey]) => entryKey === key)?.[1];
}

describe('RestBatchManagementSource', () => {
  beforeEach(() => {
    mockGetJson.mockReset();
    mockPostFormData.mockReset();
    mockPatchJson.mockReset();
  });

  it('serializes list search params with the backend contract casing', async () => {
    mockGetJson.mockResolvedValueOnce({
      pagina: 1,
      itemsPagina: 20,
      totalItems: 0,
      totalPaginas: 0,
      lotes: []
    });

    const source = new RestBatchManagementSource({});

    await source.listBatches({
      search: '  ANOVA  ',
      page: 2,
      itemsPerPage: 10
    });

    expect(mockGetJson).toHaveBeenCalledWith(
      '/api/lotes?busqueda=ANOVA&pagina=2&itemsPagina=10',
      {}
    );
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

  it('maps add contributor to batch payload to the backend contract', async () => {
    mockPatchJson.mockResolvedValueOnce(null);

    const source = new RestBatchManagementSource({});

    await source.addContributorToBatch({
      batchId: '9de530a7-a9ac-4b91-80a7-4f3913900d41',
      contributor: {
        cuit: '30-70123456-8',
        businessName: 'DISTRIBUIDORA NORTE ANDINO S.A.',
        regime: 'Convenio Multilateral'
      }
    });

    expect(mockPatchJson).toHaveBeenCalledWith(
      '/api/lotes/contribuyentes',
      {
        loteId: '9de530a7-a9ac-4b91-80a7-4f3913900d41',
        contribuyente: {
          cuit: '30-70123456-8',
          razonSocial: 'DISTRIBUIDORA NORTE ANDINO S.A.',
          regimen: 'Convenio Multilateral'
        }
      },
      {}
    );
  });
});
