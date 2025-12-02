"use client";

import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
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
          <p
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
