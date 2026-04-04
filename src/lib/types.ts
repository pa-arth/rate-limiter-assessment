export interface RateLimiterConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests allowed per window */
  max: number;
  /** Optional prefix for Redis keys */
  keyPrefix?: string;
}
