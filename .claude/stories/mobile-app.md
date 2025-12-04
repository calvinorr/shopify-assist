# Story: Mobile App for Instagram Posting

**Epic:** See `.claude/epic.md`
**Status:** backlog
**Priority:** P3
**Created:** 2024-12-03
**Updated:** 2024-12-03

## Objective
Create a mobile companion app or PWA to enable direct Instagram posting without requiring Business/Creator account API access.

## Background
Instagram Graph API requires Business/Creator accounts for direct posting. As an alternative, a mobile app approach could:
- Use share intent to open Instagram app with pre-filled content
- Provide copy-to-clipboard for captions/hashtags
- Show optimized images ready for manual posting
- Send push notifications at optimal posting times

## Acceptance Criteria
- [ ] PWA installable on mobile devices
- [ ] "Share to Instagram" button opens Instagram app with image
- [ ] One-tap copy for captions and hashtags
- [ ] Notification system for posting reminders
- [ ] Offline support for viewing scheduled content

## Implementation Options

### Option 1: PWA with Share API
- Use Web Share API to share images to Instagram
- Works on iOS Safari and Android Chrome
- No app store submission required

### Option 2: React Native App
- Full native experience
- Could use deep linking to Instagram
- Requires app store submission

### Option 3: Hybrid Approach
- PWA for content creation/scheduling
- Native wrapper for push notifications
- Capacitor or similar bridge

## Trade-offs
| Approach | Pros | Cons |
|----------|------|------|
| PWA | No app store, instant updates | Limited push notifications on iOS |
| React Native | Full native features | Development overhead, app review |
| Hybrid | Best of both | Complexity |

## Dependencies
- AI Idea Generation (for content suggestions)
- Caption Generator (for copy-paste content)
- Image optimization pipeline

## Notes
- Instagram's share intent accepts images but not captions (must be copied separately)
- Consider integration with iOS Shortcuts for power users
- Push notifications on iOS require workarounds for PWA

## Future Considerations
- If user upgrades to Business account, can add direct API posting
- Track posting activity manually for analytics
