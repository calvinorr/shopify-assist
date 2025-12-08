# Story: Rate Limiting Middleware

**Epic:** `epics/security-hardening.md`
**Status:** complete
**Priority:** P0
**Created:** 2024-12-08

## Objective
Add rate limiting to protect against brute force attacks, API abuse, and DoS.

## Problem
Zero rate limiting on any endpoints:
- `/api/auth/register` - unlimited registration attempts
- `/api/user/password` - password brute force
- `/api/ai/*` - could rack up Gemini API costs
- `/api/shopify/sync` - could hit Shopify rate limits

## Acceptance Criteria
- [ ] Implement rate limiting middleware
- [ ] Apply strict limits to auth endpoints (5 req/min)
- [ ] Apply moderate limits to AI endpoints (20 req/min)
- [ ] Apply generous limits to read endpoints (100 req/min)
- [ ] Return 429 Too Many Requests with Retry-After header
- [ ] Log rate limit violations

## Implementation Options

### Option A: Vercel KV (Recommended for Vercel deployment)
```bash
npm install @vercel/kv
```

### Option B: Upstash Redis (Works anywhere)
```bash
npm install @upstash/ratelimit @upstash/redis
```

### Option C: In-Memory (Simple, single instance only)
```typescript
// lib/rate-limit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1, resetIn: windowMs };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetIn: record.resetTime - now
    };
  }

  record.count++;
  return {
    success: true,
    remaining: limit - record.count,
    resetIn: record.resetTime - now
  };
}
```

### Rate Limit Configuration
```typescript
// lib/rate-limit-config.ts
export const RATE_LIMITS = {
  auth: { limit: 5, window: 60 * 1000 },      // 5 per minute
  password: { limit: 3, window: 60 * 1000 },  // 3 per minute
  ai: { limit: 20, window: 60 * 1000 },       // 20 per minute
  sync: { limit: 5, window: 60 * 1000 },      // 5 per minute
  api: { limit: 100, window: 60 * 1000 },     // 100 per minute (default)
};
```

### Usage in API Route
```typescript
// app/api/auth/register/route.ts
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { success, resetIn } = rateLimit(
    `auth:${ip}`,
    RATE_LIMITS.auth.limit,
    RATE_LIMITS.auth.window
  );

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) }
      }
    );
  }

  // ... rest of handler
}
```

## Routes to Protect
| Route | Limit | Window |
|-------|-------|--------|
| `/api/auth/register` | 5 | 1 min |
| `/api/auth/[...nextauth]` | 10 | 1 min |
| `/api/user/password` | 3 | 1 min |
| `/api/ai/*` | 20 | 1 min |
| `/api/shopify/sync` | 5 | 1 min |
| All other POST/PUT/DELETE | 60 | 1 min |
| All GET | 100 | 1 min |

## Test Plan
1. Hit `/api/auth/register` 6 times rapidly → 6th request gets 429
2. Wait 60 seconds → request succeeds again
3. Verify Retry-After header is present and accurate
