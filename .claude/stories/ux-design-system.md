# Story: Design System Standardization

**Priority:** P1
**Status:** complete
**Epic:** UX/UI Professional Polish

## Overview

Create consistent, polished component styling across the entire application. Standardize spacing, form inputs, icons, badges, and page headers to eliminate the "scrappy" feel.

## Current Issues Identified

1. **Form Inputs** - Inconsistent: some use `<Input>` component, others raw `<input>` with inline styles
2. **Icons & Badges** - Varying sizes (h-4 w-4, h-5 w-5), inconsistent positioning
3. **Page Headers** - Basic `<Header>` component, needs more visual weight
4. **Spacing** - Random padding values (p-4, p-6, px-3), no consistent rhythm
5. **Select Dropdowns** - Completely custom in products page vs no standard component

## Design Tokens to Standardize

### Spacing Scale
```css
--space-1: 0.25rem;   /* 4px - tight gaps */
--space-2: 0.5rem;    /* 8px - small gaps */
--space-3: 0.75rem;   /* 12px - component padding */
--space-4: 1rem;      /* 16px - section gaps */
--space-6: 1.5rem;    /* 24px - large section gaps */
--space-8: 2rem;      /* 32px - page margins */
```

### Icon Sizes
- **sm**: 16px (h-4 w-4) - inline, badges, tight spaces
- **md**: 20px (h-5 w-5) - default, navigation, buttons
- **lg**: 24px (h-6 w-6) - feature icons, empty states

## Acceptance Criteria

### Form Components
- [x] Create `<Select>` component matching Input styling
- [x] Create `<Textarea>` component with consistent styling
- [x] All form fields use h-10 height consistently
- [x] Consistent focus ring style across all inputs
- [ ] Add `<FormLabel>` and `<FormGroup>` wrapper components (deferred)

### Page Headers
- [x] Increase visual weight: larger title, better description styling
- [x] Consistent bottom border treatment
- [ ] Optional: breadcrumb support for deep pages (deferred)
- [x] Standardize header height (h-16 → h-18 or similar)
- [x] Better spacing between title and description

### Icons & Badges
- [x] Document icon size conventions (sm/md/lg)
- [x] Create `<Badge>` component with variants: default, success, warning, danger, muted
- [x] Consistent badge padding: px-2 py-0.5 for small, px-3 py-1 for normal
- [x] Icons in buttons: always mr-2 gap

### Sidebar Polish
- [x] Increase nav item padding (py-2.5 → py-3)
- [x] Better spacing between nav sections
- [x] Consistent icon-to-label gap (gap-3 throughout)
- [ ] Add subtle dividers between nav groups if needed (deferred)

### Spacing Audit
- [x] Page content: consistent p-6 or p-8
- [x] Card padding: p-4 for compact, p-6 for standard
- [x] Section gaps: space-y-6 between major sections
- [x] Grid gaps: gap-4 for tight grids, gap-6 for cards

## Components to Create/Update

### New Components
- `components/ui/select.tsx` - Styled select dropdown
- `components/ui/textarea.tsx` - Styled textarea
- `components/ui/badge.tsx` - Status/tag badges
- `components/ui/form-group.tsx` - Form field wrapper with label

### Components to Update
- `components/ui/button.tsx` - Verify consistency
- `components/ui/input.tsx` - Add size variants
- `components/ui/card.tsx` - Add padding variants
- `components/layout/header.tsx` - Enhanced styling
- `components/layout/sidebar.tsx` - Polish spacing

### Pages to Audit/Fix
- `app/dashboard/products/page.tsx` - Replace raw inputs with components
- `app/dashboard/blog/new/page.tsx` - Form consistency
- `app/dashboard/settings/page.tsx` - If exists, full audit

## Implementation Order

1. Create new base components (Select, Badge, Textarea)
2. Update existing components (Header, Input, Card)
3. Audit and fix products page
4. Audit and fix blog pages
5. Sidebar polish
6. Full spacing pass

## Files to Modify

- `app/globals.css` - Add spacing tokens
- `components/ui/select.tsx` (new)
- `components/ui/textarea.tsx` (new)
- `components/ui/badge.tsx` (new)
- `components/ui/input.tsx`
- `components/ui/card.tsx`
- `components/layout/header.tsx`
- `components/layout/sidebar.tsx`
- `app/dashboard/products/page.tsx`
- Multiple blog-related pages
