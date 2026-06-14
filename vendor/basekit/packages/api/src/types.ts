export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;

export type RequestOptions = {
  /** Query string parameters; arrays produce repeated keys. */
  query?: QueryParams;
  /** Per-request headers, merged over client headers. */
  headers?: HeadersInit;
  /** Per-request timeout (ms), overriding the client default. */
  timeoutMs?: number;
  /** External abort signal; combined with the timeout signal. */
  signal?: AbortSignal;
  /** Send a raw body (FormData, Blob, string) instead of JSON. */
  rawBody?: BodyInit;
};

export type ApiResponse<T> = {
  data: T;
  status: number;
  headers: Headers;
  ok: boolean;
};

export type ApiClientOptions = {
  baseUrl: string;
  /** Returns the auth token (sync or async); added as `Authorization: Bearer`. */
  getToken?: () =>
    | string
    | null
    | undefined
    | Promise<string | null | undefined>;
  /** Default headers for every request. */
  headers?: HeadersInit;
  /** Default timeout in ms (0 disables). */
  timeoutMs?: number;
  /** Hook to observe/transform errors before they are thrown. */
  onError?: (error: ApiError) => void;
};

/** Thrown for non-2xx responses, timeouts and network failures. */
export class ApiError<T = unknown> extends Error {
  readonly status: number;
  readonly payload?: T;
  readonly url?: string;
  readonly cause?: unknown;

  constructor(
    status: number,
    message: string,
    options: { payload?: T; url?: string; cause?: unknown } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = options.payload;
    this.url = options.url;
    this.cause = options.cause;
  }

  /** True for network/timeout errors (status 0). */
  get isNetworkError(): boolean {
    return this.status === 0;
  }
}
