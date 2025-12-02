# Story: Basic Blog Editor

**Epic:** See `.claude/epic.md`
**Status:** not-started
**Priority:** P1
**Created:** 2024-12-02
**Updated:** 2024-12-02

## Objective
Implement a WYSIWYG blog editor using TipTap for creating and editing blog posts, saved to Turso.

## Acceptance Criteria
- [ ] `/dashboard/blog` route shows list of blog posts (drafts + published)
- [ ] "New Post" button opens editor
- [ ] TipTap editor with: headings, bold, italic, lists, links, images
- [ ] Title and slug fields
- [ ] Auto-save draft every 30 seconds
- [ ] Manual save button
- [ ] Status workflow: Draft → Ready for Review
- [ ] Preview mode shows rendered HTML
- [ ] Export as HTML (copy to clipboard for Shopify)

## Implementation Notes

### TipTap Setup
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
```

### Editor Extensions
- StarterKit (headings, bold, italic, lists, blockquote)
- Image (upload/insert images)
- Link (add hyperlinks)
- Placeholder (empty state hint)

### Database
Uses existing `blog_posts` table:
- id, title, slug, content_html, content_markdown, status, created_at, updated_at

### Components to Create
- `components/editor/BlogEditor.tsx` - Main TipTap editor
- `components/editor/EditorToolbar.tsx` - Formatting buttons
- `components/editor/ImageUpload.tsx` - Image insertion
- `app/dashboard/blog/page.tsx` - Blog list page
- `app/dashboard/blog/[id]/page.tsx` - Editor page
- `app/api/blog/route.ts` - CRUD endpoints

### Auto-Save
Use debounced save (30s) with visual indicator ("Saving...", "Saved")

## Test Plan
- [ ] Editor loads with all formatting options
- [ ] Content saves to database correctly
- [ ] Auto-save triggers after changes
- [ ] Preview renders HTML accurately
- [ ] Export copies valid HTML to clipboard

## Completion Evidence
_To be filled when complete_
