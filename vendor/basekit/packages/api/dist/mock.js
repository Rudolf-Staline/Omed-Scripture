import { ApiError } from "./types";
/**
 * Builds an in-memory {@link ApiClient} for demos and tests. No network: routes
 * are matched in order and resolved after an optional delay. Unmatched routes
 * throw a 404 {@link ApiError}, exactly like the real client.
 */
export const createMockClient = (routes, options = {}) => {
    const match = (method, path) => routes.find((route) => (!route.method || route.method.toUpperCase() === method) &&
        (typeof route.path === "string"
            ? route.path === path
            : route.path.test(path)));
    const handle = async (method, rawPath, body) => {
        const path = rawPath.split("?")[0] ?? rawPath;
        const route = match(method, path);
        const delay = route?.delay ?? options.defaultDelay ?? 250;
        await new Promise((resolve) => setTimeout(resolve, delay));
        if (!route) {
            throw new ApiError(404, `No mock route for ${method} ${path}`, {
                url: path,
            });
        }
        if ((route.status ?? 200) >= 400) {
            throw new ApiError(route.status ?? 400, `Mock error for ${path}`, {
                url: path,
            });
        }
        const result = typeof route.response === "function"
            ? route.response(path, body)
            : route.response;
        return result;
    };
    return {
        request: (method, path, body) => handle(method, path, body),
        raw: async (method, path, body) => ({
            data: await handle(method, path, body),
            status: 200,
            headers: new Headers(),
            ok: true,
        }),
        get: (path) => handle("GET", path),
        post: (path, body) => handle("POST", path, body),
        put: (path, body) => handle("PUT", path, body),
        patch: (path, body) => handle("PATCH", path, body),
        delete: (path) => handle("DELETE", path),
    };
};
//# sourceMappingURL=mock.js.map