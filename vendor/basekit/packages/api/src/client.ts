import { buildQueryString, joinUrl } from "./url";
import {
  ApiError,
  type ApiClientOptions,
  type ApiResponse,
  type RequestOptions,
} from "./types";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Safely parses a response body as JSON, falling back to text / undefined. */
const parseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return undefined;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return text;
};

const combineSignals = (
  signals: Array<AbortSignal | undefined>,
): AbortSignal | undefined => {
  const present = signals.filter(Boolean) as AbortSignal[];
  if (present.length === 0) return undefined;
  if (present.length === 1) return present[0];
  const controller = new AbortController();
  for (const signal of present) {
    if (signal.aborted) {
      controller.abort();
      break;
    }
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }
  return controller.signal;
};

export type ApiClient = {
  request: <T>(
    method: Method,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ) => Promise<T>;
  /** Like `request` but returns the full {@link ApiResponse} (status, headers). */
  raw: <T>(
    method: Method,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ) => Promise<ApiResponse<T>>;
  get: <T>(path: string, options?: RequestOptions) => Promise<T>;
  post: <T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ) => Promise<T>;
  put: <T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ) => Promise<T>;
  patch: <T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ) => Promise<T>;
  delete: <T>(path: string, options?: RequestOptions) => Promise<T>;
};

/**
 * Creates a small, generic HTTP client. No business logic lives here: it only
 * knows how to attach auth, serialise JSON/query, time out, and turn non-2xx
 * responses into a typed {@link ApiError}.
 */
export const createApiClient = (options: ApiClientOptions): ApiClient => {
  const raw = async <T>(
    method: Method,
    path: string,
    body?: unknown,
    requestOptions: RequestOptions = {},
  ): Promise<ApiResponse<T>> => {
    const url =
      joinUrl(options.baseUrl, path) + buildQueryString(requestOptions.query);

    const timeoutMs = requestOptions.timeoutMs ?? options.timeoutMs;
    const timeoutController = new AbortController();
    const timer =
      timeoutMs && timeoutMs > 0
        ? setTimeout(() => timeoutController.abort(), timeoutMs)
        : undefined;

    const isRaw = requestOptions.rawBody !== undefined;
    const hasJsonBody = !isRaw && body !== undefined;

    let token: string | null | undefined;
    try {
      token = await options.getToken?.();
    } catch {
      token = undefined;
    }

    const headers = new Headers(options.headers);
    if (hasJsonBody) headers.set("Content-Type", "application/json");
    new Headers(requestOptions.headers).forEach((value, key) =>
      headers.set(key, value),
    );
    if (token) headers.set("Authorization", `Bearer ${token}`);

    try {
      const response = await fetch(url, {
        method,
        headers,
        signal: combineSignals([
          timeoutController.signal,
          requestOptions.signal,
        ]),
        body: isRaw
          ? requestOptions.rawBody
          : hasJsonBody
            ? JSON.stringify(body)
            : undefined,
      });

      const payload = await parseBody(response);

      if (!response.ok) {
        const message =
          (payload as { message?: string })?.message ?? response.statusText;
        const error = new ApiError(response.status, message, {
          payload,
          url,
        });
        options.onError?.(error);
        throw error;
      }

      return {
        data: payload as T,
        status: response.status,
        headers: response.headers,
        ok: response.ok,
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      const aborted = timeoutController.signal.aborted;
      const error = new ApiError(
        0,
        aborted
          ? `Request timed out after ${timeoutMs}ms`
          : "Network request failed",
        { url, cause: err },
      );
      options.onError?.(error);
      throw error;
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  const request = async <T>(
    method: Method,
    path: string,
    body?: unknown,
    requestOptions?: RequestOptions,
  ): Promise<T> => (await raw<T>(method, path, body, requestOptions)).data;

  return {
    request,
    raw,
    get: <T>(path: string, opts?: RequestOptions) =>
      request<T>("GET", path, undefined, opts),
    post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
      request<T>("POST", path, body, opts),
    put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
      request<T>("PUT", path, body, opts),
    patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
      request<T>("PATCH", path, body, opts),
    delete: <T>(path: string, opts?: RequestOptions) =>
      request<T>("DELETE", path, undefined, opts),
  };
};
