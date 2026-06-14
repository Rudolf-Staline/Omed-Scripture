import { buildQueryString, joinUrl } from "./url";
import { ApiError, } from "./types";
/** Safely parses a response body as JSON, falling back to text / undefined. */
const parseBody = async (response) => {
    const text = await response.text();
    if (!text)
        return undefined;
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
        try {
            return JSON.parse(text);
        }
        catch {
            return text;
        }
    }
    return text;
};
const combineSignals = (signals) => {
    const present = signals.filter(Boolean);
    if (present.length === 0)
        return undefined;
    if (present.length === 1)
        return present[0];
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
/**
 * Creates a small, generic HTTP client. No business logic lives here: it only
 * knows how to attach auth, serialise JSON/query, time out, and turn non-2xx
 * responses into a typed {@link ApiError}.
 */
export const createApiClient = (options) => {
    const raw = async (method, path, body, requestOptions = {}) => {
        const url = joinUrl(options.baseUrl, path) + buildQueryString(requestOptions.query);
        const timeoutMs = requestOptions.timeoutMs ?? options.timeoutMs;
        const timeoutController = new AbortController();
        const timer = timeoutMs && timeoutMs > 0
            ? setTimeout(() => timeoutController.abort(), timeoutMs)
            : undefined;
        const isRaw = requestOptions.rawBody !== undefined;
        const hasJsonBody = !isRaw && body !== undefined;
        let token;
        try {
            token = await options.getToken?.();
        }
        catch {
            token = undefined;
        }
        const headers = new Headers(options.headers);
        if (hasJsonBody)
            headers.set("Content-Type", "application/json");
        new Headers(requestOptions.headers).forEach((value, key) => headers.set(key, value));
        if (token)
            headers.set("Authorization", `Bearer ${token}`);
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
                const message = payload?.message ?? response.statusText;
                const error = new ApiError(response.status, message, {
                    payload,
                    url,
                });
                options.onError?.(error);
                throw error;
            }
            return {
                data: payload,
                status: response.status,
                headers: response.headers,
                ok: response.ok,
            };
        }
        catch (err) {
            if (err instanceof ApiError)
                throw err;
            const aborted = timeoutController.signal.aborted;
            const error = new ApiError(0, aborted
                ? `Request timed out after ${timeoutMs}ms`
                : "Network request failed", { url, cause: err });
            options.onError?.(error);
            throw error;
        }
        finally {
            if (timer)
                clearTimeout(timer);
        }
    };
    const request = async (method, path, body, requestOptions) => (await raw(method, path, body, requestOptions)).data;
    return {
        request,
        raw,
        get: (path, opts) => request("GET", path, undefined, opts),
        post: (path, body, opts) => request("POST", path, body, opts),
        put: (path, body, opts) => request("PUT", path, body, opts),
        patch: (path, body, opts) => request("PATCH", path, body, opts),
        delete: (path, opts) => request("DELETE", path, undefined, opts),
    };
};
//# sourceMappingURL=client.js.map