import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, style, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl shadow-sm transition-shadow hover:shadow-md",
        className
      )}
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        ...style
      }}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, style, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      style={{ color: 'var(--text-primary)', ...style }}
      {...props}
    />
  );
}

export function CardDescription({ className, style, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm", className)}
      style={{ color: 'var(--text-muted)', ...style }}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}
