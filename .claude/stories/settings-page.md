# Story: Settings Page

**Epic:** See `.claude/epic.md`
**Status:** not-started
**Priority:** P1
**Created:** 2024-12-06
**Updated:** 2024-12-06 15:30

## Objective
Create a settings page with user profile management, admin controls, and app configuration.

## Acceptance Criteria

### User Profile
- [ ] Display current user email and name
- [ ] Change password functionality
- [ ] Update display name

### Admin Controls (admin users only)
- [ ] View list of allowed emails
- [ ] Add new allowed email
- [ ] Remove allowed email
- [ ] View list of registered users

### Shopify Connection
- [ ] Show connection status (connected/disconnected)
- [ ] Display last sync timestamp
- [ ] Manual resync trigger button
- [ ] Show product count

### App Preferences
- [ ] Theme toggle (light/dark) - optional
- [ ] Default content settings

## Implementation Notes

### Components
- `SettingsLayout` - Tab-based navigation (Profile, Admin, Shopify, Preferences)
- `PasswordChangeForm` - Current + new password with validation
- `AllowedEmailsManager` - List with add/remove for admins
- `ShopifyStatus` - Connection card with sync button

### API Routes
- `PATCH /api/user/profile` - Update name
- `POST /api/user/password` - Change password
- `GET /api/admin/allowed-emails` - List allowed emails (admin only)
- `POST /api/admin/allowed-emails` - Add email (admin only)
- `DELETE /api/admin/allowed-emails/[email]` - Remove email (admin only)

### Security
- Password change requires current password verification
- Admin routes check `isAdmin` flag on user

## Test Plan
- [ ] Non-admin users cannot see Admin tab
- [ ] Password change works with correct current password
- [ ] Password change fails with incorrect current password
- [ ] Admin can add/remove allowed emails
- [ ] Shopify resync triggers and updates timestamp

## Completion Evidence
_To be filled when complete_
