# Story: Settings Page

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P1
**Created:** 2024-12-06
**Updated:** 2024-12-06 16:30

## Objective
Create a settings page with user profile management, admin controls, and app configuration.

## Acceptance Criteria

### User Profile
- [x] Display current user email and name
- [x] Change password functionality
- [x] Update display name

### Admin Controls (admin users only)
- [x] View list of allowed emails
- [x] Add new allowed email
- [x] Remove allowed email
- [x] View list of registered users

### Shopify Connection
- [x] Show connection status (connected/disconnected)
- [x] Display last sync timestamp
- [x] Manual resync trigger button
- [x] Show product count

### App Preferences
- [x] Theme toggle (light/dark) - optional (placeholder for future)
- [x] Default content settings (placeholder for future)

## Implementation Notes

### Components
- `SettingsLayout` - Tab-based navigation (Profile, Admin, Shopify, Preferences)
- `PasswordChangeForm` - Current + new password with validation
- `AllowedEmailsManager` - List with add/remove for admins
- `ShopifyStatus` - Connection card with sync button

### API Routes
- `GET /api/user/profile` - Get current user profile
- `PATCH /api/user/profile` - Update name
- `POST /api/user/password` - Change password
- `GET /api/admin/allowed-emails` - List allowed emails (admin only)
- `POST /api/admin/allowed-emails` - Add email (admin only)
- `DELETE /api/admin/allowed-emails/[email]` - Remove email (admin only)
- `GET /api/admin/users` - List all users (admin only)
- `GET /api/shopify/status` - Connection status and stats

### Security
- Password change requires current password verification
- Admin routes check `isAdmin` flag on user

## Test Plan
- [x] Non-admin users cannot see Admin tab
- [x] Password change works with correct current password
- [x] Password change fails with incorrect current password
- [x] Admin can add/remove allowed emails
- [x] Shopify resync triggers and updates timestamp

## Completion Evidence

### Files Created
- `app/dashboard/settings/page.tsx` - Full settings page with 4 tabs
- `app/api/user/profile/route.ts` - GET/PATCH user profile
- `app/api/user/password/route.ts` - POST password change
- `app/api/admin/allowed-emails/route.ts` - GET/POST allowed emails
- `app/api/admin/allowed-emails/[email]/route.ts` - DELETE allowed email
- `app/api/admin/users/route.ts` - GET all users
- `app/api/shopify/status/route.ts` - GET connection status

### Design
- "Artisan Ledger" aesthetic with vertical tab navigation
- Warm organic tones matching Herbarium brand
- Animated tab transitions
- Connection status cards with visual indicators

### Build Status
- Build passes with no TypeScript errors
- All routes registered in Next.js

**Completed:** 2024-12-06
