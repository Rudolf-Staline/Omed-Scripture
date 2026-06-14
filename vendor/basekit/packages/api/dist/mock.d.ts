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
export declare const createMockClient: (routes: MockRoute[], options?: {
    defaultDelay?: number;
}) => ApiClient;
//# sourceMappingURL=mock.d.ts.map