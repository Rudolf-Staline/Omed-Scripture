import { ApiError } from "./types";
import type { ApiClient } from "./client";

export type MockRoute = {
  method?: string;
  /** Path matched (without query string). */
  path: string | RegExp;
  /** Static response or a resolver. Omit for error routes. */
  response?: unknown | ((path: string, body: unknown) => unknown);
  status?: number;
  /** Simulated latency in ms. */
  delay?: number;
};

/**
 * Builds an in-memory {@link ApiClient} for demos and tests. No network: routes
 * are matched in order and resolved after an optional delay. Unmatched routes
 * throw a 404 {@link ApiError}, exactly like the real client.
 */
export const createMockClient = (
  routes: MockRoute[],
  options: { defaultDelay?: number } = {},
): ApiClient => {
  const match = (method: string, path: string) =>
    routes.find(
      (route) =>
        (!route.method || route.method.toUpperCase() === method) &&
        (typeof route.path === "string"
          ? route.path === path
          : route.path.test(path)),
    );

  const handle = async <T>(
    method: string,
    rawPath: string,
    body?: unknown,
  ): Promise<T> => {
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
    const result =
      typeof route.response === "function"
        ? (route.response as (p: string, b: unknown) => unknown)(path, body)
        : route.response;
    return result as T;
  };

  return {
    request: <T>(method: string, path: string, body?: unknown) =>
      handle<T>(method, path, body),
    raw: async <T>(method: string, path: string, body?: unknown) => ({
      data: await handle<T>(method, path, body),
      status: 200,
      headers: new Headers(),
      ok: true,
    }),
    get: <T>(path: string) => handle<T>("GET", path),
    post: <T>(path: string, body?: unknown) => handle<T>("POST", path, body),
    put: <T>(path: string, body?: unknown) => handle<T>("PUT", path, body),
    patch: <T>(path: string, body?: unknown) => handle<T>("PATCH", path, body),
    delete: <T>(path: string) => handle<T>("DELETE", path),
  };
};
