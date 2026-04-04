/** Standard rate limit response headers */
export const HEADER_LIMIT = 'X-RateLimit-Limit';
export const HEADER_REMAINING = 'X-RateLimit-Remaining';
export const HEADER_RESET = 'X-RateLimit-Reset';
export const HEADER_RETRY_AFTER = 'Retry-After';

/** Default rate limit settings */
export const DEFAULT_WINDOW_MS = 60_000; // 1 minute
export const DEFAULT_MAX_REQUESTS = 100;
export const DEFAULT_KEY_PREFIX = 'rl:';
