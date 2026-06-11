export interface ApiClientConfig {
  baseUrl?: string;
  token?: string;
  refreshAccessToken?: () => Promise<string | null>;
}

export interface ApiRequestInit extends RequestInit {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export class ApiClientError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message?: string, data?: unknown) {
    super(message ?? `Request failed with status ${status}`);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
  }
}

type ApiRequestMethod = 'GET' | 'POST' | 'DELETE';

function buildRequestHeaders(
  config?: ApiClientConfig,
  init?: ApiRequestInit,
  token = config?.token
) {
  const hasFormDataBody = init?.body instanceof FormData;
  const headers = new Headers(init?.headers);

  if (!hasFormDataBody) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    headers.delete('Authorization');
  }

  return headers;
}

function hasHeader(headers: Record<string, string>, headerName: string) {
  const normalizedHeaderName = headerName.toLowerCase();

  return Object.keys(headers).some(
    (key) => key.toLowerCase() === normalizedHeaderName
  );
}

function deleteHeader(headers: Record<string, string>, headerName: string) {
  const normalizedHeaderName = headerName.toLowerCase();

  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === normalizedHeaderName) {
      delete headers[key];
    }
  }
}

function buildFetchHeaders(
  config?: ApiClientConfig,
  init?: ApiRequestInit,
  token = config?.token
) {
  const sourceHeaders = new Headers(init?.headers);
  const headers =
    init?.headers &&
    !(init.headers instanceof Headers) &&
    !Array.isArray(init.headers)
      ? { ...(init.headers as Record<string, string>) }
      : Object.fromEntries(sourceHeaders.entries());
  const hasFormDataBody = init?.body instanceof FormData;

  if (!hasFormDataBody && !hasHeader(headers, 'Content-Type')) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    deleteHeader(headers, 'Authorization');
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function refreshConfigAccessToken(config?: ApiClientConfig) {
  if (!config?.refreshAccessToken) {
    return null;
  }

  const refreshedToken = await config.refreshAccessToken();

  if (refreshedToken) {
    config.token = refreshedToken;
  }

  return refreshedToken;
}

async function fetchApiRequest(
  method: ApiRequestMethod,
  path: string,
  config?: ApiClientConfig,
  init?: ApiRequestInit,
  token = config?.token
) {
  const baseUrl = config?.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

  return fetch(`${baseUrl}${path}`, {
    ...init,
    method,
    headers: buildRequestHeaders(config, init, token),
    next: init?.next
  });
}

async function parseApiClientError(response: Response): Promise<ApiClientError> {
  let errorData: unknown = null;
  let errorMessage: string | undefined;

  try {
    errorData = await response.json();

    if (
      typeof errorData === 'object' &&
      errorData !== null &&
      'mensaje' in errorData &&
      typeof (errorData as { mensaje?: unknown }).mensaje === 'string'
    ) {
      errorMessage = (errorData as { mensaje: string }).mensaje;
    }
  } catch {
    errorData = null;
  }

  return new ApiClientError(response.status, errorMessage, errorData);
}

async function request<T>(
  method: ApiRequestMethod,
  path: string,
  config?: ApiClientConfig,
  init?: ApiRequestInit
): Promise<T> {
  let response = await fetchApiRequest(method, path, config, init);

  if (response.status === 401) {
    const refreshedToken = await refreshConfigAccessToken(config);

    if (refreshedToken) {
      response = await fetchApiRequest(method, path, config, init, refreshedToken);
    }
  }

  if (!response.ok) {
    throw await parseApiClientError(response);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function fetchWithAuthRetry(
  input: string | URL | Request,
  init: ApiRequestInit = {},
  config?: ApiClientConfig
): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    headers: buildFetchHeaders(config, init)
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshedToken = await refreshConfigAccessToken(config);

  if (!refreshedToken) {
    return response;
  }

  return fetch(input, {
    ...init,
    headers: buildFetchHeaders(config, init, refreshedToken)
  });
}

export async function getJson<T>(
  path: string,
  config?: ApiClientConfig,
  init?: ApiRequestInit
): Promise<T> {
  return request<T>('GET', path, config, init);
}

export async function postJson<TResponse, TBody>(
  path: string,
  body: TBody,
  config?: ApiClientConfig,
  init?: ApiRequestInit
): Promise<TResponse> {
  return request<TResponse>('POST', path, config, {
    ...init,
    body: JSON.stringify(body)
  });
}

export async function postFormData<TResponse>(
  path: string,
  body: FormData,
  config?: ApiClientConfig,
  init?: ApiRequestInit
): Promise<TResponse> {
  return request<TResponse>('POST', path, config, {
    ...init,
    body
  });
}

export async function deleteJson<T>(
  path: string,
  config?: ApiClientConfig,
  init?: ApiRequestInit
): Promise<T> {
  return request<T>('DELETE', path, config, init);
}
