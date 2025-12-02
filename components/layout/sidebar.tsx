"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Instagram,
  FileText,
  BarChart3,
  Settings,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Instagram", href: "/dashboard/instagram", icon: Instagram },
  { name: "Blog", href: "/dashboard/blog", icon: FileText },
  { name: "Products", href: "/dashboard/products", icon: Palette },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6">
        <Palette className="h-6 w-6 text-amber-600" />
        <span className="text-lg font-semibold">Shopify Assist</span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="rounded-md bg-amber-50 p-3 text-xs text-amber-800">
          <p className="font-medium">Dev Mode Active</p>
          <p className="mt-1 text-amber-600">Auth bypass enabled</p>
        </div>
      </div>
    </aside>
  );
}
