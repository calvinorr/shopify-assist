# Story: Dev Bypass Production Guard

**Epic:** `epics/security-hardening.md`
**Status:** not-started
**Priority:** P0
**Created:** 2024-12-08

## Objective
Prevent DEV_BYPASS_AUTH from being accidentally enabled in production deployments.

## Problem
Current code allows `DEV_BYPASS_AUTH=true` to completely bypass authentication. If this env var is accidentally left in production, the entire app is publicly accessible without login.

**File:** `lib/auth.ts:23`
```typescript
export const isDevBypass = process.env.DEV_BYPASS_AUTH === "true";
```

## Acceptance Criteria
- [ ] Add startup check that throws error if DEV_BYPASS_AUTH=true in production
- [ ] Log warning if dev bypass is active (even in development)
- [ ] Add visual indicator in UI when dev bypass is active (already exists, verify)
- [ ] Document proper env configuration in README

## Implementation

```typescript
// lib/auth.ts - Add at module level
if (process.env.DEV_BYPASS_AUTH === "true") {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SECURITY ERROR: DEV_BYPASS_AUTH cannot be enabled in production! " +
      "Remove this environment variable before deploying."
    );
  }
  console.warn("⚠️  DEV_BYPASS_AUTH is enabled - authentication is bypassed");
}
```

## Test Plan
1. Set NODE_ENV=production and DEV_BYPASS_AUTH=true → app should fail to start
2. Set NODE_ENV=development and DEV_BYPASS_AUTH=true → warning logged, app runs
3. Verify Vercel deployment has no DEV_BYPASS_AUTH set

## Files to Modify
- `lib/auth.ts`
- `README.md` (document env vars)
