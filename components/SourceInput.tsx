"use client";

import { useState } from "react";
import { Link2, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SourceMode = "url" | "text";

export interface SourceInputState {
  mode: SourceMode;
  url: string;
  text: string;
}

interface SourceInputProps {
  value: SourceInputState;
  onChange: (v: SourceInputState) => void;
  onExtract: () => void;
  extracting: boolean;
  extractError?: string | null;
  extractedTitle?: string | null;
  extractedLength?: number | null;
}

export function SourceInput({
  value,
  onChange,
  onExtract,
  extracting,
  extractError,
  extractedTitle,
  extractedLength,
}: SourceInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <ModeTab
          active={value.mode === "url"}
          onClick={() => onChange({ ...value, mode: "url" })}
          icon={<Link2 className="h-3.5 w-3.5" />}
          label="網址 / YouTube"
        />
        <ModeTab
          active={value.mode === "text"}
          onClick={() => onChange({ ...value, mode: "text" })}
          icon={<FileText className="h-3.5 w-3.5" />}
          label="直接貼文字"
        />
      </div>

      {value.mode === "url" ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="貼上 YouTube / 文章網址…"
              value={value.url}
              onChange={(e) => onChange({ ...value, url: e.target.value })}
              className="flex-1 px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600"
              disabled={extracting}
            />
            <button
              type="button"
              onClick={onExtract}
              disabled={extracting || !value.url.trim()}
              className="px-4 py-2 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              {extracting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {extracting ? "擷取中" : "擷取內容"}
            </button>
          </div>
          {extractError && (
            <p className="text-xs text-red-600 dark:text-red-400">{extractError}</p>
          )}
          {!extractError && extractedTitle && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              ✓ 已擷取：{extractedTitle}
              {extractedLength ? `（${extractedLength} 字）` : ""}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            placeholder="直接貼上逐字稿、筆記、長文… 至少 100 字"
            value={value.text}
            onChange={(e) => onChange({ ...value, text: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 resize-y"
          />
          <p className="text-xs text-zinc-500">
            目前 {value.text.length} 字
            {value.text.length > 0 && value.text.length < 100 && (
              <span className="text-amber-600 dark:text-amber-500">
                　（至少 100 字才能生成）
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors",
        active
          ? "bg-emerald-600 text-white"
          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
