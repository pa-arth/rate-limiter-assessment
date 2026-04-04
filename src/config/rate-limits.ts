import type { RateLimiterConfig } from '../lib/types.js';

/**
 * Default rate limit configuration.
 */
export const defaultLimits: RateLimiterConfig = {
  windowMs: 60_000,   // 1 minute
  max: 30,            // 30 requests per minute
  keyPrefix: 'rl:',
};
