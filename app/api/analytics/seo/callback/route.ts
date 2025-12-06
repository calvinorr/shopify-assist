import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, storeTokens } from "@/lib/google-search-console";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      const errorDescription = searchParams.get("error_description") || "Unknown error";
      return NextResponse.redirect(
        `${process.env.AUTH_URL}/dashboard/analytics?error=${encodeURIComponent(errorDescription)}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.AUTH_URL}/dashboard/analytics?error=No authorization code received`
      );
    }

    // Exchange code for tokens
    const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/analytics/seo/callback`;

    const tokens = await exchangeCodeForTokens(code, redirectUri);

    // Store tokens in database
    if (!user.id) {
      throw new Error("User ID not found");
    }
    await storeTokens(user.id, tokens);

    // Redirect back to analytics page with success message
    return NextResponse.redirect(
      `${process.env.AUTH_URL}/dashboard/analytics?connected=true`
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.redirect(`${process.env.AUTH_URL}/login`);
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.redirect(
      `${process.env.AUTH_URL}/dashboard/analytics?error=${encodeURIComponent(message)}`
    );
  }
}
