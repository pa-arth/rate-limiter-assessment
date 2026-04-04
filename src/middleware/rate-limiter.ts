import type { Request, Response, NextFunction } from 'express';
import { getRedisClient } from '../lib/redis.js';
import { DEFAULT_KEY_PREFIX, DEFAULT_MAX_REQUESTS, DEFAULT_WINDOW_MS } from '../lib/constants.js';
import type { RateLimiterConfig } from '../lib/types.js';

/**
 * Create a rate limiting middleware for Express.
 *
 * Current implementation uses a fixed-window counter stored in Redis.
 * Each request increments a counter keyed by the client's IP address.
 * When the counter exceeds `max`, subsequent requests receive 429.
 */
export function createRateLimiter(config: RateLimiterConfig) {
  const {
    windowMs = DEFAULT_WINDOW_MS,
    max = DEFAULT_MAX_REQUESTS,
    keyPrefix = DEFAULT_KEY_PREFIX,
  } = config;

  const windowSeconds = Math.ceil(windowMs / 1000);

  return async (req: Request, res: Response, next: NextFunction) => {
    const redis = getRedisClient();
    const clientIp = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const key = `${keyPrefix}${clientIp}`;

    // Check current count
    const current = await redis.get(key);
    const count = parseInt(current ?? '0', 10);

    if (count >= max) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again later.`,
      });
    }

    // Increment the counter
    await redis.incr(key);

    // Set expiry on first request in the window
    if (!current) {
      await redis.expire(key, windowSeconds);
    }

    next();
  };
}
