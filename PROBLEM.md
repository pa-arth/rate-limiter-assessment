# Rate Limiter Service

## Background

This repo contains an Express API with three endpoint categories:

- **Public** (`/api/public/*`) — open to anyone
- **Authenticated** (`/api/user/*`) — requires a Bearer token
- **Admin** (`/api/admin/*`) — requires an API key in `X-API-Key` header

A rate limiting middleware exists at `src/middleware/rate-limiter.ts`. It uses Redis (via ioredis) to track request counts per time window. It was written as a quick prototype and deployed to production, where it immediately started causing problems.

## What happened

Here's a summary of the incidents and complaints from the last two weeks:

**Incident #1 — Load test breach (April 1)**
During a load test, we fired 50 concurrent requests against `/api/public` with a limit of 30 requests/minute. 47 of them got through. The rate limiter is supposed to cap at 30 but clearly isn't enforcing it correctly under concurrent load.

**Incident #2 — API outage during Redis maintenance (March 28)**
Redis went down for a scheduled 3-minute maintenance window. The entire API started returning 500 errors because the rate limiter threw unhandled exceptions. The on-call engineer had to restart the service with rate limiting disabled.

**Complaint #1 — Shared IP throttling (ongoing)**
Multiple users behind the same corporate proxy or VPN are sharing a single rate limit bucket. When one heavy user on the same network hits the limit, all other users on that IP get blocked too. Authenticated endpoints should limit by who the user is, not where they're connecting from. Similarly, admin endpoints should limit by API key.

**Complaint #2 — No visibility into rate limit status (partner request)**
Our API partners asked for standard rate limit headers so their SDK clients can implement proactive backoff instead of waiting to get 429'd. Currently we return no rate limit information in response headers.

**Complaint #3 — Traffic burst at window boundaries (analytics team)**
The analytics team noticed a pattern: traffic spikes right at the start of every minute boundary. They believe users (or their retry logic) figured out that the counter resets at the top of each minute and started timing bursts accordingly.

**Request — Internal monitoring exemption (security team)**
The security team runs a monitoring service that pings every endpoint every 10 seconds. They asked for a way to exempt it from rate limiting so it doesn't eat into real users' quotas. They currently use a special header `X-RateLimit-Bypass` with a shared secret.

## What you do NOT need to do

- Distributed synchronization across multiple server instances — assume a single-process server
- Persistent configuration — hardcoded or in-memory config is fine
- Authentication/authorization changes — the existing auth middleware is sufficient
- Change the existing route handlers or their response shapes

## Getting started

```bash
npm install
npm run dev    # starts the server with hot reload
npm test       # runs the test suite
```

The rate limit configuration lives in `src/config/rate-limits.ts`. The middleware is at `src/middleware/rate-limiter.ts`.
