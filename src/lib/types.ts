import type { Request } from 'express';

export type Algorithm = 'fixed-window' | 'sliding-window';

export type KeyStrategy = 'ip' | 'user' | 'api-key';

export interface BypassConfig {
  /** IP addresses that skip rate limiting entirely */
  ips?: string[];
  /** Bearer tokens or API keys that skip rate limiting */
  tokens?: string[];
}

export interface RateLimiterConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests allowed per window */
  max: number;
  /** Algorithm to use (default: 'fixed-window') */
  algorithm?: Algorithm;
  /** How to identify the client (default: 'ip') */
  keyStrategy?: KeyStrategy;
  /** Bypass configuration for exempt clients */
  bypass?: BypassConfig;
  /** Behavior when Redis is unavailable */
  onRedisError?: 'fail-open' | 'fail-closed' | 'fallback';
  /** Optional prefix for Redis keys */
  keyPrefix?: string;
}

export interface RateLimitInfo {
  /** Maximum requests allowed */
  limit: number;
  /** Remaining requests in current window */
  remaining: number;
  /** Unix timestamp (seconds) when the window resets */
  reset: number;
}

export interface RateLimitResult {
  allowed: boolean;
  info: RateLimitInfo;
}

/**
 * Extract the client identifier from a request based on the key strategy.
 */
export function extractKey(req: Request, strategy: KeyStrategy): string {
  switch (strategy) {
    case 'user': {
      // Auth middleware attaches userId to request
      const userId = (req as unknown as Record<string, unknown>).userId as string | undefined;
      return userId ?? req.ip ?? 'unknown';
    }
    case 'api-key': {
      const apiKey = req.headers['x-api-key'] as string | undefined;
      return apiKey ?? req.ip ?? 'unknown';
    }
    case 'ip':
    default:
      return req.ip ?? req.socket.remoteAddress ?? 'unknown';
  }
}
