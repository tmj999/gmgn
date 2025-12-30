const DEFAULT_API_BASE_URL = "http://localhost:3001";

export function getApiBaseUrl(): string {
  const raw = (import.meta as any).env?.VITE_API_BASE_URL;
  return typeof raw === "string" && raw.length > 0 ? raw : DEFAULT_API_BASE_URL;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { json?: unknown; token?: string | null } = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(options.headers);
  headers.set("accept", "application/json");

  if (options.json !== undefined) {
    headers.set("content-type", "application/json");
  }

  if (options.token) {
    headers.set("authorization", `Bearer ${options.token}`);
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
    });
  } catch (cause) {
    const err = new Error("NETWORK_ERROR");
    (err as any).cause = cause;
    throw err;
  }

  let text = "";
  try {
    text = await res.text();
  } catch {
    text = "";
  }

  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (typeof data === "object" && data && (data.error || data.message)) || "REQUEST_FAILED";
    const err = new Error(message);
    (err as any).status = res.status;
    (err as any).data = data;
    throw err;
  }

  return data as T;
}
