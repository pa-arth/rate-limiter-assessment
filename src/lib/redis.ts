import Redis from 'ioredis';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: any = null;

/**
 * Get or create the shared Redis client.
 * Connects to REDIS_URL env var, or localhost:6379 by default.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRedisClient(): any {
  if (!client) {
    const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const R = (Redis as any).default ?? Redis;
    client = new R(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }
  return client;
}

/**
 * Replace the Redis client (used in tests).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setRedisClient(newClient: any): void {
  client = newClient;
}

/**
 * Disconnect and reset the client.
 */
export async function disconnectRedis(): Promise<void> {
  if (client) {
    await client.quit().catch(() => {});
    client = null;
  }
}
