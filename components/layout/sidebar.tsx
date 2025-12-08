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
  Leaf,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
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
    <aside
      className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col"
      style={{ backgroundColor: "var(--sidebar-bg)" }}
    >
      {/* Logo */}
      <div
        className="flex h-16 items-center gap-3 px-6 border-b"
        style={{ borderColor: "var(--sidebar-hover)" }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: "var(--sidebar-accent)" }}
        >
          <Leaf className="h-5 w-5" style={{ color: "var(--sidebar-bg)" }} />
        </div>
        <div>
          <span
            className="text-base font-semibold tracking-tight"
            style={{ color: "var(--sidebar-fg)" }}
          >
            Herbarium
          </span>
          <p className="text-xs" style={{ color: "var(--sidebar-muted)" }}>
            Content Studio
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-4 py-6">
        <div className="space-y-1.5">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                  isActive ? "shadow-sm" : "hover:translate-x-0.5"
                )}
                style={{
                  backgroundColor: isActive
                    ? "var(--sidebar-hover)"
                    : "transparent",
                  color: isActive ? "var(--sidebar-fg)" : "var(--sidebar-muted)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      "var(--sidebar-hover)";
                    e.currentTarget.style.color = "var(--sidebar-fg)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--sidebar-muted)";
                  }
                }}
              >
                <item.icon
                  className="h-5 w-5"
                  style={{ color: isActive ? "var(--sidebar-accent)" : "inherit" }}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div
        className="px-4 py-4 border-t"
        style={{ borderColor: "var(--sidebar-hover)" }}
      >
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:translate-x-0.5"
          style={{
            backgroundColor: "transparent",
            color: "var(--sidebar-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
            e.currentTarget.style.color = "var(--sidebar-fg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--sidebar-muted)";
          }}
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>

      {/* Dev Mode Banner */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-4 pt-0">
          <div
            className="rounded-lg p-3 text-xs"
            style={{
              backgroundColor: "var(--sidebar-hover)",
              border: "1px dashed var(--sidebar-accent)",
            }}
          >
            <p
              className="font-medium"
              style={{ color: "var(--sidebar-accent)" }}
            >
              Dev Mode
            </p>
            <p className="mt-0.5" style={{ color: "var(--sidebar-muted)" }}>
              Auth bypass enabled
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
