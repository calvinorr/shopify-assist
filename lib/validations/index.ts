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
          { error: "Validation failed", details: err.issues },
          { status: 400 }
        ),
      };
    }
    if (err instanceof SyntaxError) {
      return {
        data: null,
        error: NextResponse.json(
          { error: "Invalid JSON in request body" },
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

export * from "./auth";
export * from "./blog";
export * from "./instagram";
export * from "./user";
