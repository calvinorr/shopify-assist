import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SyncButton } from "@/components/shopify/sync-button";
import { Instagram, FileText, TrendingUp, Clock, Palette, MapPin, ShoppingBag } from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Dashboard"
        description="Weekly overview of your content performance"
      />
      <div className="p-6" style={{ backgroundColor: 'var(--background)' }}>
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Instagram Posts</CardTitle>
              <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--indigo-light)' }}>
                <Instagram className="h-4 w-4" style={{ color: 'var(--indigo)' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>0</div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>scheduled this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--madder-light)' }}>
                <FileText className="h-4 w-4" style={{ color: 'var(--madder)' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>0</div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>drafts in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--success-light)' }}>
                <TrendingUp className="h-4 w-4" style={{ color: 'var(--success)' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>--%</div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>avg engagement rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Time</CardTitle>
              <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--weld-light)' }}>
                <Clock className="h-4 w-4" style={{ color: 'var(--weld)' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>--:--</div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>optimal posting time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Best Selling Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--walnut-light)' }}>
                  <Palette className="h-5 w-5" style={{ color: 'var(--walnut)' }} />
                </div>
                Top Selling Colors
              </CardTitle>
              <CardDescription>Last 7 days by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="flex h-48 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--background)' }}
              >
                <p style={{ color: 'var(--text-muted)' }}>Sync products to see color data</p>
              </div>
            </CardContent>
          </Card>

          {/* Audience Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--indigo-light)' }}>
                  <MapPin className="h-5 w-5" style={{ color: 'var(--indigo)' }} />
                </div>
                Audience Location
              </CardTitle>
              <CardDescription>Where your customers are</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="flex h-48 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--background)' }}
              >
                <p style={{ color: 'var(--text-muted)' }}>Connect Instagram to see audience data</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Sync data and create content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="flex items-center justify-between rounded-lg p-4"
                style={{ backgroundColor: 'var(--background)', border: '1px solid var(--card-border)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--weld-light)' }}>
                    <ShoppingBag className="h-5 w-5" style={{ color: 'var(--weld)' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Sync Shopify Products</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Fetch latest products, inventory, and pricing
                    </p>
                  </div>
                </div>
                <SyncButton />
              </div>
              <div
                className="flex items-center justify-between rounded-lg p-4"
                style={{ backgroundColor: 'var(--background)', border: '1px solid var(--card-border)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--indigo-light)' }}>
                    <Instagram className="h-5 w-5" style={{ color: 'var(--indigo)' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Connect Instagram</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Link your business account for analytics
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Coming Soon</Button>
              </div>
              <div
                className="flex items-center justify-between rounded-lg p-4"
                style={{ backgroundColor: 'var(--background)', border: '1px solid var(--card-border)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--madder-light)' }}>
                    <FileText className="h-5 w-5" style={{ color: 'var(--madder)' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Create Blog Post</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Use AI to scaffold SEO-optimized content
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">Start Writing</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
