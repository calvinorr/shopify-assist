# Google Search Console Setup Guide

This guide walks you through connecting Google Search Console to Shopify Assist for SEO analytics.

## Prerequisites

- Admin access to your Shopify store
- A Google account (e.g., `calvin.orr@gmail.com`)
- Your Shopify domain (e.g., `herbariumdyeworks.com`)

---

## Step 1: Verify Domain Ownership in Google Search Console

### 1.1 Open Search Console
Go to [Google Search Console](https://search.google.com/search-console)

### 1.2 Add Property
1. Click **"Add property"**
2. Select **"Domain"** (recommended) or **"URL prefix"**
3. Enter your domain: `herbariumdyeworks.com`
4. Click **Continue**

### 1.3 Get Verification TXT Record
Google will display a TXT record like:
```
google-site-verification=abc123xyz...
```
Copy this entire string.

### 1.4 Add TXT Record in Shopify
1. Go to **Shopify Admin** → **Settings** (gear icon, bottom left)
2. Click **Domains**
3. Click on your domain (`herbariumdyeworks.com`)
4. Click the **three dots menu** → **"Edit DNS settings"**
5. Click **"Add custom record"**
6. Fill in:
   - **Type**: TXT
   - **Name**: `@`
   - **TXT Value**: Paste the `google-site-verification=...` string
7. Click **Save**

### 1.5 Verify Ownership
1. Wait 5-10 minutes for DNS propagation
2. Return to Google Search Console
3. Click **Verify**
4. You should see "Ownership verified"

---

## Step 2: Enable Google Search Console API

### 2.1 Open Google Cloud Console
Go to [Google Cloud Console](https://console.cloud.google.com)

### 2.2 Select Your Project
Use the project associated with your OAuth credentials (project ID: `836338421360`)

### 2.3 Enable the API
1. Go to **APIs & Services** → **Library**
2. Search for **"Google Search Console API"**
3. Click on it → Click **Enable**

Or use direct link:
https://console.developers.google.com/apis/api/searchconsole.googleapis.com/overview?project=836338421360

---

## Step 3: Configure OAuth Redirect URIs

### 3.1 Open Credentials Page
Go to [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials)

### 3.2 Edit OAuth Client
1. Click on your OAuth 2.0 Client ID
2. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/analytics/seo/callback` (development)
   - `https://your-production-domain.com/api/analytics/seo/callback` (production)
3. Click **Save**

---

## Step 4: Set Environment Variables

### Local Development (`.env.local`)
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
AUTH_URL=http://localhost:3000
```

### Production (Vercel)
Add these environment variables in Vercel Dashboard → Settings → Environment Variables:
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
AUTH_URL=https://your-production-domain.com
```

---

## Step 5: Connect in Shopify Assist

1. Go to **Analytics** → **SEO** tab
2. Click **"Connect Google Search Console"**
3. Sign in with the Google account that verified the domain
4. Grant permissions when prompted
5. You'll be redirected back with SEO data displaying

---

## Troubleshooting

### "User does not have sufficient permission for site"
- The Google account you're using doesn't have access to the Search Console property
- **Fix**: Verify domain ownership with that account (Step 1) OR have the property owner add you as a user

### "GOOGLE_CLIENT_ID not configured"
- Environment variables not loaded
- **Fix**: Restart the dev server after adding `.env.local` variables

### "Google Search Console API has not been used in project"
- API not enabled in Google Cloud
- **Fix**: Enable the Search Console API (Step 2)

### "siteUnverifiedUser" permission level
- Domain verification incomplete or done with different account
- **Fix**: Complete domain verification with the same Google account you use in the app

### No data showing after connection
- Search Console may take 24-48 hours to collect data for newly verified properties
- Check that your site has been indexed by Google

---

## Verifying Live Data

Test via API:
```bash
# Check connection status
curl "http://localhost:3000/api/analytics/seo?check=true"

# List available sites
curl "http://localhost:3000/api/analytics/seo?sites=true"

# Fetch SEO data
curl "http://localhost:3000/api/analytics/seo?siteUrl=https://herbariumdyeworks.com/&dimensions=query&rowLimit=10"
```

Expected successful response:
```json
{
  "siteUrl": "https://herbariumdyeworks.com/",
  "dateRange": { "startDate": "2024-11-08", "endDate": "2024-12-08" },
  "aggregated": {
    "totalClicks": 150,
    "totalImpressions": 5000,
    "averageCtr": 0.03,
    "averagePosition": 15.5
  },
  "rows": [
    { "keys": ["natural dye wool"], "clicks": 25, "impressions": 500, ... }
  ]
}
```

---

## Quick Reference

| Resource | URL |
|----------|-----|
| Google Search Console | https://search.google.com/search-console |
| Google Cloud Console | https://console.cloud.google.com |
| OAuth Credentials | https://console.cloud.google.com/apis/credentials |
| Search Console API | https://console.cloud.google.com/apis/api/searchconsole.googleapis.com |
