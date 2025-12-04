"use client";

import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

interface HeaderProps {
  title: string;
  description?: string | ReactNode;
  children?: ReactNode;
}

export function Header({ title, description, children }: HeaderProps) {
  return (
    <header
      className="flex h-16 items-center justify-between px-6"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderBottom: '1px solid var(--card-border)'
      }}
    >
      <div>
        <h1
          className="text-xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h1>
        {description && (
          <div
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {description}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children || (
          <>
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
