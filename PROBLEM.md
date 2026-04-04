# Rate Limiter Service

## Background

This repo contains an Express API with three endpoint categories:

- **Public** (`/api/public/*`) — open to anyone
- **Authenticated** (`/api/user/*`) — requires a Bearer token
- **Admin** (`/api/admin/*`) — requires an API key in `X-API-Key` header

A rate limiting middleware exists at `src/middleware/rate-limiter.ts`. It uses Redis (via ioredis) to track request counts per time window. The implementation works for basic single-request scenarios but has several issues that make it unsuitable for production.

## What you need to do

1. **The current rate limiter has a correctness issue under concurrent requests.** Multiple simultaneous requests can exceed the configured limit. Diagnose and fix this.

2. **Support different rate limiting algorithms.** The fixed-window approach resets all counters at window boundaries, which allows burst traffic right after a reset. A production service needs a smoother algorithm. Update the middleware to support at least one alternative approach.

3. **Different endpoints need different rate limiting behavior.** Public endpoints should limit by client IP address. Authenticated endpoints should limit by user identity. Admin endpoints should limit by API key. The current implementation doesn't differentiate.

4. **The service should handle Redis outages gracefully.** If Redis is unreachable, the API should not crash. Think about what the right behavior is for each endpoint type — it might not be the same for all of them.

5. **Clients should be able to see their rate limit status** in the response so they can back off proactively before hitting the limit.

6. **Some clients should be exempt from rate limiting.** Provide a mechanism for certain trusted clients to bypass the limiter entirely.

## What you do NOT need to do

- Distributed synchronization across multiple server instances — assume a single-process server.
- Persistent configuration — hardcoded or in-memory config is fine.
- Authentication/authorization changes — the existing auth middleware is sufficient.

## Stretch goals (only if time permits)

- Token bucket algorithm
- Per-endpoint dynamic configuration via environment variables
- Sub-second precision for sliding windows

## Getting started

```bash
npm install
npm run dev    # starts the server with hot reload
npm test       # runs the test suite
```

The rate limit configuration lives in `src/config/rate-limits.ts`. The type definitions in `src/lib/types.ts` describe the config shape — feel free to extend them.
