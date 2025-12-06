import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google-search-console";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/analytics/seo/callback`;

    // Generate state parameter for CSRF protection (optional but recommended)
    const state = crypto.randomUUID();

    const authUrl = getAuthUrl(redirectUri, state);

    // Redirect user to Google OAuth consent screen
    return NextResponse.redirect(authUrl);
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
