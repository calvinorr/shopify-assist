import { db } from "./db";
import { googleTokens } from "./schema";
import { eq } from "drizzle-orm";

const GOOGLE_OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const SEARCH_CONSOLE_API_BASE = "https://www.googleapis.com/webmasters/v3";

// Required scope for read-only Search Console access
const SEARCH_CONSOLE_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface SearchAnalyticsOptions {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dimensions?: ("query" | "page" | "country" | "device" | "searchAppearance")[];
  rowLimit?: number;
  startRow?: number;
}

interface SearchAnalyticsRow {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SearchAnalyticsResponse {
  rows?: SearchAnalyticsRow[];
  responseAggregationType?: string;
}

/**
 * Generate Google OAuth URL for Search Console authorization
 */
export function getAuthUrl(redirectUri: string, state?: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID not configured");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SEARCH_CONSOLE_SCOPE,
    access_type: "offline", // Request refresh token
    prompt: "consent", // Force consent screen to get refresh token
  });

  if (state) {
    params.set("state", state);
  }

  return `${GOOGLE_OAUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchange authorization code for access and refresh tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<TokenResponse> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials not configured");
  }

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for tokens: ${error}`);
  }

  return response.json();
}

/**
 * Refresh an expired access token using the refresh token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials not configured");
  }

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh access token: ${error}`);
  }

  return response.json();
}

/**
 * Store tokens in the database for a user
 */
export async function storeTokens(
  userId: string,
  tokens: TokenResponse
): Promise<void> {
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  // Check if tokens already exist for this user
  const [existing] = await db
    .select()
    .from(googleTokens)
    .where(eq(googleTokens.userId, userId))
    .limit(1);

  if (existing) {
    // Update existing tokens
    await db
      .update(googleTokens)
      .set({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || existing.refreshToken,
        expiresAt,
        scope: tokens.scope,
        updatedAt: new Date(),
      })
      .where(eq(googleTokens.userId, userId));
  } else {
    // Insert new tokens
    if (!tokens.refresh_token) {
      throw new Error("No refresh token provided for new user");
    }

    await db.insert(googleTokens).values({
      id: crypto.randomUUID(),
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      scope: tokens.scope,
    });
  }
}

/**
 * Get valid access token for a user (refreshes if expired)
 */
export async function getValidAccessToken(userId: string): Promise<string> {
  const [tokens] = await db
    .select()
    .from(googleTokens)
    .where(eq(googleTokens.userId, userId))
    .limit(1);

  if (!tokens) {
    throw new Error("No Google tokens found for user. Please connect your account.");
  }

  // Check if token is expired (with 5 minute buffer)
  const now = Date.now();
  const expiresAt = tokens.expiresAt.getTime();
  const isExpired = now >= expiresAt - 5 * 60 * 1000;

  if (isExpired) {
    // Refresh the token
    const refreshed = await refreshAccessToken(tokens.refreshToken);
    await storeTokens(userId, {
      ...refreshed,
      refresh_token: tokens.refreshToken, // Keep existing refresh token
    });
    return refreshed.access_token;
  }

  return tokens.accessToken;
}

/**
 * Check if user has connected Google Search Console
 */
export async function isConnected(userId: string): Promise<boolean> {
  const [tokens] = await db
    .select()
    .from(googleTokens)
    .where(eq(googleTokens.userId, userId))
    .limit(1);

  return !!tokens;
}

/**
 * Disconnect Google Search Console (remove tokens)
 */
export async function disconnect(userId: string): Promise<void> {
  await db.delete(googleTokens).where(eq(googleTokens.userId, userId));
}

/**
 * Fetch Search Analytics data from Google Search Console
 */
export async function fetchSearchAnalytics(
  accessToken: string,
  siteUrl: string,
  options: SearchAnalyticsOptions
): Promise<SearchAnalyticsResponse> {
  const { startDate, endDate, dimensions = ["query"], rowLimit = 100, startRow = 0 } = options;

  // Ensure siteUrl is properly encoded
  const encodedSiteUrl = encodeURIComponent(siteUrl);
  const url = `${SEARCH_CONSOLE_API_BASE}/sites/${encodedSiteUrl}/searchAnalytics/query`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions,
      rowLimit,
      startRow,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Search Console API error: ${error}`);
  }

  return response.json();
}

/**
 * Get list of sites the user has access to
 */
export async function listSites(accessToken: string): Promise<{ siteUrl: string; permissionLevel: string }[]> {
  const url = `${SEARCH_CONSOLE_API_BASE}/sites`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Search Console API error: ${error}`);
  }

  const data = await response.json();
  return data.siteEntry || [];
}

/**
 * Helper to get search analytics for a user (handles token refresh)
 */
export async function getUserSearchAnalytics(
  userId: string,
  siteUrl: string,
  options: SearchAnalyticsOptions
): Promise<SearchAnalyticsResponse> {
  const accessToken = await getValidAccessToken(userId);
  return fetchSearchAnalytics(accessToken, siteUrl, options);
}

/**
 * Helper to get sites for a user (handles token refresh)
 */
export async function getUserSites(userId: string): Promise<{ siteUrl: string; permissionLevel: string }[]> {
  const accessToken = await getValidAccessToken(userId);
  return listSites(accessToken);
}
