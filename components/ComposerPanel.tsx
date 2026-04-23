"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  KeyRound,
  Video,
} from "lucide-react";
import { SourceInput, type SourceInputState } from "./SourceInput";
import { PlatformPicker } from "./PlatformPicker";
import { TonePicker } from "./TonePicker";
import { ResultCard } from "./ResultCard";
import { type Platform, type Tone } from "@/lib/prompts";
import {
  getSettings,
  hasUsableKey,
  getActiveKey,
  getActiveModel,
  pushHistory,
  type Settings,
} from "@/lib/storage";
import { isYoutubeUrl } from "@/lib/youtube";

const DEMO_MODE_ENABLED = process.env.NEXT_PUBLIC_DEMO_MODE === "1";

export function ComposerPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);

  const [source, setSource] = useState<SourceInputState>({
    mode: "url",
    url: "",
    text: "",
  });
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractedTitle, setExtractedTitle] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const [platforms, setPlatforms] = useState<Platform[]>([
    "threads",
    "x",
    "line",
  ]);
  const [tone, setTone] = useState<Tone>("knowledge");

  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const canGeminiDirectYoutube =
    source.mode === "url" &&
    isYoutubeUrl(source.url) &&
    settings?.provider === "gemini";

  // In demo mode, Gemini provider with no user key is OK — server uses its own.
  const hasKeyOrDemo =
    settings !== null &&
    (hasUsableKey(settings) ||
      (DEMO_MODE_ENABLED && settings.provider === "gemini"));

  const handleExtract = async () => {
    setExtracting(true);
    setExtractError(null);
    setExtractedTitle(null);
    setExtractedText(null);
    try {
      const resp = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: source.url }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setExtractError(data.error ?? "擷取失敗");
      } else {
        setExtractedTitle(data.title);
        setExtractedText(data.text);
      }
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : "網路錯誤");
    } finally {
      setExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (!settings || !hasKeyOrDemo) {
      setGenerateError(
        DEMO_MODE_ENABLED
          ? "請切到 Gemini provider 使用 demo 額度，或貼上自己的 Key"
          : "尚未設定 API Key，請先到設定頁貼上 Key"
      );
      return;
    }

    if (platforms.length === 0) {
      setGenerateError("請至少選一個平台");
      return;
    }

    // Build payload based on available source
    type Payload = {
      mode: "generate";
      provider: string;
      apiKey: string;
      model: string;
      platforms: Platform[];
      tone: Tone;
      sourceText?: string;
      sourceTitle?: string;
      youtubeUrl?: string;
    };

    // In demo mode, omit apiKey so the server falls back to its own key.
    const userKey = getActiveKey(settings);
    const useDemoKey =
      DEMO_MODE_ENABLED && settings.provider === "gemini" && userKey.length < 10;

    const base: Payload = {
      mode: "generate",
      provider: settings.provider,
      apiKey: useDemoKey ? "" : userKey,
      model: getActiveModel(settings),
      platforms,
      tone,
    };

    let payload: Payload;
    let historyTitle = "";
    let historyPreview = "";

    if (source.mode === "text") {
      if (source.text.trim().length < 100) {
        setGenerateError("請貼上至少 100 字的內容");
        return;
      }
      payload = { ...base, sourceText: source.text };
      historyTitle = "自貼文字";
      historyPreview = source.text.slice(0, 120);
    } else {
      // URL mode
      if (extractedText) {
        payload = {
          ...base,
          sourceText: extractedText,
          sourceTitle: extractedTitle ?? undefined,
        };
        historyTitle = extractedTitle ?? "擷取內容";
        historyPreview = extractedText.slice(0, 120);
      } else if (canGeminiDirectYoutube) {
        // Gemini + YouTube URL: skip extraction, let Gemini watch the video directly
        payload = { ...base, youtubeUrl: source.url };
        historyTitle = `YouTube 直讀 · ${source.url}`;
        historyPreview = "(Gemini 直接觀看影片)";
      } else {
        setGenerateError(
          "請先點「擷取內容」把字幕或文章抓下來。(若該影片沒字幕，請切換到 Gemini provider 直接讀影片，或貼上逐字稿。)"
        );
        return;
      }
    }

    setGenerating(true);
    setGenerateError(null);
    setResults(null);

    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setGenerateError(data.error ?? "生成失敗");
      } else {
        setResults(data.results);
        pushHistory({
          id: String(Date.now()),
          createdAt: Date.now(),
          sourceTitle: historyTitle,
          sourcePreview: historyPreview,
          tone,
          platforms,
          results: data.results,
        });
      }
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "網路錯誤");
    } finally {
      setGenerating(false);
    }
  };

  const handleTweak = async (
    platform: Platform,
    direction: "shorter" | "longer" | "regenerate"
  ) => {
    if (!settings || !hasKeyOrDemo || !results) return;

    const srcText =
      source.mode === "text"
        ? source.text
        : extractedText ?? `(來源：${source.url})`;

    const userKey = getActiveKey(settings);
    const useDemoKey =
      DEMO_MODE_ENABLED && settings.provider === "gemini" && userKey.length < 10;

    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "tweak",
          provider: settings.provider,
          apiKey: useDemoKey ? "" : userKey,
          model: getActiveModel(settings),
          platform,
          tone,
          currentDraft: results[platform] ?? "",
          sourceText: srcText,
          direction,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setGenerateError(data.error ?? "微調失敗");
        return;
      }
      if (data.results && data.results[platform]) {
        setResults({ ...results, [platform]: data.results[platform] });
      }
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "網路錯誤");
    }
  };

  const keyMissing = settings !== null && !hasKeyOrDemo;
  const usingDemo =
    settings !== null &&
    DEMO_MODE_ENABLED &&
    settings.provider === "gemini" &&
    !hasUsableKey(settings);

  return (
    <div className="space-y-8">
      {usingDemo && (
        <div className="rounded-md border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-emerald-700 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-medium text-emerald-900 dark:text-emerald-200">
              🎁 Demo 模式已啟用 — 直接使用即可
            </p>
            <p className="text-emerald-800 dark:text-emerald-300 mt-1">
              這是作品展示頁，使用作者提供的 Gemini 額度
              （每個 IP 每小時 10 次、每日 30 次）。想不受限？到{" "}
              <Link href="/settings" className="underline underline-offset-2 font-medium">
                設定頁
              </Link>{" "}
              貼自己的 Gemini Key 即可（免費）。
            </p>
          </div>
        </div>
      )}
      {keyMissing && (
        <div className="rounded-md border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-4 flex items-start gap-3">
          <KeyRound className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-medium text-amber-900 dark:text-amber-200">
              尚未設定 API Key
            </p>
            <p className="text-amber-800 dark:text-amber-300 mt-1">
              剪筆採用 BYOK（自帶 Key）模式。
              <strong>推薦用 Google Gemini</strong>——免費、不需信用卡，到
              設定頁 2 分鐘就能拿 Key。
            </p>
            <Link
              href="/settings"
              className="inline-block mt-2 text-amber-900 dark:text-amber-100 underline underline-offset-2 font-medium"
            >
              前往設定 →
            </Link>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          1. 來源
        </h2>
        <SourceInput
          value={source}
          onChange={(v) => {
            setSource(v);
            // Reset extraction state on URL change
            if (v.url !== source.url) {
              setExtractedText(null);
              setExtractedTitle(null);
              setExtractError(null);
            }
          }}
          onExtract={handleExtract}
          extracting={extracting}
          extractError={extractError}
          extractedTitle={extractedTitle}
          extractedLength={extractedText?.length ?? null}
        />
        {canGeminiDirectYoutube && !extractedText && (
          <div className="mt-2 inline-flex items-start gap-2 text-xs rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-3 py-2 text-emerald-800 dark:text-emerald-300">
            <Video className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              你選的是 Gemini —— 可<strong>直接按「一鍵剪筆」</strong>，
              Gemini 會看影片（即使沒字幕），不用先點「擷取內容」。
            </span>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          2. 平台
        </h2>
        <PlatformPicker value={platforms} onChange={setPlatforms} />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          3. 語氣
        </h2>
        <TonePicker value={tone} onChange={setTone} />
      </section>

      <div className="pt-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || keyMissing}
          className="w-full md:w-auto px-6 py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {canGeminiDirectYoutube && !extractedText
                ? "Gemini 看片中… 約 20–40 秒"
                : "生成中… 約 10–20 秒"}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              一鍵剪筆
            </>
          )}
        </button>
        {generateError && (
          <div className="mt-3 rounded-md border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-800 dark:text-red-300 inline-flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{generateError}</span>
          </div>
        )}
      </div>

      {results && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            結果
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {platforms.map(
              (p) =>
                results[p] && (
                  <ResultCard
                    key={p}
                    platform={p}
                    content={results[p]}
                    onTweak={(dir) => handleTweak(p, dir)}
                  />
                )
            )}
          </div>
        </section>
      )}
    </div>
  );
}
