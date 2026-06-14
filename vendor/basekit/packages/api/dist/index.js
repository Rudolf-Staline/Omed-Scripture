/**
 * @basekit/api — a generic, typed HTTP client.
 *
 * Deliberately free of business logic: configure a base URL, optional auth
 * token, headers and timeout, then call `get/post/put/patch/delete`. Errors
 * surface as a typed {@link ApiError}.
 */
export { createApiClient } from "./client";
export { createMockClient } from "./mock";
export { ApiError, } from "./types";
export { joinUrl, buildQueryString } from "./url";
//# sourceMappingURL=index.js.map