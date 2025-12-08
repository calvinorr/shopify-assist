import { NextResponse } from "next/server";

/**
 * Safely extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

/**
 * Patterns that indicate sensitive information that shouldn't be exposed to clients
 */
const SENSITIVE_PATTERNS = [
  /api[_-]?key/i,
  /token/i,
  /password/i,
  /secret/i,
  /database/i,
  /sql/i,
  /connection/i,
  /internal/i,
  /ECONNREFUSED/i,
  /ETIMEDOUT/i,
];

/**
 * Sanitize error message for client consumption
 * Hides implementation details and sensitive information
 */
export function sanitizeErrorForClient(error: unknown): string {
  const message = getErrorMessage(error);

  // Check for sensitive patterns
  if (SENSITIVE_PATTERNS.some((pattern) => pattern.test(message))) {
    return "An internal error occurred. Please try again.";
  }

  return message;
}

/**
 * Create a standardized error response for API routes
 */
export function errorResponse(
  error: unknown,
  status = 500,
  logContext?: string
): NextResponse {
  const message = getErrorMessage(error);

  // Log full error server-side with context
  console.error(`[API Error]${logContext ? ` ${logContext}:` : ""}`, message);
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }

  // Return sanitized message to client
  return NextResponse.json(
    { error: sanitizeErrorForClient(error) },
    { status }
  );
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * Wrap an async handler with error handling
 */
export function withErrorHandling<T>(
  handler: () => Promise<T>,
  context?: string
): Promise<T | NextResponse> {
  return handler().catch((error) => errorResponse(error, 500, context));
}
