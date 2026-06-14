import { ApiClientError } from '@/lib/api-client';
import type { ApiClientConfig } from '@/lib/api-client';
import type { ApiDocumentErrorResponseDto } from '../dtos/ApiDocumentDtos';

type DocumentsJsonRequestParams<TBody = unknown> = ApiClientConfig & {
  body?: TBody;
  method?: 'GET' | 'POST';
  path: string;
};

type DocumentsFileRequestParams = ApiClientConfig & {
  path: string;
};

export interface DocumentsFileResponse {
  base64: string;
  contentType: string;
  fileName: string | null;
}

function buildDocumentsUrl(baseUrl: string | undefined, path: string) {
  return `${baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}${path}`;
}

function buildDocumentsHeaders(token?: string, accept?: string) {
  return {
    ...(accept ? { Accept: accept } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

function buildDocumentsJsonHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    ...buildDocumentsHeaders(token)
  };
}

function resolveErrorMessage(error: ApiDocumentErrorResponseDto | null) {
  if (!error) {
    return 'Documents request failed';
  }

  if (typeof error.mensaje === 'string') {
    return error.mensaje;
  }

  if (error.errors) {
    const firstError = Object.values(error.errors).flat()[0];

    if (firstError) {
      return firstError;
    }
  }

  return error.title ?? 'Documents request failed';
}

async function parseDocumentsErrorResponse(
  response: Response
): Promise<ApiDocumentErrorResponseDto | null> {
  try {
    return (await response.json()) as ApiDocumentErrorResponseDto;
  } catch {
    return null;
  }
}

async function throwDocumentsResponseError(response: Response): Promise<never> {
  const error = await parseDocumentsErrorResponse(response);

  throw new ApiClientError(response.status, resolveErrorMessage(error), error);
}

function parseContentDispositionFileName(contentDisposition: string | null) {
  if (!contentDisposition) {
    return null;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].replace(/"/g, ''));
  }

  const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return fileNameMatch?.[1] ?? null;
}

export async function requestDocumentsJson<TResponse, TBody = unknown>({
  baseUrl,
  body,
  method = 'GET',
  path,
  token
}: DocumentsJsonRequestParams<TBody>): Promise<TResponse> {
  const response = await fetch(buildDocumentsUrl(baseUrl, path), {
    method,
    headers: buildDocumentsJsonHeaders(token),
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });

  if (!response.ok) {
    await throwDocumentsResponseError(response);
  }

  if (response.status === 204) {
    return null as TResponse;
  }

  return (await response.json()) as TResponse;
}

export async function requestDocumentsFile({
  baseUrl,
  path,
  token
}: DocumentsFileRequestParams): Promise<DocumentsFileResponse> {
  const response = await fetch(buildDocumentsUrl(baseUrl, path), {
    method: 'GET',
    headers: buildDocumentsHeaders(token, 'application/octet-stream')
  });

  if (!response.ok) {
    await throwDocumentsResponseError(response);
  }

  const arrayBuffer = await response.arrayBuffer();

  return {
    base64: Buffer.from(arrayBuffer).toString('base64'),
    contentType: response.headers.get('Content-Type') ?? 'application/octet-stream',
    fileName: parseContentDispositionFileName(response.headers.get('Content-Disposition'))
  };
}
