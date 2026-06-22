import type { IGenerateInformeDocumentsPayload } from '@/modules/documents';
import { generateInformeDocuments } from './informeDocumentGeneration';

const payload: IGenerateInformeDocumentsPayload = {
  contribuyenteId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  destinatario: 'CRA. MARCELA FIGUEROA',
  titulo: 'INFORME DE INVESTIGACIÓN',
  datosContribuyente: {
    razonSocial: 'VOLKSWAGEN S.A.',
    cuit: '30-50026913-4',
    domicilioFiscal: 'Belgrano 890, S.S. de Jujuy',
    domicilioFiscalElectronico: true,
    emailInformado: 'contacto@volkswagen.com.ar',
    riesgoFiscal: 'A',
    actividadesDeclaradas: ['Fabricacion de automotores']
  },
  datosAccionFiscalizadora: {
    origenPedido: 'DPTO. INTELIGENCIA FISCAL',
    periodo: '01/2025 - 03/2026',
    origenOI: null,
    programa: 'VERIFICACION DE BASE IMPONIBLE',
    tipoInstruccion: 'INVESTIGACION',
    impuestoNeto: null,
    impuestosAVerificar: 'INGRESOS BRUTOS'
  },
  crucesSeleccionados: [
    {
      nombre: 'Control de desvio de BI',
      columnasSeleccionadas: {
        claves: ['baseImponibleIngresosBrutos', 'diferenciaBI'],
        filas: [
          {
            periodo: '2025',
            baseImponibleIngresosBrutos: '$29.525.523',
            diferenciaBI: '$207.204.355'
          }
        ]
      }
    }
  ]
};

describe('generateInformeDocuments', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn<Promise<Response>, Parameters<typeof fetch>>();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('requests both informe formats through the stable BFF route', async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            documentoId: 'documento-pdf',
            urlDescarga: '/api/documentos/documento-pdf/descargar'
          }),
          { status: 201 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            documentoId: 'documento-docx',
            urlDescarga: '/api/documentos/documento-docx/descargar'
          }),
          { status: 201 }
        )
      );

    const result = await generateInformeDocuments(payload);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/documentos/informe/generar',
      expect.objectContaining({
        method: 'POST'
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/documentos/informe/generar',
      expect.objectContaining({
        method: 'POST'
      })
    );

    const requestBodies = fetchMock.mock.calls.map(([, requestInit]) =>
      JSON.parse(String(requestInit?.body))
    );

    expect(requestBodies).toEqual([
      {
        ...payload,
        formato: 'Pdf'
      },
      {
        ...payload,
        formato: 'Docx'
      }
    ]);
    expect(result).toEqual({
      pdf: {
        documentoId: 'documento-pdf',
        urlDescarga: '/api/documentos/documento-pdf/descargar'
      },
      docx: {
        documentoId: 'documento-docx',
        urlDescarga: '/api/documentos/documento-docx/descargar'
      }
    });
  });

  test('waits for the PDF generation before requesting DOCX', async () => {
    let resolvePdfResponse: (response: Response) => void = () => undefined;
    const pdfResponse = new Promise<Response>((resolve) => {
      resolvePdfResponse = resolve;
    });

    fetchMock.mockReturnValueOnce(pdfResponse).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          documentoId: 'documento-docx',
          urlDescarga: '/api/documentos/documento-docx/descargar'
        }),
        { status: 201 }
      )
    );

    const generationPromise = generateInformeDocuments(payload);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      formato: 'Pdf'
    });

    resolvePdfResponse(
      new Response(
        JSON.stringify({
          documentoId: 'documento-pdf',
          urlDescarga: '/api/documentos/documento-pdf/descargar'
        }),
        { status: 201 }
      )
    );

    await generationPromise;

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body))).toMatchObject({
      formato: 'Docx'
    });
  });

  test('returns a timeout message when informe generation is aborted', async () => {
    const abortError = new DOMException('The operation was aborted.', 'AbortError');

    fetchMock.mockRejectedValueOnce(abortError).mockRejectedValueOnce(abortError);

    await expect(generateInformeDocuments(payload)).rejects.toThrow(
      'La operación tardó demasiado. Intentá nuevamente en unos instantes.'
    );
  });
});
