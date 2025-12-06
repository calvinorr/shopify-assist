# Story: Production Readiness

**Epic:** See `.claude/epic.md`
**Status:** not-started
**Priority:** P0
**Created:** 2024-12-06
**Updated:** 2024-12-06 10:45

## Objective
Prepare the application for production deployment with proper security, authentication, and comprehensive testing.

## Acceptance Criteria

### Security Audit
- [ ] Review all API routes for authentication checks
- [ ] Ensure no sensitive data exposed in client bundles
- [ ] Validate environment variable usage (no secrets in code)
- [ ] Check for common vulnerabilities (XSS, CSRF, injection)
- [ ] Review CORS and CSP headers
- [ ] Audit third-party dependencies for vulnerabilities (`npm audit`)

### Authentication
- [ ] Disable `DEV_BYPASS_AUTH` mode
- [ ] Configure NextAuth for production
- [ ] Set up proper auth provider (Google OAuth or similar)
- [ ] Implement session management
- [ ] Add protected route middleware
- [ ] Test login/logout flow end-to-end

### Testing
- [ ] Run full build (`npm run build`) - zero errors
- [ ] Test all pages render correctly
- [ ] Test all API endpoints respond correctly
- [ ] Verify database connectivity
- [ ] Test Shopify API integration
- [ ] Test Gemini AI integration
- [ ] Mobile responsiveness check

### Deployment Prep
- [ ] Verify all required env vars documented
- [ ] Configure Vercel project settings
- [ ] Set up production environment variables in Vercel
- [ ] Configure custom domain (`shopify-assist.warmwetcircles.com`)
- [ ] Test Vercel preview deployment
- [ ] Production deployment

## Implementation Notes

### Branch Strategy
- Work on `feature/production-readiness` branch
- Merge to `main` only after all checks pass

### Environment Variables Required
```
# Database
DATABASE_URL=
DATABASE_AUTH_TOKEN=

# Auth (production)
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# APIs
SHOPIFY_ACCESS_TOKEN=
GOOGLE_AI_API_KEY=

# Production
NEXTAUTH_URL=https://shopify-assist.warmwetcircles.com
```

### Security Checklist Reference
- OWASP Top 10
- NextAuth security best practices
- Vercel security headers

## Test Plan
- [ ] `npm audit` shows no high/critical vulnerabilities
- [ ] `npm run build` completes successfully
- [ ] All pages accessible with valid session
- [ ] All pages redirect to login without session
- [ ] API routes return 401 for unauthenticated requests
- [ ] Vercel preview deployment works

## Completion Evidence
_To be filled when complete_
