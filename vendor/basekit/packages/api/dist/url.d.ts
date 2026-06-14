import type { QueryParams } from "./types";
/** Joins a base URL and path, tolerating slashes on either side. */
export declare const joinUrl: (baseUrl: string, path: string) => string;
/** Serialises query params; arrays repeat the key, nullish values are skipped. */
export declare const buildQueryString: (query?: QueryParams) => string;
//# sourceMappingURL=url.d.ts.map