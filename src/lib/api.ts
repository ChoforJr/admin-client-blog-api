const apiUrl = (
  process.env.NEXT_PUBLIC_BLOG_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export interface ApiErrorPayload {
  message?: string;
  error?: string | { message?: string };
  errors?: Array<{ msg?: string; message?: string; path?: string; param?: string }>;
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly path?: string,
    public readonly method?: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export function getWebSocketUrl(): string {
  const url = new URL(apiUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/ws`;
  url.search = "";
  url.hash = "";
  return url.toString();
}

export function getApiError(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const data = payload as ApiErrorPayload;
    if (typeof data.message === "string") return data.message;
    if (typeof data.error === "string") return data.error;
    if (data.error && typeof data.error.message === "string") {
      return data.error.message;
    }
    if (data.errors?.length) {
      return data.errors
        .map((error) => error.msg || error.message)
        .filter((message): message is string => Boolean(message))
        .join(". ");
    }
  }
  return fallback;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const method = (options.method || "GET").toUpperCase();
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw new Error(
      `Could not connect to the blog API for ${method} ${path}. Check NEXT_PUBLIC_BLOG_API_URL and the API CORS configuration.`,
    );
  }

  const payload: unknown = await response.json().catch(() => null);
  const apiError =
    payload && typeof payload === "object" && "error" in payload
      ? (payload as ApiErrorPayload).error
      : undefined;

  if (!response.ok || apiError) {
    throw new ApiRequestError(
      `${method} ${path} failed (${response.status}): ${getApiError(payload, "The API rejected the request.")}`,
      response.status,
      path,
      method,
    );
  }
  return payload as T;
}
