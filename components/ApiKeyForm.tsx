"use client";

import { useEffect, useState } from "react";
import { Check, Eye, EyeOff, Shield, Sparkles } from "lucide-react";
import {
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings,
  type Provider,
  type Settings,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

const ANTHROPIC_MODELS = [
  { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6（推薦，平衡）" },
  { value: "claude-opus-4-7", label: "Claude Opus 4.7（最強、較貴）" },
  { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5（最便宜、快）" },
];

const OPENAI_MODELS = [
  { value: "gpt-4o", label: "GPT-4o（推薦）" },
  { value: "gpt-4o-mini", label: "GPT-4o mini（便宜）" },
];

const GEMINI_MODELS = [
  {
    value: "gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash Lite（推薦 · 免費 15 RPM / 1000 次/天）",
  },
  {
    value: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash（免費 10 RPM / 250 次/天，品質更好）",
  },
  {
    value: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro（2026/04 起不再免費，需付費）",
  },
];

export function ApiKeyForm() {
  const [s, setS] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showGemini, setShowGemini] = useState(false);

  useEffect(() => {
    setS(getSettings());
    setLoaded(true);
  }, []);

  const handleSave = () => {
    saveSettings(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const setProvider = (p: Provider) => setS({ ...s, provider: p });

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4 flex items-start gap-3 text-sm">
        <Sparkles className="h-5 w-5 text-emerald-700 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-emerald-900 dark:text-emerald-100">
          <p className="font-medium">沒預算？推薦用 Gemini 2.5 Flash Lite（免費額度）</p>
          <p className="text-emerald-800 dark:text-emerald-200">
            Google AI Studio 提供<strong>免費 API Key</strong>，Gemini 2.5 Flash Lite 免費
            每分鐘 15 次、每天 1000 次，不需信用卡。而且 Gemini 可以<strong>直接看 YouTube 影片</strong>，
            沒字幕也能剪。
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
            ⚠️ 注意：Gemini 2.0 Flash 已從免費方案移除（2025/12 起），不要選。本站會自動幫你遷移到 2.5。
          </p>
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 flex items-start gap-3 text-sm">
        <Shield className="h-5 w-5 text-emerald-700 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-zinc-700 dark:text-zinc-300">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            你的 API Key 只儲存在這台裝置的瀏覽器裡
          </p>
          <p>
            剪筆不會把你的 Key 存進資料庫、不會寫入伺服器日誌。
            Key 只在你按「一鍵剪筆」時，以 HTTPS 從你的瀏覽器經過我們伺服器
            再轉傳給 Provider。
          </p>
        </div>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">使用的 AI Provider</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <ProviderCard
            active={s.provider === "gemini"}
            onClick={() => setProvider("gemini")}
            title="Google Gemini"
            subtitle="✨ 免費 + 可讀無字幕影片"
            badge="推薦"
          />
          <ProviderCard
            active={s.provider === "anthropic"}
            onClick={() => setProvider("anthropic")}
            title="Anthropic Claude"
            subtitle="中文語感最佳（付費）"
          />
          <ProviderCard
            active={s.provider === "openai"}
            onClick={() => setProvider("openai")}
            title="OpenAI GPT"
            subtitle="業界標準（付費）"
          />
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">
          Google Gemini API Key
          {s.provider === "gemini" && (
            <span className="text-xs text-emerald-700 dark:text-emerald-400 ml-1">
              （使用中）
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          <input
            type={showGemini ? "text" : "password"}
            placeholder="AIza…"
            value={s.geminiKey}
            onChange={(e) => setS({ ...s, geminiKey: e.target.value })}
            className="flex-1 px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600"
          />
          <button
            type="button"
            onClick={() => setShowGemini(!showGemini)}
            className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300"
          >
            {showGemini ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-zinc-500">
          免費拿 Key：到{" "}
          <a
            className="underline font-medium text-emerald-700 dark:text-emerald-400"
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
          >
            aistudio.google.com/apikey
          </a>{" "}
          用 Google 帳號登入 → Create API Key（不需信用卡）
        </p>
        <div>
          <label className="text-xs text-zinc-600 dark:text-zinc-400">模型</label>
          <select
            value={s.geminiModel}
            onChange={(e) => setS({ ...s, geminiModel: e.target.value })}
            className="ml-2 text-xs px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          >
            {GEMINI_MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">
          Anthropic API Key
          {s.provider === "anthropic" && (
            <span className="text-xs text-emerald-700 dark:text-emerald-400 ml-1">
              （使用中）
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          <input
            type={showAnthropic ? "text" : "password"}
            placeholder="sk-ant-api03-…"
            value={s.anthropicKey}
            onChange={(e) => setS({ ...s, anthropicKey: e.target.value })}
            className="flex-1 px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600"
          />
          <button
            type="button"
            onClick={() => setShowAnthropic(!showAnthropic)}
            className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300"
          >
            {showAnthropic ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-zinc-500">
          到{" "}
          <a
            className="underline"
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
          >
            console.anthropic.com/settings/keys
          </a>{" "}
          建立 Key（需信用卡）
        </p>
        <div>
          <label className="text-xs text-zinc-600 dark:text-zinc-400">模型</label>
          <select
            value={s.anthropicModel}
            onChange={(e) => setS({ ...s, anthropicModel: e.target.value })}
            className="ml-2 text-xs px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          >
            {ANTHROPIC_MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">
          OpenAI API Key
          {s.provider === "openai" && (
            <span className="text-xs text-emerald-700 dark:text-emerald-400 ml-1">
              （使用中）
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          <input
            type={showOpenAI ? "text" : "password"}
            placeholder="sk-…"
            value={s.openaiKey}
            onChange={(e) => setS({ ...s, openaiKey: e.target.value })}
            className="flex-1 px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600"
          />
          <button
            type="button"
            onClick={() => setShowOpenAI(!showOpenAI)}
            className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300"
          >
            {showOpenAI ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-zinc-500">
          到{" "}
          <a
            className="underline"
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
          >
            platform.openai.com/api-keys
          </a>{" "}
          建立 Key（需信用卡）
        </p>
        <div>
          <label className="text-xs text-zinc-600 dark:text-zinc-400">模型</label>
          <select
            value={s.openaiModel}
            onChange={(e) => setS({ ...s, openaiModel: e.target.value })}
            className="ml-2 text-xs px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          >
            {OPENAI_MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="pt-2">
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            "px-5 py-2 rounded-md font-medium text-white inline-flex items-center gap-2",
            saved ? "bg-emerald-700" : "bg-emerald-600 hover:bg-emerald-700"
          )}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" /> 已儲存
            </>
          ) : (
            "儲存設定"
          )}
        </button>
      </div>
    </div>
  );
}

function ProviderCard({
  active,
  onClick,
  title,
  subtitle,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative px-4 py-3 rounded-md border text-left transition-all",
        active
          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
          : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-400"
      )}
    >
      {badge && (
        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-medium">
          {badge}
        </span>
      )}
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{subtitle}</div>
    </button>
  );
}
