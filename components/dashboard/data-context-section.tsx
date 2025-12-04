'use client';

import { Palette, Package } from 'lucide-react';

interface DataContextProps {
  topColors: Array<{ color: string; count: number }>;
  recentProducts: Array<{ name: string; color: string }>;
  isLoading?: boolean;
}

export function DataContextSection({
  topColors,
  recentProducts,
  isLoading = false,
}: DataContextProps) {
  // Calculate total for percentages
  const totalColorCount = topColors.reduce((sum, item) => sum + item.count, 0);

  // Normalize color names for consistent styling
  const getColorClass = (colorName: string): string => {
    const normalized = colorName.toLowerCase();

    // Map common color names to CSS classes or use a default
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      indigo: 'bg-indigo-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      pink: 'bg-pink-500',
      gray: 'bg-gray-500',
      grey: 'bg-gray-500',
    };

    // Find a matching color
    for (const [key, value] of Object.entries(colorMap)) {
      if (normalized.includes(key)) {
        return value;
      }
    }

    // Default to weld color
    return 'bg-[var(--weld)]';
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-[var(--card-border)]" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--card-border)]" />
                <div className="h-2 animate-pulse rounded bg-[var(--card-border)]" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-[var(--card-border)]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
      <p className="mb-4 text-sm text-[var(--text-muted)]">
        Why these suggestions?
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column: Top Colors */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Palette className="h-4 w-4 text-[var(--text-muted)]" />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              Top Colors This Week
            </h3>
          </div>

          <div className="space-y-3">
            {topColors.slice(0, 3).map((item, index) => {
              const percentage = totalColorCount > 0
                ? Math.round((item.count / totalColorCount) * 100)
                : 0;

              return (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-primary)]">
                      {item.color}
                    </span>
                    <span className="text-[var(--text-muted)]">
                      {item.count} {item.count === 1 ? 'sale' : 'sales'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--card-border)]">
                    <div
                      className={`h-full transition-all duration-500 ${getColorClass(item.color)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {topColors.length === 0 && (
            <p className="text-sm text-[var(--text-muted)]">
              No sales data available yet
            </p>
          )}
        </div>

        {/* Right Column: Recent Products */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-[var(--text-muted)]" />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              Recently Added
            </h3>
          </div>

          <div className="space-y-2.5">
            {recentProducts.slice(0, 3).map((product, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-md border border-[var(--card-border)] bg-[var(--card-bg-secondary)] px-3 py-2"
              >
                <div
                  className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${getColorClass(product.color)}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-[var(--text-primary)]">
                    {product.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {product.color}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {recentProducts.length === 0 && (
            <p className="text-sm text-[var(--text-muted)]">
              No recent products found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
