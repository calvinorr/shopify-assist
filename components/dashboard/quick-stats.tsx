import { Package, TrendingUp, Palette, FileText } from 'lucide-react';

interface QuickStatsProps {
  productCount: number;
  inventoryTotal: number;
  colorCount: number;
  postsThisWeek?: number;
}

export function QuickStats({
  productCount,
  inventoryTotal,
  colorCount,
  postsThisWeek = 0,
}: QuickStatsProps) {
  const stats = [
    {
      icon: Package,
      value: productCount,
      label: 'Products',
    },
    {
      icon: TrendingUp,
      value: inventoryTotal,
      label: 'Inventory',
    },
    {
      icon: Palette,
      value: colorCount,
      label: 'Colors',
    },
    {
      icon: FileText,
      value: postsThisWeek,
      label: 'Posts',
    },
  ];

  return (
    <div className="flex items-center gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--card-border)] bg-[var(--background)]"
          >
            <Icon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {stat.value}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {stat.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
