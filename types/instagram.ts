export type InstagramPostStatus = "draft" | "scheduled" | "posted" | "failed";

export interface InstagramPost {
  id: string;
  userId: string | null;
  shopifyProductId: string | null;
  caption: string | null;
  imageUrls: string[];
  hashtags: string[];
  scheduledTime: Date | null;
  postedTime: Date | null;
  status: InstagramPostStatus;
  instagramPostId: string | null;
  likes: number;
  comments: number;
  saves: number;
  impressions: number;
  engagementRate: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstagramInsights {
  followers: number;
  following: number;
  postsCount: number;
  avgEngagementRate: number;
  peakPostingTimes: string[];
  audienceLocations: AudienceLocation[];
}

export interface AudienceLocation {
  country: string;
  percentage: number;
}

export interface PostIdea {
  id: string;
  type: "carousel" | "single" | "reel";
  title: string;
  description: string;
  reasoning: string;
  suggestedProduct: string | null;
  suggestedHashtags: string[];
}

export interface CaptionVariation {
  id: string;
  caption: string;
  tone: "educational" | "personal" | "promotional";
}
