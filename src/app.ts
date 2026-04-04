import express from 'express';
import publicRoutes from './routes/public.js';
import authenticatedRoutes from './routes/authenticated.js';
import adminRoutes from './routes/admin.js';
import { createRateLimiter } from './middleware/rate-limiter.js';
import { errorHandler } from './middleware/error-handler.js';
import { defaultLimits } from './config/rate-limits.js';

/**
 * Create and configure the Express application.
 * Exported as a factory so tests can create isolated instances.
 */
export function createApp() {
  const app = express();

  app.set('trust proxy', true);
  app.use(express.json());

  // Rate limiting
  app.use(createRateLimiter(defaultLimits));

  // Routes
  app.use(publicRoutes);
  app.use(authenticatedRoutes);
  app.use(adminRoutes);

  // Error handler
  app.use(errorHandler);

  return app;
}
