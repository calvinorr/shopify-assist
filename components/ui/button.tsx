"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: {
    backgroundColor: 'var(--text-primary)',
    color: 'var(--card-bg)',
    hover: { backgroundColor: 'var(--text-secondary)' }
  },
  secondary: {
    backgroundColor: 'var(--walnut-light)',
    color: 'var(--walnut)',
    hover: { backgroundColor: 'var(--card-border)' }
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--card-border)',
    hover: { backgroundColor: 'var(--background)' }
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    hover: { backgroundColor: 'var(--background)' }
  },
  danger: {
    backgroundColor: 'var(--danger)',
    color: 'white',
    hover: { backgroundColor: '#8b4444' }
  }
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", style, ...props }, ref) => {
    const variantStyle = variantStyles[variant];

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        style={{
          backgroundColor: variantStyle.backgroundColor,
          color: variantStyle.color,
          border: variantStyle.border || 'none',
          ...style
        }}
        onMouseEnter={(e) => {
          if (variantStyle.hover) {
            Object.assign(e.currentTarget.style, variantStyle.hover);
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = variantStyle.backgroundColor;
        }}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
