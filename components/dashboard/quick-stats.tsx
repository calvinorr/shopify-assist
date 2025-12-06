import { Package, TrendingUp, Palette } from "lucide-react";

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
}: QuickStatsProps) {
  const stats = [
    {
      icon: Package,
      value: productCount,
      label: "Products",
      color: "var(--indigo)",
    },
    {
      icon: TrendingUp,
      value: inventoryTotal.toLocaleString(),
      label: "In Stock",
      color: "var(--success)",
    },
    {
      icon: Palette,
      value: colorCount,
      label: "Colors",
      color: "var(--weld)",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Icon className="h-4 w-4" style={{ color: stat.color }} />
              <span
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {stat.value}
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
