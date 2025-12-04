import { useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutosaveOptions {
  onSave: () => Promise<void>;
  delay?: number; // Delay in milliseconds (default: 30000 = 30 seconds)
  enabled?: boolean; // Whether auto-save is enabled (default: true)
}

interface UseAutosaveReturn {
  status: SaveStatus;
  triggerSave: () => Promise<void>;
  resetStatus: () => void;
}

export function useAutosave({
  onSave,
  delay = 30000,
  enabled = true,
}: UseAutosaveOptions): UseAutosaveReturn {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const triggerSave = async () => {
    if (isSavingRef.current) return;

    isSavingRef.current = true;
    setStatus("saving");

    try {
      await onSave();
      setStatus("saved");

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (error) {
      setStatus("error");
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } finally {
      isSavingRef.current = false;
    }
  };

  const resetStatus = () => {
    setStatus("idle");
  };

  const scheduleAutosave = () => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule new auto-save
    timeoutRef.current = setTimeout(() => {
      triggerSave();
    }, delay);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    status,
    triggerSave,
    resetStatus,
  };
}

// Hook to track changes and trigger auto-save
export function useAutosaveOnChange({
  values,
  onSave,
  delay = 30000,
  enabled = true,
}: {
  values: unknown[];
  onSave: () => Promise<void>;
  delay?: number;
  enabled?: boolean;
}) {
  const { status, triggerSave, resetStatus } = useAutosave({
    onSave,
    delay,
    enabled,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialRenderRef = useRef(true);

  useEffect(() => {
    // Skip initial render
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Mark as unsaved when values change
    if (status === "saved") {
      resetStatus();
    }

    // Schedule auto-save
    timeoutRef.current = setTimeout(() => {
      triggerSave();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...values, enabled]);

  return {
    status,
    triggerSave,
  };
}
