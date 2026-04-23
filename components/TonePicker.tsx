"use client";

import { type Tone, TONE_LABELS } from "@/lib/prompts";
import { cn } from "@/lib/utils";

const ALL_TONES: Tone[] = ["knowledge", "lifestyle", "b2b", "humor"];

const TONE_HINT: Record<Tone, string> = {
  knowledge: "結論先行、條列重點",
  lifestyle: "像聊天、有個人感",
  b2b: "專業、簡潔、重點",
  humor: "自嘲、反轉、節奏",
};

interface TonePickerProps {
  value: Tone;
  onChange: (t: Tone) => void;
}

export function TonePicker({ value, onChange }: TonePickerProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {ALL_TONES.map((t) => {
        const active = value === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={cn(
              "px-3 py-2 rounded-md border text-left transition-all",
              active
                ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600"
            )}
          >
            <div className="text-sm font-medium">{TONE_LABELS[t]}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{TONE_HINT[t]}</div>
          </button>
        );
      })}
    </div>
  );
}
