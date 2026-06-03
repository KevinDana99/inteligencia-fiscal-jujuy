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

async function request<T>(
  method: 'GET' | 'POST' | 'DELETE',
  path: string,
  config?: ApiClientConfig,
  init?: ApiRequestInit
): Promise<T> {
  const baseUrl = config?.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const hasFormDataBody = init?.body instanceof FormData;
  const headers = new Headers(init?.headers);

  if (!hasFormDataBody) {
    headers.set('Content-Type', 'application/json');
  }

  if (config?.token) {
    headers.set('Authorization', `Bearer ${config.token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    method,
    headers,
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
        typeof (errorData as { mensaje?: unknown }).mensaje === 'string'
      ) {
        errorMessage = (errorData as { mensaje: string }).mensaje;
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
