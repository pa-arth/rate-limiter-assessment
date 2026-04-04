import type { RateLimiterConfig } from '../lib/types.js';

/**
 * Rate limit configuration per route group.
 *
 * Adjust these as needed when implementing the full rate limiter.
 */

export const publicLimits: RateLimiterConfig = {
  windowMs: 60_000,   // 1 minute
  max: 30,            // 30 requests per minute
  keyPrefix: 'rl:public:',
};

export const authenticatedLimits: RateLimiterConfig = {
  windowMs: 60_000,   // 1 minute
  max: 60,            // 60 requests per minute
  keyPrefix: 'rl:auth:',
};

export const adminLimits: RateLimiterConfig = {
  windowMs: 60_000,   // 1 minute
  max: 120,           // 120 requests per minute
  keyPrefix: 'rl:admin:',
};
