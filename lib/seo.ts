// lib/seo.ts

export interface SEOCheckResult {
  passed: boolean;
  label: string;
  points: number;
  maxPoints: number;
  hint: string | null;
}

export interface SEOAnalysis {
  score: number;
  checks: SEOCheckResult[];
}

export function analyzeSEO(params: {
  title: string;
  metaDescription: string;
  focusKeyword: string;
  contentHtml: string;
}): SEOAnalysis {
  const checks: SEOCheckResult[] = [];

  // 1. Meta description exists (+20)
  const hasMeta = !!params.metaDescription?.trim();
  checks.push({
    passed: hasMeta,
    label: "Meta description",
    points: hasMeta ? 20 : 0,
    maxPoints: 20,
    hint: hasMeta ? null : "Add an excerpt (150-160 characters)"
  });

  // 2. Meta description length (+10)
  const metaLength = params.metaDescription?.length || 0;
  const metaLengthOk = metaLength >= 150 && metaLength <= 160;
  checks.push({
    passed: metaLengthOk,
    label: "Meta length (150-160)",
    points: metaLengthOk ? 10 : 0,
    maxPoints: 10,
    hint: metaLength < 150
      ? `Add ${150 - metaLength} more characters`
      : metaLength > 160
        ? `Remove ${metaLength - 160} characters`
        : null
  });

  // 3. Focus keyword exists (+20)
  const hasKeyword = !!params.focusKeyword?.trim();
  checks.push({
    passed: hasKeyword,
    label: "Focus keyword",
    points: hasKeyword ? 20 : 0,
    maxPoints: 20,
    hint: hasKeyword ? null : "Add a focus keyword in Tags"
  });

  // 4. Keyword in title (+20)
  const keywordInTitle = hasKeyword && params.title?.toLowerCase().includes(params.focusKeyword.toLowerCase());
  checks.push({
    passed: keywordInTitle,
    label: "Keyword in title",
    points: keywordInTitle ? 20 : 0,
    maxPoints: 20,
    hint: hasKeyword && !keywordInTitle
      ? `Add "${params.focusKeyword}" to your title`
      : null
  });

  // 5. Content length > 500 words (+15)
  const textContent = params.contentHtml?.replace(/<[^>]*>/g, " ").trim() || "";
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  const hasEnoughWords = wordCount >= 500;
  checks.push({
    passed: hasEnoughWords,
    label: `Content length (${wordCount} words)`,
    points: hasEnoughWords ? 15 : 0,
    maxPoints: 15,
    hint: hasEnoughWords ? null : `Add ${500 - wordCount} more words to reach 500`
  });

  // 6. Has internal links (+15) - includes <a> tags and product cards
  const hasLinks = params.contentHtml?.includes("<a ") || false;
  const hasProductCards = params.contentHtml?.includes('data-type="product-card"') || false;
  const hasInternalLinks = hasLinks || hasProductCards;
  checks.push({
    passed: hasInternalLinks,
    label: "Internal links",
    points: hasInternalLinks ? 15 : 0,
    maxPoints: 15,
    hint: hasInternalLinks ? null : "Add a link to a product or related post"
  });

  const score = Math.min(checks.reduce((sum, c) => sum + c.points, 0), 100);

  return { score, checks };
}

export function getSEOScoreColor(score: number): string {
  if (score < 50) return "var(--danger)";
  if (score < 75) return "var(--warning)";
  return "var(--success)";
}
