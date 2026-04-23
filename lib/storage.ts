"use client";

export type Provider = "anthropic" | "openai" | "gemini";

export interface Settings {
  provider: Provider;
  anthropicKey: string;
  openaiKey: string;
  geminiKey: string;
  anthropicModel: string;
  openaiModel: string;
  geminiModel: string;
}

export interface HistoryEntry {
  id: string;
  createdAt: number;
  sourceTitle: string;
  sourcePreview: string;
  tone: string;
  platforms: string[];
  results: Record<string, string>;
}

const SETTINGS_KEY = "jianbi.settings.v1";
const HISTORY_KEY = "jianbi.history.v1";
const HISTORY_MAX = 10;

export const DEFAULT_SETTINGS: Settings = {
  provider: "gemini",
  anthropicKey: "",
  openaiKey: "",
  geminiKey: "",
  anthropicModel: "claude-sonnet-4-6",
  openaiModel: "gpt-4o",
  geminiModel: "gemini-2.5-flash-lite",
};

// Models we know give 0 free-tier quota as of 2026-04 (auto-migrate away)
const DEPRECATED_GEMINI_MODELS = new Set([
  "gemini-2.0-flash",
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash-lite",
  "gemini-2.0-pro",
]);

export function getSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    const merged: Settings = { ...DEFAULT_SETTINGS, ...parsed };

    // Auto-migrate: 2.0-flash family has 0 free-tier quota since 2025-12
    if (DEPRECATED_GEMINI_MODELS.has(merged.geminiModel)) {
      merged.geminiModel = DEFAULT_SETTINGS.geminiModel;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
    }

    return merged;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function hasUsableKey(s: Settings): boolean {
  if (s.provider === "anthropic") return s.anthropicKey.trim().length > 10;
  if (s.provider === "openai") return s.openaiKey.trim().length > 10;
  return s.geminiKey.trim().length > 10;
}

export function getActiveKey(s: Settings): string {
  if (s.provider === "anthropic") return s.anthropicKey;
  if (s.provider === "openai") return s.openaiKey;
  return s.geminiKey;
}

export function getActiveModel(s: Settings): string {
  if (s.provider === "anthropic") return s.anthropicModel;
  if (s.provider === "openai") return s.openaiModel;
  return s.geminiModel;
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function pushHistory(entry: HistoryEntry) {
  if (typeof window === "undefined") return;
  const existing = getHistory();
  const next = [entry, ...existing].slice(0, HISTORY_MAX);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}
