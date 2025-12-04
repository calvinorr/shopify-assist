# AI Suggestions Components

Components for displaying AI-generated content suggestions on the dashboard.

## BlogTopicCard

A prominent card component for displaying AI-suggested blog topics with expandable reasoning and keyword tags.

### Usage

```tsx
import { BlogTopicCard } from "@/components/dashboard/ai-suggestions/blog-topic-card";

<BlogTopicCard
  title="The Science Behind Natural Indigo Dyeing"
  description="Explore the chemistry and traditional techniques of indigo dyeing, from vat preparation to oxidation. Perfect for educating customers about the craft behind their favorite blue yarns."
  reasoning="This topic aligns with your top-selling indigo colorways and addresses common customer questions about colorfastness and care. Educational content like this builds trust and positions Herbarium as an expert in natural dyes."
  suggestedKeywords={[
    "natural indigo",
    "vat dyeing",
    "indigo chemistry",
    "sustainable yarn",
    "hand-dyed wool"
  ]}
  onStart={() => {
    // Optional custom handler
    router.push("/dashboard/blog/new?topic=indigo-dyeing");
  }}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | The blog post title suggestion |
| `description` | `string` | Yes | A brief description of what the post should cover |
| `reasoning` | `string` | Yes | AI explanation of why this topic was suggested (expandable) |
| `suggestedKeywords` | `string[]` | Yes | SEO keywords relevant to the topic |
| `onStart` | `() => void` | No | Custom handler for "Start This Post" button. Defaults to navigating to `/dashboard/blog/new` |

### Design Features

- **Full-width layout**: Designed to span multiple columns in a grid
- **Expandable reasoning**: Collapsible "Why this topic?" section with sparkle icon
- **Keyword pills**: Warm, organic tag styling using `--weld-light` background
- **FileText badge**: Madder-colored icon badge in header
- **Artisan aesthetic**: Warm colors, ample spacing, editorial feel
- **Hover effects**: Subtle shadow and background transitions

### Visual Design

The component uses the artisan color palette:
- **Primary accent**: `--madder` (terracotta red) for icon and button
- **Keyword tags**: `--weld-light` background with `--walnut` text
- **Reasoning section**: `--weld` (golden yellow) sparkle icon
- **Card styling**: Standard card components with hover elevation

### Example in Dashboard Grid

```tsx
<div className="grid gap-6 lg:grid-cols-2">
  {/* Other dashboard cards */}

  {/* Blog suggestion - spans full width */}
  <div className="lg:col-span-2">
    <BlogTopicCard
      title="Seasonal Color Theory: Spring 2025 Palette"
      description="Predict and prepare your spring collection based on seasonal color trends and past sales data from your Shopify store."
      reasoning="Your madder reds and walnut browns sold exceptionally well last spring. This post can preview your new seasonal colors while explaining color psychology and seasonal wardrobe planning."
      suggestedKeywords={[
        "spring colors",
        "seasonal palette",
        "hand-dyed yarn",
        "color theory",
        "2025 trends"
      ]}
    />
  </div>
</div>
```

### Accessibility

- Keyboard navigable expand/collapse button
- Focus-visible states using global CSS
- Semantic HTML structure
- Clear button labels
- Sufficient color contrast

### Related Components

- Instagram idea cards (coming soon)
- Instagram caption cards (coming soon)
