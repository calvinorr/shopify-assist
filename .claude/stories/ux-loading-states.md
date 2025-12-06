# Story: Loading States & Progress Feedback

**Priority:** P2
**Status:** complete
**Epic:** UX/UI Professional Polish

## Overview

Implement clear, informative loading states throughout the application. Focus on AI generation and product sync operations where users currently get poor feedback about progress.

## Current Issues

1. **AI Generation** - Caption/blog generation shows no progress, feels stalled
2. **Product Sync** - No feedback during Shopify sync operation
3. **Page Loads** - Simple spinner, content jumps as data arrives
4. **Save Operations** - Unclear if blog posts saved successfully

## Acceptance Criteria

### AI Generation Feedback
- [ ] Animated progress indicator during AI calls
- [ ] Contextual message: "Generating captions..." / "Creating blog outline..."
- [ ] Estimated time or progress steps if possible
- [ ] Cancel button for long operations
- [ ] Success state with smooth transition to content

### Product Sync Progress
- [ ] Modal or inline progress during sync
- [ ] Show: "Syncing products... X of Y" or percentage
- [ ] Display current operation: "Fetching from Shopify..." → "Processing..." → "Complete"
- [ ] Success summary: "298 products synced, 12 updated, 3 new"
- [ ] Error handling with retry option

### Skeleton Loaders
- [x] Dashboard sections: individual skeletons per card
- [x] Products grid: skeleton cards matching layout
- [x] Blog list: skeleton rows matching list items
- [x] AI suggestions: placeholder cards with shimmer

### Save Feedback
- [ ] Auto-save indicator: "Saving..." → "Saved" with timestamp
- [ ] Visual confirmation (checkmark animation)
- [ ] Error state: "Save failed - Retry"
- [ ] Unsaved changes warning before navigation

### Button Loading States
- [x] Disabled state + spinner during async operations
- [x] Button text changes: "Save" → "Saving..."
- [x] Prevent double-click/submit

## Technical Implementation

### Skeleton Component
```tsx
// components/ui/skeleton.tsx
<Skeleton className="h-4 w-32" />           // Text line
<Skeleton className="h-32 w-full" />        // Card
<Skeleton className="h-10 w-10 rounded-full" /> // Avatar
```

### Progress Component
```tsx
// components/ui/progress.tsx
<Progress value={65} />  // Determinate
<Progress indeterminate /> // Indeterminate
```

### Loading Button Pattern
```tsx
<Button disabled={loading}>
  {loading ? <Loader2 className="animate-spin" /> : <Save />}
  {loading ? "Saving..." : "Save"}
</Button>
```

## Files to Create

- `components/ui/skeleton.tsx` - Skeleton loader component
- `components/ui/progress.tsx` - Progress bar component
- `components/feedback/save-indicator.tsx` - Auto-save status

## Files to Modify

### AI Generation
- `app/dashboard/instagram/page.tsx` - Caption generation feedback
- `app/dashboard/blog/new/page.tsx` - AI scaffolding feedback
- `components/dashboard/ai-suggestions.tsx` - Refresh feedback

### Product Sync
- `app/api/shopify/sync/route.ts` - Return progress-friendly response
- Create sync progress component or modal

### Dashboard
- `components/dashboard/dashboard-content.tsx` - Section skeletons
- `components/dashboard/hero-section.tsx` - Skeleton state
- `components/dashboard/ai-suggestions.tsx` - Better loading

### Blog Editor
- `components/editor/tiptap-editor.tsx` - Auto-save indicator

## Loading State Hierarchy

1. **Instant** (<100ms) - No loader needed
2. **Fast** (100-500ms) - Subtle indicator (button spinner)
3. **Medium** (500ms-2s) - Skeleton or progress
4. **Slow** (>2s) - Progress with message + cancel option

## Implementation Order

1. Create `Skeleton` and `Progress` components
2. Add skeleton loaders to dashboard
3. Enhance AI generation feedback
4. Add product sync progress
5. Implement save indicator for editor
6. Button loading states audit

## Design Notes

- Use shimmer animation for skeletons
- Progress bar uses `--indigo` color
- Keep messaging concise and friendly
- Avoid excessive loading states for fast operations
