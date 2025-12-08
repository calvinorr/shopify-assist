# Story: Admin Manager

**Epic:** See `.claude/epic.md`
**Status:** not-started
**Priority:** P0
**Created:** 2025-12-08
**Updated:** 2025-12-08

## Objective
Make calvin.orr@gmail.com the administrator for the website to enable, allow, and manage users.

## Acceptance Criteria
- [ ] calvin.orr@gmail.com is set as admin in database (`isAdmin: true`)
- [ ] Admin can view all allowed emails in Settings page
- [ ] Admin can add new emails to allowlist
- [ ] Admin can remove emails from allowlist (with safety checks)
- [ ] Non-admin users cannot access user management features
- [ ] Admin actions are audit logged

## Implementation Notes

### Database Setup
1. Run script to set calvin.orr@gmail.com as admin
2. Ensure email is in allowedEmails table

### UI Components
- Settings page already has "Allowed Users" section
- Needs to be restricted to admin-only visibility
- Add/remove functionality should be wired up

### API Endpoints (Already Exist)
- `GET /api/admin/allowed-emails` - List all
- `POST /api/admin/allowed-emails` - Add email
- `DELETE /api/admin/allowed-emails/[email]` - Remove email

### Security
- All endpoints already require admin check
- Rate limiting already applied
- Self-lockout prevention already implemented

## Test Plan
1. Verify calvin.orr@gmail.com can access admin endpoints
2. Verify non-admin users get 403 on admin endpoints
3. Test add/remove email functionality in UI
4. Verify audit logs are created

## Completion Evidence
_Filled when complete_
