import { NextResponse } from "next/server";

// Simple in-memory rate limiter (works for single instance deployments)
// For multi-instance, replace with Redis/Upstash

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export const RATE_LIMITS = {
  auth: { limit: 5, windowMs: 60 * 1000 },        // 5 per minute
  password: { limit: 3, windowMs: 60 * 1000 },    // 3 per minute
  ai: { limit: 20, windowMs: 60 * 1000 },         // 20 per minute
  sync: { limit: 5, windowMs: 60 * 1000 },        // 5 per minute
  write: { limit: 60, windowMs: 60 * 1000 },      // 60 per minute (POST/PUT/DELETE)
  read: { limit: 100, windowMs: 60 * 1000 },      // 100 per minute (GET)
} as const;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;
}

/**
 * Check rate limit for an identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // No existing record or window expired - create new
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.limit - 1,
      resetIn: config.windowMs,
    };
  }

  // Check if limit exceeded
  if (record.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetIn: record.resetTime - now,
    };
  }

  // Increment count
  record.count++;
  return {
    success: true,
    remaining: config.limit - record.count,
    resetIn: record.resetTime - now,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

/**
 * Rate limit middleware helper - returns error response if limited
 */
export function rateLimit(
  request: Request,
  prefix: string,
  config: RateLimitConfig
): NextResponse | null {
  const ip = getClientIP(request);
  const identifier = `${prefix}:${ip}`;
  const result = checkRateLimit(identifier, config);

  if (!result.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(result.resetIn / 1000)),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(result.resetIn / 1000)),
        },
      }
    );
  }

  return null;
}
