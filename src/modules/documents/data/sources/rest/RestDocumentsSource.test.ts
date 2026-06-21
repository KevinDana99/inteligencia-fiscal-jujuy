import type { IGenerateInformeDocumentPayload } from '../../models/Documents';
import { RestDocumentsSource } from './RestDocumentsSource';

const payload: IGenerateInformeDocumentPayload = {
  contribuyenteId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  formato: 'Pdf',
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

describe('RestDocumentsSource', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn<Promise<Response>, Parameters<typeof fetch>>();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('sends the informe generation request exactly to the contract endpoint', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          documentoId: 'd6c60e56-f594-48c3-b351-5c369afce906',
          urlDescarga: '/api/documentos/d6c60e56-f594-48c3-b351-5c369afce906/descargar'
        }),
        {
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    );

    const source = new RestDocumentsSource({
      baseUrl: 'http://localhost:3000',
      token: 'token-de-prueba'
    });

    const result = await source.generateInformeDocument(payload);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, requestInit] = fetchMock.mock.calls[0] ?? [];

    expect(url).toBe('http://localhost:3000/api/documentos/informe/generar');
    expect(requestInit).toMatchObject({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-de-prueba'
      }
    });
    expect(JSON.parse(String(requestInit?.body))).toEqual(payload);
    expect(result).toEqual({
      documentoId: 'd6c60e56-f594-48c3-b351-5c369afce906',
      urlDescarga: '/api/documentos/d6c60e56-f594-48c3-b351-5c369afce906/descargar'
    });
  });

  test('downloads generated document bytes and resolves response metadata', async () => {
    fetchMock.mockResolvedValue(
      new Response(new TextEncoder().encode('pdf-content'), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="informe_20260611.pdf"'
        }
      })
    );

    const source = new RestDocumentsSource({
      baseUrl: 'http://localhost:3000',
      token: 'token-de-prueba'
    });

    const result = await source.downloadDocument(
      'd6c60e56-f594-48c3-b351-5c369afce906',
      'pdf'
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/documentos/d6c60e56-f594-48c3-b351-5c369afce906/descargar?formato=pdf',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Accept: 'application/octet-stream',
          Authorization: 'Bearer token-de-prueba'
        })
      })
    );
    expect(result).toEqual({
      base64: Buffer.from('pdf-content').toString('base64'),
      contentType: 'application/pdf',
      fileName: 'informe_20260611.pdf',
      formato: 'pdf'
    });
  });

  test('refreshes the access token and retries informe generation on backend 401', async () => {
    const refreshAccessToken = jest.fn().mockResolvedValue('token-refrescado');

    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            codigo: 'auth.token_expirado',
            mensaje: 'Token expirado.',
            estado: 401
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            documentoId: 'd6c60e56-f594-48c3-b351-5c369afce906',
            urlDescarga: '/api/documentos/d6c60e56-f594-48c3-b351-5c369afce906/descargar'
          }),
          {
            status: 201,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      );

    const source = new RestDocumentsSource({
      baseUrl: 'http://localhost:3000',
      refreshAccessToken,
      token: 'token-vencido'
    });

    const result = await source.generateInformeDocument(payload);

    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({
      Authorization: 'Bearer token-vencido'
    });
    expect(fetchMock.mock.calls[1]?.[1]?.headers).toMatchObject({
      Authorization: 'Bearer token-refrescado'
    });
    expect(result).toEqual({
      documentoId: 'd6c60e56-f594-48c3-b351-5c369afce906',
      urlDescarga: '/api/documentos/d6c60e56-f594-48c3-b351-5c369afce906/descargar'
    });
  });

  test('propagates document API errors with code, message and status', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          codigo: 'documentos.informe.formato_no_soportado',
          mensaje: 'Formato no soportado.',
          estado: 400
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    );

    const source = new RestDocumentsSource({
      baseUrl: 'http://localhost:3000',
      token: 'token-de-prueba'
    });

    await expect(
      source.downloadDocument('d6c60e56-f594-48c3-b351-5c369afce906', 'pdf')
    ).rejects.toMatchObject({
      status: 400,
      message: 'Formato no soportado.',
      data: {
        codigo: 'documentos.informe.formato_no_soportado',
        mensaje: 'Formato no soportado.',
        estado: 400
      }
    });
  });
});
