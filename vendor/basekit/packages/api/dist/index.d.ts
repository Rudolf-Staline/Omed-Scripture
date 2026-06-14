/**
 * @basekit/api — a generic, typed HTTP client.
 *
 * Deliberately free of business logic: configure a base URL, optional auth
 * token, headers and timeout, then call `get/post/put/patch/delete`. Errors
 * surface as a typed {@link ApiError}.
 */
export { createApiClient, type ApiClient } from "./client";
export { createMockClient, type MockRoute } from "./mock";
export { ApiError, type ApiClientOptions, type ApiResponse, type RequestOptions, type QueryParams, type QueryValue, } from "./types";
export { joinUrl, buildQueryString } from "./url";
//# sourceMappingURL=index.d.ts.map