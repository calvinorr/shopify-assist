// components/blog/seo-panel.tsx
"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { analyzeSEO, getSEOScoreColor, type SEOAnalysis } from "@/lib/seo";

interface SEOPanelProps {
  title: string;
  metaDescription: string;
  focusKeyword: string;
  contentHtml: string;
  className?: string;
}

export function SEOPanel({ title, metaDescription, focusKeyword, contentHtml, className }: SEOPanelProps) {
  const analysis = useMemo(() =>
    analyzeSEO({ title, metaDescription, focusKeyword, contentHtml }),
    [title, metaDescription, focusKeyword, contentHtml]
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">SEO Score</CardTitle>
          <span
            className="text-lg font-bold px-2 py-0.5 rounded"
            style={{
              color: getSEOScoreColor(analysis.score),
              backgroundColor: `${getSEOScoreColor(analysis.score)}15`
            }}
          >
            {analysis.score}/100
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {analysis.checks.map((check, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              {check.passed ? (
                <CheckCircle2 size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} />
              ) : (
                <AlertCircle size={16} style={{ color: "var(--danger)", flexShrink: 0, marginTop: 2 }} />
              )}
              <div>
                <span style={{ color: check.passed ? "var(--text-secondary)" : "var(--text-primary)" }}>
                  {check.label}
                </span>
                {check.hint && (
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {check.hint}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
