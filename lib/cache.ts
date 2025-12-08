import { NextResponse } from "next/server";

/**
 * Cache durations for different data types
 */
export const CACHE_DURATIONS = {
  // Short-lived data (changes frequently)
  products: 60, // 1 minute - inventory changes
  shopifyStatus: 30, // 30 seconds
  blogList: 60, // 1 minute

  // Medium-lived data
  colors: 300, // 5 minutes - color list rarely changes
  stats: 120, // 2 minutes

  // Long-lived data
  productImages: 3600, // 1 hour - images don't change often
} as const;

/**
 * Create a cached JSON response with appropriate headers
 * Uses stale-while-revalidate for better UX
 */
export function cachedResponse<T>(
  data: T,
  maxAge: number,
  options?: {
    status?: number;
    staleWhileRevalidate?: number;
    private?: boolean;
  }
): NextResponse {
  const {
    status = 200,
    staleWhileRevalidate = maxAge, // Default: same as maxAge
    private: isPrivate = true, // Default: private (user-specific data)
  } = options ?? {};

  const cacheControl = [
    isPrivate ? "private" : "public",
    `max-age=${maxAge}`,
    `stale-while-revalidate=${staleWhileRevalidate}`,
  ].join(", ");

  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": cacheControl,
    },
  });
}

/**
 * No-cache response for dynamic data
 */
export function noCacheResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
