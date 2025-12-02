"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check, AlertCircle } from "lucide-react";

interface SyncResult {
  success: boolean;
  message: string;
  synced: number;
  errors: string[];
}

export function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

  async function handleSync() {
    setSyncing(true);
    setResult(null);

    try {
      const response = await fetch("/api/shopify/sync", {
        method: "POST",
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Sync failed",
        synced: 0,
        errors: ["Network error"],
      });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button size="sm" onClick={handleSync} disabled={syncing}>
        <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
        {syncing ? "Syncing..." : "Sync Now"}
      </Button>
      {result && (
        <span
          className={`flex items-center gap-1 text-sm ${
            result.success ? "text-green-600" : "text-amber-600"
          }`}
        >
          {result.success ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {result.message}
        </span>
      )}
    </div>
  );
}
