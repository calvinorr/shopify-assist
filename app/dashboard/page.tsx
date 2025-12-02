import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, FileText, TrendingUp, Clock, Palette, MapPin } from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Dashboard"
        description="Weekly overview of your content performance"
      />
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Instagram Posts</CardTitle>
              <Instagram className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-zinc-500">scheduled this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-zinc-500">drafts in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--%</div>
              <p className="text-xs text-zinc-500">avg engagement rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Time</CardTitle>
              <Clock className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--:--</div>
              <p className="text-xs text-zinc-500">optimal posting time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Best Selling Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Top Selling Colors
              </CardTitle>
              <CardDescription>Last 7 days by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-center justify-center text-zinc-400">
                <p>Connect Shopify to see color data</p>
              </div>
            </CardContent>
          </Card>

          {/* Audience Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Audience Location
              </CardTitle>
              <CardDescription>Where your customers are</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-center justify-center text-zinc-400">
                <p>Connect Instagram to see audience data</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Suggested Actions</CardTitle>
            <CardDescription>AI-powered recommendations based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
                <div>
                  <p className="font-medium">Connect Shopify</p>
                  <p className="text-sm text-zinc-500">
                    Add your store credentials to start syncing product data
                  </p>
                </div>
                <Button size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
                <div>
                  <p className="font-medium">Connect Instagram</p>
                  <p className="text-sm text-zinc-500">
                    Link your business account for analytics and scheduling
                  </p>
                </div>
                <Button size="sm" variant="outline">Coming Soon</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
                <div>
                  <p className="font-medium">Create your first blog post</p>
                  <p className="text-sm text-zinc-500">
                    Use AI to scaffold SEO-optimized content
                  </p>
                </div>
                <Button size="sm" variant="secondary">Start Writing</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
