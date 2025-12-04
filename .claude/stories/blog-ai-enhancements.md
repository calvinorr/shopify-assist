# Story: Blog AI Enhancements

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P2
**Created:** 2024-12-03
**Updated:** 2024-12-03 17:00

## Objective
Add AI-powered features to the blog editor using Gemini Flash to help users create better content faster.

## Acceptance Criteria
- [x] "Generate Excerpt" button in sidebar that creates a summary from blog content
- [x] "Suggest Tags" button that analyzes content and suggests relevant tags
- [x] Loading states while AI is generating
- [x] Generated content populates the respective fields (user can edit before saving)
- [x] Graceful error handling if AI generation fails

## Implementation Notes

### API Endpoints
Create `/api/ai/blog` endpoint with actions:
- `generateExcerpt` - Takes HTML content, returns 2-3 sentence summary
- `suggestTags` - Takes HTML content, returns comma-separated tags

### Gemini Integration
Use existing `lib/gemini.ts` helper functions:
```typescript
import { generateText } from "@/lib/gemini";

// For excerpt
const excerpt = await generateText(
  `Summarize this blog post in 2-3 sentences for a preview: ${stripHtml(content)}`
);

// For tags
const tags = await generateText(
  `Suggest 3-5 relevant tags for this blog post about natural dyes and wool crafting. Return only comma-separated tags: ${stripHtml(content)}`
);
```

### UI Changes
Add to sidebar in both `/dashboard/blog/new/page.tsx` and `/dashboard/blog/[id]/page.tsx`:
- Small "Generate" button next to Excerpt label
- Small "Suggest" button next to Tags label
- Use Sparkles or Wand2 icon from lucide-react

### Prompt Engineering
- Keep prompts focused on Herbarium's domain (natural dyes, wool, crafting)
- Limit excerpt to 150-200 characters
- Limit tags to 3-5 relevant keywords

## Test Plan
- [x] Generate excerpt from sample blog content
- [x] Verify excerpt is appropriate length and captures main points
- [x] Suggest tags from sample blog content
- [x] Verify tags are relevant to natural dye/wool topics
- [x] Test error handling when content is empty
- [x] Test error handling when API fails

## Completion Evidence
- Build: `npm run build` passes (17/17 pages)
- New post page: `app/dashboard/blog/new/page.tsx` - AI buttons at lines 325-395
- Edit post page: `app/dashboard/blog/[id]/page.tsx` - AI buttons at lines 433-502
- API endpoint: `app/api/ai/blog/route.ts` - handles `excerpt` and `tags` actions
- Error handling: Empty content shows toast "Please write some content first"
- Loading states: Loader2 spinner + "Generating..."/"Suggesting..." text

## Dependencies
- Gemini API key configured (`GOOGLE_AI_API_KEY`)
- `lib/gemini.ts` helper functions

## Notes
This is a post-alpha enhancement. Focus on core functionality first.
