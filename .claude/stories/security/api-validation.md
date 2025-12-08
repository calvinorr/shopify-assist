# Story: API Input Validation with Zod

**Epic:** `epics/security-hardening.md`
**Status:** not-started
**Priority:** P0
**Created:** 2024-12-08

## Objective
Add schema validation to all API routes using Zod to prevent malformed requests and improve type safety.

## Problem
Current API routes use raw `request.json()` without validation:
- No type checking on request bodies
- No length limits on strings (XSS/DoS risk)
- JSON.parse can crash without try-catch
- Weak password requirements (8 chars only)

## Acceptance Criteria
- [ ] Install and configure Zod
- [ ] Create reusable validation schemas in `lib/validations/`
- [ ] Add validation to all POST/PUT/PATCH routes
- [ ] Wrap JSON.parse in try-catch with proper error responses
- [ ] Enforce password complexity (uppercase, number, special char)
- [ ] Add max length limits to text fields (title: 255, content: 100k, etc.)

## Implementation

### 1. Install Zod
```bash
npm install zod
```

### 2. Create validation schemas
```typescript
// lib/validations/blog.ts
import { z } from "zod";

export const createBlogPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().max(100000).optional(),
  excerpt: z.string().max(500).optional(),
  tags: z.string().max(1000).optional(),
  status: z.enum(["draft", "review", "published"]).default("draft"),
  scheduledAt: z.number().optional(),
});

// lib/validations/auth.ts
export const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
  name: z.string().min(1).max(100).optional(),
});
```

### 3. Create validation helper
```typescript
// lib/validations/index.ts
import { NextResponse } from "next/server";
import { ZodSchema, ZodError } from "zod";

export async function validateRequest<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        data: null,
        error: NextResponse.json(
          { error: "Validation failed", details: err.errors },
          { status: 400 }
        ),
      };
    }
    return {
      data: null,
      error: NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      ),
    };
  }
}
```

## Routes to Update
- `/api/auth/register` - registerSchema
- `/api/blog` POST - createBlogPostSchema
- `/api/blog/[id]` PUT - updateBlogPostSchema
- `/api/instagram/posts` POST - createInstagramPostSchema
- `/api/user/profile` PUT - updateProfileSchema
- `/api/user/password` POST - changePasswordSchema
- `/api/admin/allowed-emails` POST - allowedEmailSchema

## Test Plan
1. Send malformed JSON → 400 error with "Invalid request body"
2. Send missing required fields → 400 with field-specific errors
3. Send oversized content → 400 with length error
4. Send weak password → 400 with complexity requirements
5. Send valid request → 200/201 success
