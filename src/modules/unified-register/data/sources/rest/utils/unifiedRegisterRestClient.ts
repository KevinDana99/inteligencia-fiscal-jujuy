import { ApiClientError, fetchWithAuthRetry } from '@/lib/api-client';
import type { ApiClientConfig } from '@/lib/api-client';
import { UNIFIED_REGISTER_PAGINATION_QUERY_PARAMS } from '../constants/unifiedRegisterPagination';
import type { ApiUnifiedRegisterErrorResponseDto } from '../dtos/ApiUnifiedRegisterDtos';

type UnifiedRegisterJsonRequestParams<TBody = unknown> = ApiClientConfig & {
  body?: TBody;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
};

export type UnifiedRegisterPaginationQueryParamNames = {
  itemsPerPage: string;
  page: string;
};

export function buildUnifiedRegisterPaginationParams(
  page: number,
  itemsPerPage: number,
  parameterNames: UnifiedRegisterPaginationQueryParamNames =
    UNIFIED_REGISTER_PAGINATION_QUERY_PARAMS
) {
  const searchParams = new URLSearchParams();
  searchParams.set(parameterNames.page, String(page));
  searchParams.set(parameterNames.itemsPerPage, String(itemsPerPage));

  return searchParams;
}

function buildUnifiedRegisterUrl(config: ApiClientConfig, path: string) {
  return `${config.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}${path}`;
}

async function parseUnifiedRegisterErrorResponse(
  response: Response
): Promise<ApiUnifiedRegisterErrorResponseDto | null> {
  try {
    const body = await response.text();

    if (!body.trim()) {
      return null;
    }

    return JSON.parse(body) as ApiUnifiedRegisterErrorResponseDto;
  } catch {
    return null;
  }
}

async function parseUnifiedRegisterJsonResponse<TResponse>(
  response: Response
): Promise<TResponse | null> {
  try {
    const body = await response.text();

    if (!body.trim()) {
      return null;
    }

    return JSON.parse(body) as TResponse;
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
  refreshAccessToken,
  token
}: UnifiedRegisterJsonRequestParams<TBody>): Promise<TResponse> {
  const config: ApiClientConfig = {
    baseUrl,
    refreshAccessToken,
    token
  };
  const response = await fetchWithAuthRetry(buildUnifiedRegisterUrl(config, path), {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  }, config);

  if (!response.ok) {
    await throwUnifiedRegisterResponseError(response);
  }

  if (response.status === 204) {
    return null as TResponse;
  }

  return (await parseUnifiedRegisterJsonResponse(response)) as TResponse;
}

export async function requestUnifiedRegisterVoid<TBody = unknown>(
  params: UnifiedRegisterJsonRequestParams<TBody>
): Promise<void> {
  await requestUnifiedRegisterJson<null, TBody>({
    ...params,
    method: params.method ?? 'DELETE'
  });
}
