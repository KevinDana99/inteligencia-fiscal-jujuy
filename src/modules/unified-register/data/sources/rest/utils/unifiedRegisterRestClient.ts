import { ApiClientError } from '@/lib/api-client';
import type { ApiClientConfig } from '@/lib/api-client';
import type { ApiUnifiedRegisterErrorResponseDto } from '../dtos/ApiUnifiedRegisterDtos';

type UnifiedRegisterJsonRequestParams<TBody = unknown> = ApiClientConfig & {
  body?: TBody;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
};

export function buildUnifiedRegisterPaginationParams(
  page: number,
  itemsPerPage: number
) {
  const searchParams = new URLSearchParams();
  searchParams.set('Pagina', String(page));
  searchParams.set('ItemsPagina', String(itemsPerPage));

  return searchParams;
}

function buildUnifiedRegisterUrl(baseUrl: string | undefined, path: string) {
  return `${baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}${path}`;
}

function buildUnifiedRegisterHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function parseUnifiedRegisterErrorResponse(
  response: Response
): Promise<ApiUnifiedRegisterErrorResponseDto | null> {
  try {
    return (await response.json()) as ApiUnifiedRegisterErrorResponseDto;
  } catch {
    return null;
  }
}

async function throwUnifiedRegisterResponseError(
  response: Response
): Promise<never> {
  const error = await parseUnifiedRegisterErrorResponse(response);

  throw new ApiClientError(
    response.status,
    error?.mensaje ?? 'Unified register request failed',
    error
  );
}

export async function requestUnifiedRegisterJson<TResponse, TBody = unknown>({
  baseUrl,
  body,
  method = 'GET',
  path,
  token
}: UnifiedRegisterJsonRequestParams<TBody>): Promise<TResponse> {
  const response = await fetch(buildUnifiedRegisterUrl(baseUrl, path), {
    method,
    headers: buildUnifiedRegisterHeaders(token),
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });

  if (!response.ok) {
    await throwUnifiedRegisterResponseError(response);
  }

  if (response.status === 204) {
    return null as TResponse;
  }

  return (await response.json()) as TResponse;
}

export async function requestUnifiedRegisterVoid<TBody = unknown>(
  params: UnifiedRegisterJsonRequestParams<TBody>
): Promise<void> {
  const response = await fetch(
    buildUnifiedRegisterUrl(params.baseUrl, params.path),
    {
      method: params.method ?? 'DELETE',
      headers: buildUnifiedRegisterHeaders(params.token),
      ...(params.body === undefined ? {} : { body: JSON.stringify(params.body) })
    }
  );

  if (!response.ok) {
    await throwUnifiedRegisterResponseError(response);
  }
}
