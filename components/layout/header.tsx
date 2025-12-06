"use client";

import { type ReactNode } from "react";

interface HeaderProps {
  title: string;
  description?: string | ReactNode;
  children?: ReactNode;
}

export function Header({ title, description, children }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-6 py-5"
      style={{
        backgroundColor: "var(--card-bg)",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      <div className="space-y-1">
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h1>
        {description && (
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>
            {description}
          </div>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  );
}
