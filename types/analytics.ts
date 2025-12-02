export interface DailyAnalytics {
  id: string;
  date: string;
  topColors: ColorAnalytics[];
  audienceLocation: LocationBreakdown;
  peakPostingTime: string | null;
  instagramEngagementRate: number | null;
  instagramPostCount: number;
  blogViews: number;
  blogClicksToShop: number;
  createdAt: Date;
}

export interface ColorAnalytics {
  color: string;
  sales: number;
  revenue: number;
  locationBreakdown: LocationBreakdown;
}

export interface LocationBreakdown {
  uk: number;
  us: number;
  canada: number;
  other: number;
}

export interface WeeklySummary {
  period: string;
  topColors: string[];
  totalRevenue: number;
  instagramEngagement: number;
  postsCreated: number;
  postsScheduled: number;
  blogPostsPublished: number;
}

export interface SeasonalTrend {
  month: string;
  pattern: string;
  topColors: string[];
  revenueChange: number;
}
