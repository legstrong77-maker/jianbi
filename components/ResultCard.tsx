"use client";

import { useState } from "react";
import { Copy, Check, Minus, Plus, RotateCcw, Loader2 } from "lucide-react";
import { type Platform, PLATFORM_LABELS } from "@/lib/prompts";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  platform: Platform;
  content: string;
  onTweak: (direction: "shorter" | "longer" | "regenerate") => Promise<void>;
}

export function ResultCard({ platform, content, onTweak }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<"shorter" | "longer" | "regenerate" | null>(
    null
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore clipboard errors (old browsers)
    }
  };

  const handleTweak = async (dir: "shorter" | "longer" | "regenerate") => {
    setBusy(dir);
    try {
      await onTweak(dir);
    } finally {
      setBusy(null);
    }
  };

  const charCount = content.replace(/\s/g, "").length;

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{PLATFORM_LABELS[platform]}</span>
          <span className="text-xs text-zinc-500">{charCount} 字</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
            copied
              ? "bg-emerald-600 text-white"
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> 已複製
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> 複製
            </>
          )}
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed px-4 py-3 max-h-96 overflow-y-auto">
        {content}
      </pre>
      <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 flex gap-2 flex-wrap">
        <TweakButton
          busy={busy === "shorter"}
          disabled={busy !== null}
          onClick={() => handleTweak("shorter")}
          icon={<Minus className="h-3 w-3" />}
          label="改短"
        />
        <TweakButton
          busy={busy === "longer"}
          disabled={busy !== null}
          onClick={() => handleTweak("longer")}
          icon={<Plus className="h-3 w-3" />}
          label="改長"
        />
        <TweakButton
          busy={busy === "regenerate"}
          disabled={busy !== null}
          onClick={() => handleTweak("regenerate")}
          icon={<RotateCcw className="h-3 w-3" />}
          label="換切角"
        />
      </div>
    </div>
  );
}

function TweakButton({
  busy,
  disabled,
  onClick,
  icon,
  label,
}: {
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : icon}
      {label}
    </button>
  );
}
