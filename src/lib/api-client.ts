export interface ApiClientConfig {
  baseUrl?: string;
  token?: string;
}

interface ApiRequestInit extends RequestInit {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export class ApiClientError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message ?? `Request failed with status ${status}`);
    this.name = 'ApiClientError';
    this.status = status;
  }
}

async function requestJson<T>(
  method: 'GET' | 'POST',
  path: string,
  config?: ApiClientConfig,
  init?: ApiRequestInit
): Promise<T> {
  const baseUrl = config?.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(config?.token ? { Authorization: `Bearer ${config.token}` } : {}),
      ...init?.headers
    },
    next: init?.next
  });

  if (!response.ok) {
    throw new ApiClientError(response.status);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function getJson<T>(
  path: string,
  config?: ApiClientConfig,
  init?: ApiRequestInit
): Promise<T> {
  return requestJson<T>('GET', path, config, init);
}

export async function postJson<TResponse, TBody>(
  path: string,
  body: TBody,
  config?: ApiClientConfig,
  init?: ApiRequestInit
): Promise<TResponse> {
  return requestJson<TResponse>(path ? 'POST' : 'POST', path, config, {
    ...init,
    body: JSON.stringify(body)
  });
}
