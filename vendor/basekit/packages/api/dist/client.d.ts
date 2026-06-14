import { type ApiClientOptions, type ApiResponse, type RequestOptions } from "./types";
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type ApiClient = {
    request: <T>(method: Method, path: string, body?: unknown, options?: RequestOptions) => Promise<T>;
    /** Like `request` but returns the full {@link ApiResponse} (status, headers). */
    raw: <T>(method: Method, path: string, body?: unknown, options?: RequestOptions) => Promise<ApiResponse<T>>;
    get: <T>(path: string, options?: RequestOptions) => Promise<T>;
    post: <T>(path: string, body?: unknown, options?: RequestOptions) => Promise<T>;
    put: <T>(path: string, body?: unknown, options?: RequestOptions) => Promise<T>;
    patch: <T>(path: string, body?: unknown, options?: RequestOptions) => Promise<T>;
    delete: <T>(path: string, options?: RequestOptions) => Promise<T>;
};
/**
 * Creates a small, generic HTTP client. No business logic lives here: it only
 * knows how to attach auth, serialise JSON/query, time out, and turn non-2xx
 * responses into a typed {@link ApiError}.
 */
export declare const createApiClient: (options: ApiClientOptions) => ApiClient;
export {};
//# sourceMappingURL=client.d.ts.map