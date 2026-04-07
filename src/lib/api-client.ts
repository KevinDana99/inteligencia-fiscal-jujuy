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

export async function getJson<T>(
  path: string,
  config?: ApiClientConfig,
  init?: ApiRequestInit
): Promise<T> {
  const baseUrl = config?.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(config?.token ? { Authorization: `Bearer ${config.token}` } : {}),
      ...init?.headers
    },
    next: init?.next
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
