# Story: Consistent Error Handling

**Epic:** `epics/security-hardening.md`
**Status:** not-started
**Priority:** P1
**Created:** 2024-12-08

## Objective
Implement consistent error handling patterns across API routes and frontend components.

## Problems
1. Silent failures - errors logged to console but no UI feedback
2. Error messages leak implementation details to clients
3. No retry logic for transient failures
4. `Promise.all` fails entirely if one request fails

## Acceptance Criteria
- [ ] Create error utility functions
- [ ] Sanitize error messages in API responses
- [ ] Show toast notifications for all errors
- [ ] Use Promise.allSettled for parallel requests
- [ ] Add retry logic for external API calls

## Implementation

### 1. Error Utility
```typescript
// lib/errors.ts
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

export function sanitizeErrorForClient(error: unknown): string {
  const message = getErrorMessage(error);

  // Don't leak internal details
  const sensitivePatterns = [
    /api[_-]?key/i,
    /token/i,
    /password/i,
    /secret/i,
    /database/i,
    /sql/i,
  ];

  if (sensitivePatterns.some(p => p.test(message))) {
    return "An internal error occurred. Please try again.";
  }

  return message;
}
```

### 2. API Error Response Helper
```typescript
// lib/api-response.ts
import { NextResponse } from "next/server";
import { sanitizeErrorForClient } from "./errors";

export function errorResponse(error: unknown, status = 500) {
  console.error("API Error:", error); // Log full error server-side

  return NextResponse.json(
    { error: sanitizeErrorForClient(error) },
    { status }
  );
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
```

### 3. Frontend Error Hook
```typescript
// hooks/use-api.ts
import { useToast } from "@/components/ui/toast";

export function useApi() {
  const { showToast } = useToast();

  async function fetchWithError<T>(
    url: string,
    options?: RequestInit
  ): Promise<T | null> {
    try {
      const res = await fetch(url, options);
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Request failed", "error");
        return null;
      }

      return data;
    } catch (error) {
      showToast("Network error. Please check your connection.", "error");
      return null;
    }
  }

  return { fetchWithError };
}
```

### 4. Promise.allSettled Pattern
```typescript
// Before
const [suggestionsRes, blogRes] = await Promise.all([...]);

// After
const results = await Promise.allSettled([
  fetch("/api/ai/suggestions"),
  fetch("/api/blog"),
]);

const suggestions = results[0].status === "fulfilled"
  ? await results[0].value.json()
  : { blog: [], instagram: [] };

const blog = results[1].status === "fulfilled"
  ? await results[1].value.json()
  : { posts: [] };
```

## Files to Update
- Create `lib/errors.ts`
- Create `lib/api-response.ts`
- Create `hooks/use-api.ts`
- Update all API routes to use `errorResponse()`
- Update `dashboard-content.tsx` to use `Promise.allSettled`

## Test Plan
1. Trigger API error → toast shown to user
2. Trigger network failure → appropriate message shown
3. One of parallel requests fails → other data still loads
