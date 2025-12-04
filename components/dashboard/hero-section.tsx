"use client";

import Link from "next/link";
import { Instagram, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  optimalPostTime?: string; // e.g., "7:00 PM"
}

export function HeroSection({ optimalPostTime }: HeroSectionProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8 md:p-12"
      style={{
        background: `linear-gradient(135deg, var(--madder-light) 0%, var(--indigo-light) 100%)`,
        border: "1px solid var(--card-border)",
      }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232d2a26' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        {/* Optional badge */}
        {optimalPostTime && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              border: "1px solid var(--card-border)",
            }}
          >
            <Clock size={16} style={{ color: "var(--indigo)" }} />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Best time to post: <strong style={{ color: "var(--indigo)" }}>{optimalPostTime}</strong>
            </span>
          </div>
        )}

        {/* Headline */}
        <h1
          className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          What would you like to create today?
        </h1>

        <p
          className="text-lg mb-8 max-w-2xl"
          style={{ color: "var(--text-secondary)" }}
        >
          Let&apos;s craft beautiful content that tells your story and connects with your customers.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard/instagram">
            <Button
              size="lg"
              className="group w-full sm:w-auto min-w-[200px] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              style={{
                backgroundColor: "var(--madder)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#a34f30";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--madder)";
              }}
            >
              <Instagram size={20} className="mr-2" />
              Create Instagram Post
            </Button>
          </Link>

          <Link href="/dashboard/blog/new">
            <Button
              size="lg"
              className="group w-full sm:w-auto min-w-[200px] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              style={{
                backgroundColor: "var(--indigo)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2f4663";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--indigo)";
              }}
            >
              <FileText size={20} className="mr-2" />
              Start Blog Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--weld) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -left-8 -top-8 w-48 h-48 rounded-full opacity-15 blur-2xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--madder) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
