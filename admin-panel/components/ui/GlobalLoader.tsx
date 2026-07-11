"use client";

import { useAppSelector } from "@/store";
import { Loader2 } from "lucide-react";

export function GlobalLoader() {
  const pendingRequests = useAppSelector(
    (state) => state.shared.pendingRequests,
  );
  const manualLoader = useAppSelector((state) => state.shared.manualLoader);

  const isLoading = pendingRequests > 0 || manualLoader;

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm transition-opacity">
      <div className="flex flex-col items-center bg-surface p-6 rounded-2xl shadow-xl border border-border">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="mt-4 text-sm font-medium text-foreground">Processing...</p>
      </div>
    </div>
  );
}
