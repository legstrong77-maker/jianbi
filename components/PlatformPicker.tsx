"use client";

import { Check } from "lucide-react";
import { type Platform, PLATFORM_LABELS } from "@/lib/prompts";
import { cn } from "@/lib/utils";

interface PlatformPickerProps {
  value: Platform[];
  onChange: (next: Platform[]) => void;
}

const ALL_PLATFORMS: Platform[] = ["threads", "x", "line", "ig"];

const PLATFORM_HINT: Record<Platform, string> = {
  threads: "≤ 500 字",
  x: "≤ 140 繁中字 / thread",
  line: "≤ 350 字 + CTA",
  ig: "hook + hashtags",
};

export function PlatformPicker({ value, onChange }: PlatformPickerProps) {
  const toggle = (p: Platform) => {
    if (value.includes(p)) {
      onChange(value.filter((x) => x !== p));
    } else {
      onChange([...value, p]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {ALL_PLATFORMS.map((p) => {
        const active = value.includes(p);
        return (
          <button
            key={p}
            type="button"
            onClick={() => toggle(p)}
            className={cn(
              "relative px-3 py-3 rounded-md border text-left transition-all",
              active
                ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600"
            )}
          >
            {active && (
              <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            )}
            <div className="text-sm font-medium">{PLATFORM_LABELS[p]}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{PLATFORM_HINT[p]}</div>
          </button>
        );
      })}
    </div>
  );
}
