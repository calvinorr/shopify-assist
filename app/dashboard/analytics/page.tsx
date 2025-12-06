"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  DollarSign,
  FileText,
  Instagram,
  Eye,
  Heart,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// API Response Types (matching actual API responses)
interface OverviewResponse {
  totalProducts: number;
  totalInventoryValue: number;
  productsByStatus: { inStock: number; outOfStock: number };
  totalBlogPosts: number;
  totalInstagramPosts: number;
}

interface ProductsResponse {
  topProducts: Array<{
    id: string;
    name: string;
    color: string | null;
    price: number;
    inventory: number;
    inventoryValue: number;
    imageUrls: string[];
  }>;
  colorDistribution: Array<{ color: string; count: number }>;
  lowStockAlerts: Array<{
    id: string;
    name: string;
    inventory: number;
  }>;
}

interface ContentResponse {
  blogPostsByStatus: Array<{ status: string; count: number }>;
  instagramPostsByStatus: Array<{ status: string; count: number }>;
  recentActivity: Array<{ type: string; id: string; createdAt: string }>;
}

interface SalesResponse {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  salesByDay: Array<{ date: string; revenue: number; orders: number }>;
}

interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [contentData, setContentData] = useState<ContentResponse | null>(null);
  const [salesData, setSalesData] = useState<SalesResponse | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const [overviewRes, productsRes, contentRes, salesRes] = await Promise.all([
        fetch("/api/analytics/overview"),
        fetch("/api/analytics/products"),
        fetch("/api/analytics/content"),
        fetch("/api/analytics/sales?days=30"),
      ]);

      if (overviewRes.ok) {
        const data: OverviewResponse = await overviewRes.json();
        setOverview(data);
      }

      if (productsRes.ok) {
        const data: ProductsResponse = await productsRes.json();
        setProductsData(data);
      }

      if (contentRes.ok) {
        const data: ContentResponse = await contentRes.json();
        setContentData(data);
      }

      if (salesRes.ok) {
        const data: SalesResponse = await salesRes.json();
        setSalesData(data);
        setChartData(data.salesByDay || []);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  // Helper to get count by status from content data
  const getBlogCount = (status: string) => {
    return contentData?.blogPostsByStatus.find(s => s.status === status)?.count || 0;
  };

  const getInstagramCount = (status: string) => {
    return contentData?.instagramPostsByStatus.find(s => s.status === status)?.count || 0;
  };

  const totalBlogPosts = contentData?.blogPostsByStatus.reduce((sum, s) => sum + s.count, 0) || 0;
  const totalInstagramPosts = contentData?.instagramPostsByStatus.reduce((sum, s) => sum + s.count, 0) || 0;

  return (
    <div className="min-h-screen p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-light tracking-tight mb-2"
          style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
        >
          Analytics
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Performance insights across products and content
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={overview?.totalProducts || 0}
              icon={Package}
              color="indigo"
              subtitle={`${overview?.productsByStatus.inStock || 0} in stock`}
            />
            <StatCard
              title="Inventory Value"
              value={`£${((overview?.totalInventoryValue || 0) / 1000).toFixed(1)}k`}
              icon={DollarSign}
              color="weld"
              subtitle={`${overview?.productsByStatus.outOfStock || 0} out of stock`}
            />
            <StatCard
              title="Total Revenue"
              value={`£${(salesData?.totalRevenue || 0).toFixed(0)}`}
              icon={TrendingUp}
              color="walnut"
              subtitle={`${salesData?.totalOrders || 0} orders (30d)`}
            />
            <StatCard
              title="Content Created"
              value={totalBlogPosts + totalInstagramPosts}
              icon={FileText}
              color="madder"
              subtitle={`${totalBlogPosts} blog, ${totalInstagramPosts} Instagram`}
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales/Inventory Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: "var(--indigo-light)" }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: "var(--indigo)" }} />
            </div>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Sales & Inventory Trend
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Last 30 days
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="rgb(61, 90, 128)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="rgb(61, 90, 128)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="inventoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="rgb(201, 166, 107)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="rgb(201, 166, 107)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  stroke="var(--card-border)"
                />
                <YAxis
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  stroke="var(--card-border)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                  }}
                />
                <Legend
                  wrapperStyle={{ color: "var(--text-secondary)", fontSize: "14px" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="rgb(61, 90, 128)"
                  fillOpacity={1}
                  fill="url(#salesGradient)"
                  name="Revenue (£)"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="rgb(201, 166, 107)"
                  fillOpacity={1}
                  fill="url(#inventoryGradient)"
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No chart data available
              </p>
            </div>
          )}
        </Card>

        {/* Content Performance Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: "var(--walnut-light)" }}
            >
              <BarChart3 className="w-5 h-5" style={{ color: "var(--walnut)" }} />
            </div>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Content Overview
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Blog and Instagram metrics
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : contentData ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={[
                  {
                    name: "Blog",
                    published: getBlogCount("published"),
                    drafts: getBlogCount("draft"),
                  },
                  {
                    name: "Instagram",
                    posted: getInstagramCount("posted"),
                    drafts: getInstagramCount("draft"),
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  stroke="var(--card-border)"
                />
                <YAxis
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  stroke="var(--card-border)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                  }}
                />
                <Legend
                  wrapperStyle={{ color: "var(--text-secondary)", fontSize: "14px" }}
                />
                <Bar
                  dataKey="published"
                  fill="rgb(61, 90, 128)"
                  name="Published"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="drafts"
                  fill="rgb(201, 166, 107)"
                  name="Drafts"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No content data available
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Inventory Capital Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: "var(--weld-light)" }}
            >
              <DollarSign className="w-5 h-5" style={{ color: "var(--weld)" }} />
            </div>
            <div>
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Inventory Capital
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Stock value tied up in products — consider promoting or discounting
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold" style={{ color: "var(--weld)" }}>
              £{((overview?.totalInventoryValue || 0)).toFixed(0)}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>total tied up</p>
          </div>
        </div>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : productsData?.topProducts && productsData.topProducts.length > 0 ? (
            <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
              {/* Table Header */}
              <div
                className="px-6 py-3 grid grid-cols-12 gap-4 text-xs font-medium"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--text-muted)",
                }}
              >
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Stock Value</div>
                <div className="col-span-2 text-right">Inventory</div>
                <div className="col-span-1 text-right">Color</div>
              </div>

              {/* Table Rows */}
              {productsData.topProducts.slice(0, 10).map((product) => (
                <div
                  key={product.id}
                  className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-opacity-50 transition-colors"
                  style={{
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--background)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div className="col-span-5">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {product.name}
                    </p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      £{product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      £{product.inventoryValue.toFixed(0)}
                    </p>
                  </div>
                  <div className="col-span-2 text-right">
                    <Badge
                      variant={product.inventory > 10 ? "success" : "warning"}
                      size="sm"
                    >
                      {product.inventory} units
                    </Badge>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {product.color || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Package
                className="w-10 h-10 mx-auto mb-3"
                style={{ color: "var(--text-muted)" }}
              />
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No product data available
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Content Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blog Metrics */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: "var(--indigo-light)" }}
            >
              <FileText className="w-5 h-5" style={{ color: "var(--indigo)" }} />
            </div>
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Blog Performance
            </h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : contentData ? (
            <div className="space-y-4">
              <MetricRow
                label="Total Posts"
                value={totalBlogPosts}
                icon={FileText}
              />
              <MetricRow
                label="Published"
                value={getBlogCount("published")}
                icon={Eye}
              />
              <MetricRow
                label="Drafts"
                value={getBlogCount("draft")}
                icon={FileText}
              />
              <MetricRow
                label="In Review"
                value={getBlogCount("review")}
                icon={Eye}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No blog data available
              </p>
            </div>
          )}
        </Card>

        {/* Instagram Metrics */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: "var(--madder-light)" }}
            >
              <Instagram className="w-5 h-5" style={{ color: "var(--madder)" }} />
            </div>
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Instagram Performance
            </h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : contentData ? (
            <div className="space-y-4">
              <MetricRow
                label="Total Posts"
                value={totalInstagramPosts}
                icon={Instagram}
              />
              <MetricRow
                label="Posted"
                value={getInstagramCount("posted")}
                icon={Eye}
              />
              <MetricRow
                label="Drafts"
                value={getInstagramCount("draft")}
                icon={FileText}
              />
              <MetricRow
                label="Scheduled"
                value={getInstagramCount("scheduled")}
                icon={Heart}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No Instagram data available
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// Helper Components

function StatCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="animate-pulse space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </Card>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  subtitle?: string;
  color: "indigo" | "weld" | "walnut" | "madder";
}

function StatCard({ title, value, icon: Icon, subtitle, color }: StatCardProps) {
  const colorMap = {
    indigo: { bg: "var(--indigo-light)", fg: "var(--indigo)" },
    weld: { bg: "var(--weld-light)", fg: "var(--weld)" },
    walnut: { bg: "var(--walnut-light)", fg: "var(--walnut)" },
    madder: { bg: "var(--madder-light)", fg: "var(--madder)" },
  };

  const colors = colorMap[color];

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          {title}
        </p>
        <div className="rounded-lg p-2" style={{ backgroundColor: colors.bg }}>
          <Icon className="w-4 h-4" style={{ color: colors.fg }} />
        </div>
      </div>

      <p
        className="text-2xl font-semibold mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </p>

      {subtitle && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </p>
      )}
    </Card>
  );
}

interface MetricRowProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

function MetricRow({ label, value, icon: Icon }: MetricRowProps) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
      </div>
      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}
