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
  data?: unknown;

  constructor(status: number, message?: string, data?: unknown) {
    super(message ?? `Request failed with status ${status}`);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
  }
}

async function requestJson<T>(
  method: 'GET' | 'POST' | 'DELETE',
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
    let errorData: unknown = null;
    let errorMessage: string | undefined;

    try {
      errorData = await response.json();

      if (
        typeof errorData === 'object' &&
        errorData !== null &&
        'mensaje' in errorData &&
        typeof errorData.mensaje === 'string'
      ) {
        errorMessage = errorData.mensaje;
      }
    } catch {
      errorData = null;
    }

    throw new ApiClientError(response.status, errorMessage, errorData);
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

export async function deleteJson<T>(
  path: string,
  config?: ApiClientConfig,
  init?: ApiRequestInit
): Promise<T> {
  return requestJson<T>('DELETE', path, config, init);
}
