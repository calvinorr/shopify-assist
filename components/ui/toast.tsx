"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg animate-in slide-in-from-right-full"
            style={{
              backgroundColor: toast.type === "success" ? "var(--success-light)" : "var(--danger-light)",
              border: `1px solid ${toast.type === "success" ? "var(--success)" : "var(--danger)"}`,
              minWidth: "280px",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: "var(--success)" }} />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: "var(--danger)" }} />
            )}
            <span
              className="flex-1 text-sm font-medium"
              style={{ color: toast.type === "success" ? "var(--success)" : "var(--danger)" }}
            >
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 rounded p-1 transition-colors hover:opacity-70"
            >
              <X className="h-4 w-4" style={{ color: toast.type === "success" ? "var(--success)" : "var(--danger)" }} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
