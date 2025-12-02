"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SyncButton } from "@/components/shopify/sync-button";
import {
  Instagram,
  FileText,
  TrendingUp,
  Clock,
  Palette,
  MapPin,
  ShoppingBag,
  Package,
  Loader2,
} from "lucide-react";
import Image from "next/image";

interface ProductStats {
  totalProducts: number;
  totalInventory: number;
  colorDistribution: Array<{ color: string; count: number }>;
  recentProducts: Array<{
    id: string;
    name: string;
    color: string | null;
    price: number | null;
    inventory: number | null;
    imageUrls: string[];
  }>;
}

export function DashboardContent() {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      const res = await fetch("/api/products/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p style={{ color: 'var(--danger)' }}>{error}</p>
      </div>
    );
  }

  const hasProducts = stats && stats.totalProducts > 0;

  return (
    <div className="p-6" style={{ backgroundColor: 'var(--background)' }}>
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--weld-light)' }}>
              <Package className="h-4 w-4" style={{ color: 'var(--weld)' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats?.totalProducts ?? 0}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>synced from Shopify</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--success-light)' }}>
              <TrendingUp className="h-4 w-4" style={{ color: 'var(--success)' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats?.totalInventory?.toLocaleString() ?? 0}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>units in stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Color Variants</CardTitle>
            <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--walnut-light)' }}>
              <Palette className="h-4 w-4" style={{ color: 'var(--walnut)' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats?.colorDistribution?.length ?? 0}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>unique colors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Time</CardTitle>
            <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--indigo-light)' }}>
              <Clock className="h-4 w-4" style={{ color: 'var(--indigo)' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>--:--</div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>connect Instagram</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Color Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--walnut-light)' }}>
                <Palette className="h-5 w-5" style={{ color: 'var(--walnut)' }} />
              </div>
              Top Colors
            </CardTitle>
            <CardDescription>Products by dye color</CardDescription>
          </CardHeader>
          <CardContent>
            {hasProducts && stats.colorDistribution.length > 0 ? (
              <div className="space-y-3">
                {stats.colorDistribution.slice(0, 6).map((item) => (
                  <div key={item.color} className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {item.color || "Unspecified"}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: 'var(--weld)',
                          width: `${Math.min((item.count / stats.totalProducts) * 200, 120)}px`,
                        }}
                      />
                      <span className="text-xs w-8 text-right" style={{ color: 'var(--text-muted)' }}>
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="flex h-48 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--background)' }}
              >
                <p style={{ color: 'var(--text-muted)' }}>Sync products to see color data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--madder-light)' }}>
                <ShoppingBag className="h-5 w-5" style={{ color: 'var(--madder)' }} />
              </div>
              Recent Products
            </CardTitle>
            <CardDescription>Latest from your catalog</CardDescription>
          </CardHeader>
          <CardContent>
            {hasProducts && stats.recentProducts.length > 0 ? (
              <div className="space-y-3">
                {stats.recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-lg p-2"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    {product.imageUrls[0] ? (
                      <Image
                        src={product.imageUrls[0]}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                        style={{ width: 40, height: 40 }}
                      />
                    ) : (
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-md"
                        style={{ backgroundColor: 'var(--card-border)' }}
                      >
                        <Package className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {product.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {product.color || "No color"} • {product.inventory ?? 0} in stock
                      </p>
                    </div>
                    {product.price && (
                      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        £{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="flex h-48 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--background)' }}
              >
                <p style={{ color: 'var(--text-muted)' }}>No products synced yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
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
  );
}
