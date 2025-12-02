export type BlogPostStatus = "draft" | "review" | "published";

export interface BlogPost {
  id: string;
  userId: string | null;
  title: string;
  slug: string | null;
  contentHtml: string | null;
  contentMarkdown: string | null;
  featuredImageUrl: string | null;
  metaDescription: string | null;
  focusKeywords: string[];
  status: BlogPostStatus;
  publishedAt: Date | null;
  shopifyProductLinks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogTopicSuggestion {
  id: string;
  title: string;
  description: string;
  reasoning: string;
  suggestedKeywords: string[];
  relatedProducts: string[];
}

export interface BlogScaffold {
  title: string;
  metaDescription: string;
  sections: BlogSection[];
  suggestedImages: string[];
  callToAction: string;
}

export interface BlogSection {
  heading: string;
  content: string;
  type: "intro" | "body" | "conclusion" | "cta";
}
