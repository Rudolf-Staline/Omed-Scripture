/** Thrown for non-2xx responses, timeouts and network failures. */
export class ApiError extends Error {
    status;
    payload;
    url;
    cause;
    constructor(status, message, options = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.payload = options.payload;
        this.url = options.url;
        this.cause = options.cause;
    }
    /** True for network/timeout errors (status 0). */
    get isNetworkError() {
        return this.status === 0;
    }
}
//# sourceMappingURL=types.js.map