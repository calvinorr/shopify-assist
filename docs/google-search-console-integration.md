# Google Search Console OAuth Integration

This document describes the Google Search Console integration for Shopify Assist, which allows users to connect their Google Search Console account and fetch SEO analytics data.

## Overview

The integration provides:
- OAuth 2.0 authentication flow with Google
- Token storage and automatic refresh
- Search analytics data (impressions, clicks, CTR, position)
- Top queries and pages analysis
- Support for multiple sites

## Architecture

### Files Created

1. **`lib/google-search-console.ts`** - Core Google OAuth and API helpers
2. **`app/api/analytics/seo/connect/route.ts`** - Initiate OAuth flow
3. **`app/api/analytics/seo/callback/route.ts`** - OAuth callback handler
4. **`app/api/analytics/seo/route.ts`** - Get SEO data and manage connection
5. **Database table**: `google_tokens` - Store OAuth tokens per user

### Schema Addition

```typescript
export const googleTokens = sqliteTable("google_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  scope: text("scope").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
```

## Setup

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Search Console API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Search Console API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/analytics/seo/callback` (development)
     - `https://your-domain.com/api/analytics/seo/callback` (production)
5. Copy your Client ID and Client Secret

### 2. Environment Variables

Add to `.env.local`:

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
```

### 3. Database Migration

The schema has been updated and pushed to the database. The `google_tokens` table is now available.

## API Endpoints

### 1. Connect to Google Search Console

**Endpoint**: `GET /api/analytics/seo/connect`

**Description**: Initiates OAuth flow by redirecting user to Google consent screen.

**Authentication**: Required

**Example**:
```javascript
// Redirect user to connect
window.location.href = '/api/analytics/seo/connect';
```

### 2. OAuth Callback

**Endpoint**: `GET /api/analytics/seo/callback`

**Description**: Handles OAuth callback from Google, exchanges code for tokens, and stores them.

**Query Parameters**:
- `code` - Authorization code from Google
- `state` - CSRF protection token (optional)
- `error` - Error from Google (if authorization failed)

**Redirects to**: `/dashboard/analytics?connected=true` (success) or `/dashboard/analytics?error=...` (failure)

### 3. Get Search Analytics Data

**Endpoint**: `GET /api/analytics/seo`

**Description**: Fetches search analytics data from Google Search Console.

**Authentication**: Required

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `siteUrl` | string | Yes | - | Site URL (e.g., `https://herbariumdyeworks.com`) |
| `startDate` | string | No | 30 days ago | Start date (YYYY-MM-DD) |
| `endDate` | string | No | Today | End date (YYYY-MM-DD) |
| `dimensions` | string | No | `query` | Comma-separated list: `query`, `page`, `country`, `device`, `searchAppearance` |
| `rowLimit` | number | No | 25 | Max rows to return (max: 1000) |
| `startRow` | number | No | 0 | Pagination offset |
| `check` | boolean | No | false | Just check connection status |
| `sites` | boolean | No | false | List available sites |

**Response** (search data):
```json
{
  "siteUrl": "https://herbariumdyeworks.com",
  "dateRange": {
    "startDate": "2025-11-06",
    "endDate": "2025-12-06"
  },
  "aggregated": {
    "totalClicks": 1250,
    "totalImpressions": 45000,
    "averageCtr": 0.0278,
    "averagePosition": 12.5
  },
  "rows": [
    {
      "keys": ["hand dyed wool"],
      "clicks": 85,
      "impressions": 2500,
      "ctr": 0.034,
      "position": 8.2
    }
  ],
  "totalRows": 25
}
```

**Response** (connection check):
```json
{
  "connected": true
}
```

**Response** (sites list):
```json
{
  "sites": [
    {
      "siteUrl": "https://herbariumdyeworks.com",
      "permissionLevel": "siteOwner"
    }
  ]
}
```

**Error Responses**:
- `401` - Unauthorized (not logged in)
- `403` - Google Search Console not connected
- `400` - Missing required parameters
- `500` - API error

**Example Usage**:

```javascript
// Check connection status
const checkResponse = await fetch('/api/analytics/seo?check=true');
const { connected } = await checkResponse.json();

if (!connected) {
  // Redirect to connect
  window.location.href = '/api/analytics/seo/connect';
  return;
}

// Get top queries for last 30 days
const response = await fetch(
  '/api/analytics/seo?' + new URLSearchParams({
    siteUrl: 'https://herbariumdyeworks.com',
    dimensions: 'query',
    rowLimit: '10'
  })
);
const data = await response.json();

console.log('Top queries:', data.rows);
console.log('Total clicks:', data.aggregated.totalClicks);
```

### 4. Disconnect Google Search Console

**Endpoint**: `DELETE /api/analytics/seo`

**Description**: Removes stored Google tokens, disconnecting the account.

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "message": "Google Search Console disconnected"
}
```

**Example**:
```javascript
await fetch('/api/analytics/seo', { method: 'DELETE' });
```

## Library Functions

### `lib/google-search-console.ts`

#### Core OAuth Functions

```typescript
// Generate OAuth URL
function getAuthUrl(redirectUri: string, state?: string): string

// Exchange authorization code for tokens
async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenResponse>

// Refresh expired access token
async function refreshAccessToken(refreshToken: string): Promise<TokenResponse>

// Store tokens in database
async function storeTokens(userId: string, tokens: TokenResponse): Promise<void>

// Get valid access token (auto-refreshes if expired)
async function getValidAccessToken(userId: string): Promise<string>
```

#### Connection Management

```typescript
// Check if user has connected
async function isConnected(userId: string): Promise<boolean>

// Disconnect (remove tokens)
async function disconnect(userId: string): Promise<void>
```

#### Search Console API

```typescript
// Fetch search analytics data
async function fetchSearchAnalytics(
  accessToken: string,
  siteUrl: string,
  options: SearchAnalyticsOptions
): Promise<SearchAnalyticsResponse>

// List sites user has access to
async function listSites(accessToken: string): Promise<GoogleSite[]>

// Helper: Get search analytics for user (handles token refresh)
async function getUserSearchAnalytics(
  userId: string,
  siteUrl: string,
  options: SearchAnalyticsOptions
): Promise<SearchAnalyticsResponse>

// Helper: Get sites for user (handles token refresh)
async function getUserSites(userId: string): Promise<GoogleSite[]>
```

## Usage Examples

### Frontend Integration

```typescript
import { useState, useEffect } from 'react';
import { SearchAnalyticsData, GoogleSite } from '@/types/analytics';

function SEOAnalytics() {
  const [connected, setConnected] = useState(false);
  const [sites, setSites] = useState<GoogleSite[]>([]);
  const [data, setData] = useState<SearchAnalyticsData | null>(null);
  const [selectedSite, setSelectedSite] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    const res = await fetch('/api/analytics/seo?check=true');
    const { connected } = await res.json();

    if (connected) {
      setConnected(true);
      loadSites();
    }
  }

  async function loadSites() {
    const res = await fetch('/api/analytics/seo?sites=true');
    const { sites } = await res.json();
    setSites(sites);

    if (sites.length > 0) {
      setSelectedSite(sites[0].siteUrl);
    }
  }

  async function loadAnalytics() {
    if (!selectedSite) return;

    const res = await fetch(
      '/api/analytics/seo?' + new URLSearchParams({
        siteUrl: selectedSite,
        dimensions: 'query',
        rowLimit: '10'
      })
    );
    const data = await res.json();
    setData(data);
  }

  if (!connected) {
    return (
      <div>
        <p>Connect your Google Search Console to view SEO analytics.</p>
        <a href="/api/analytics/seo/connect">
          <button>Connect Google Search Console</button>
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2>SEO Analytics</h2>

      <select value={selectedSite} onChange={(e) => setSelectedSite(e.target.value)}>
        {sites.map(site => (
          <option key={site.siteUrl} value={site.siteUrl}>
            {site.siteUrl}
          </option>
        ))}
      </select>

      <button onClick={loadAnalytics}>Load Analytics</button>

      {data && (
        <div>
          <h3>Summary ({data.dateRange.startDate} to {data.dateRange.endDate})</h3>
          <p>Total Clicks: {data.aggregated.totalClicks}</p>
          <p>Total Impressions: {data.aggregated.totalImpressions}</p>
          <p>Average CTR: {(data.aggregated.averageCtr * 100).toFixed(2)}%</p>
          <p>Average Position: {data.aggregated.averagePosition.toFixed(1)}</p>

          <h3>Top Queries</h3>
          <ul>
            {data.rows.map((row, i) => (
              <li key={i}>
                <strong>{row.keys?.[0]}</strong>: {row.clicks} clicks, {row.impressions} impressions
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Server-Side Usage

```typescript
import { getUserSearchAnalytics, getUserSites } from '@/lib/google-search-console';

// In a server component or API route
export async function GET() {
  const userId = 'user-123';

  // Get available sites
  const sites = await getUserSites(userId);

  // Get analytics for a specific site
  const analytics = await getUserSearchAnalytics(
    userId,
    'https://herbariumdyeworks.com',
    {
      startDate: '2025-11-01',
      endDate: '2025-11-30',
      dimensions: ['query', 'page'],
      rowLimit: 50
    }
  );

  return Response.json({ sites, analytics });
}
```

## Common Use Cases

### 1. Top Performing Queries

```javascript
const response = await fetch('/api/analytics/seo?' + new URLSearchParams({
  siteUrl: 'https://herbariumdyeworks.com',
  dimensions: 'query',
  rowLimit: '20',
  startDate: '2025-11-01',
  endDate: '2025-11-30'
}));

const { rows } = await response.json();
const topQueries = rows.map(row => ({
  query: row.keys[0],
  clicks: row.clicks,
  impressions: row.impressions,
  ctr: (row.ctr * 100).toFixed(2) + '%',
  position: row.position.toFixed(1)
}));
```

### 2. Top Pages by Traffic

```javascript
const response = await fetch('/api/analytics/seo?' + new URLSearchParams({
  siteUrl: 'https://herbariumdyeworks.com',
  dimensions: 'page',
  rowLimit: '20'
}));

const { rows } = await response.json();
const topPages = rows.map(row => ({
  page: row.keys[0],
  clicks: row.clicks,
  impressions: row.impressions
}));
```

### 3. Country-Specific Performance

```javascript
const response = await fetch('/api/analytics/seo?' + new URLSearchParams({
  siteUrl: 'https://herbariumdyeworks.com',
  dimensions: 'country',
  rowLimit: '10'
}));

const { rows } = await response.json();
const countries = rows.map(row => ({
  country: row.keys[0],
  clicks: row.clicks
}));
```

### 4. Query and Page Combined

```javascript
const response = await fetch('/api/analytics/seo?' + new URLSearchParams({
  siteUrl: 'https://herbariumdyeworks.com',
  dimensions: 'query,page',
  rowLimit: '100'
}));

const { rows } = await response.json();
// Each row.keys will be [query, page]
const detailed = rows.map(row => ({
  query: row.keys[0],
  page: row.keys[1],
  clicks: row.clicks,
  position: row.position
}));
```

## Error Handling

### Common Errors

1. **No tokens found** (403)
   - User hasn't connected Google Search Console
   - Solution: Redirect to `/api/analytics/seo/connect`

2. **Invalid tokens** (refresh failed)
   - Refresh token expired or revoked
   - Solution: Disconnect and reconnect (re-authorize)

3. **API rate limit**
   - Exceeded Google Search Console API limits
   - Solution: Implement caching, reduce request frequency

4. **Invalid site URL**
   - Site not verified in Search Console
   - User doesn't have permission
   - Solution: Check available sites first with `?sites=true`

### Error Handling Example

```typescript
async function loadSEOData() {
  try {
    const response = await fetch('/api/analytics/seo?siteUrl=...');

    if (response.status === 403) {
      const { connected } = await response.json();
      if (!connected) {
        // Not connected - redirect to connect
        window.location.href = '/api/analytics/seo/connect';
        return;
      }
    }

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error);
    }

    const data = await response.json();
    // Use data...
  } catch (error) {
    console.error('Failed to load SEO data:', error);
    // Show error to user
  }
}
```

## Security Considerations

1. **OAuth State Parameter**: Consider implementing state parameter validation for CSRF protection
2. **Token Encryption**: Tokens are stored in plain text in the database. For production, consider encrypting them.
3. **Scope Validation**: Only request read-only access (`webmasters.readonly`)
4. **Rate Limiting**: Implement rate limiting on API routes to prevent abuse
5. **User Isolation**: Tokens are scoped per user - ensure proper authentication

## Next Steps

1. Add UI components for the Analytics page to display SEO data
2. Implement caching to reduce API calls to Google
3. Add data visualization (charts for trends)
4. Set up scheduled jobs to fetch and store historical data
5. Add SEO recommendations based on analytics data
