import type { Request, Response, NextFunction } from 'express';

/**
 * Simple auth middleware that extracts a user ID from a Bearer token.
 * In a real app this would verify a JWT; here we just use the token value
 * as the user identifier for rate limiting purposes.
 */
export function extractUser(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    (req as unknown as Record<string, unknown>).userId = token;
  }
  next();
}

/**
 * Require a valid Bearer token. Returns 401 if missing.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userId = (req as unknown as Record<string, unknown>).userId as string | undefined;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Bearer token required' });
  }
  next();
}

/**
 * Require an API key in the X-API-Key header. Returns 401 if missing.
 */
export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string | undefined;
  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized', message: 'API key required' });
  }
  next();
}
