import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildVideoUserPrompt,
  buildTweakPrompt,
  type Platform,
  type Tone,
} from "@/lib/prompts";
import {
  callLlm,
  callGeminiWithYoutube,
  parseJsonResponse,
} from "@/lib/providers";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 90;

const ProviderSchema = z.enum(["anthropic", "openai", "gemini"]);
const PlatformSchema = z.enum(["threads", "x", "line", "ig"]);
const ToneSchema = z.enum(["knowledge", "lifestyle", "b2b", "humor"]);

const GenerateSchema = z.object({
  mode: z.literal("generate"),
  provider: ProviderSchema,
  apiKey: z.string().optional(),
  model: z.string().min(1),
  sourceText: z.string().optional(),
  youtubeUrl: z.string().url().optional(),
  sourceTitle: z.string().optional(),
  platforms: z.array(PlatformSchema).min(1, "請至少選一個平台").max(4),
  tone: ToneSchema,
});

const TweakSchema = z.object({
  mode: z.literal("tweak"),
  provider: ProviderSchema,
  apiKey: z.string().optional(),
  model: z.string().min(1),
  platform: PlatformSchema,
  tone: ToneSchema,
  currentDraft: z.string().min(1),
  sourceText: z.string().min(1),
  direction: z.enum(["shorter", "longer", "regenerate"]),
});

const BodySchema = z.discriminatedUnion("mode", [GenerateSchema, TweakSchema]);

// Demo-mode configuration (read from env vars — NOT hardcoded)
const SERVER_GEMINI_KEY = process.env.GEMINI_API_KEY;
const DEMO_LIMIT_PER_HOUR = Number(process.env.DEMO_LIMIT_PER_HOUR ?? "10");
const DEMO_LIMIT_PER_DAY = Number(process.env.DEMO_LIMIT_PER_DAY ?? "30");

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "請求 body 不是合法 JSON" }, { status: 400 });
  }

  if (body && typeof body === "object" && !("mode" in body)) {
    (body as Record<string, unknown>).mode = "generate";
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "請求格式錯誤" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Key resolution: if caller did not provide a key AND we're using Gemini
  // AND the server has an internal Gemini key, use it (demo mode).
  const usingServerKey =
    data.provider === "gemini" &&
    (!data.apiKey || data.apiKey.length < 10) &&
    !!SERVER_GEMINI_KEY;

  const effectiveApiKey = usingServerKey ? SERVER_GEMINI_KEY! : data.apiKey;

  if (!effectiveApiKey || effectiveApiKey.length < 10) {
    return NextResponse.json(
      { error: "API Key 長度不足，請到設定頁檢查（或請管理員啟用 demo 模式）" },
      { status: 400 }
    );
  }

  // Rate limit only applies when using the server-side demo key.
  // BYOK users pay their own way, so no limit from us.
  if (usingServerKey) {
    const ip = getClientIp(req.headers);
    const hourly = checkRateLimit(`${ip}:hour`, DEMO_LIMIT_PER_HOUR, 60 * 60 * 1000);
    if (!hourly.allowed) {
      return NextResponse.json(
        {
          error: `Demo 模式每小時限 ${DEMO_LIMIT_PER_HOUR} 次，約 ${Math.ceil(hourly.resetInSeconds / 60)} 分鐘後再試。想不受限？到設定頁貼你自己的 Gemini Key（免費）即可。`,
        },
        { status: 429 }
      );
    }
    const daily = checkRateLimit(`${ip}:day`, DEMO_LIMIT_PER_DAY, 24 * 60 * 60 * 1000);
    if (!daily.allowed) {
      return NextResponse.json(
        {
          error: `Demo 模式今日已用完（每日 ${DEMO_LIMIT_PER_DAY} 次）。到設定頁貼你自己的 Gemini Key（免費）即可不受限。`,
        },
        { status: 429 }
      );
    }
  }

  try {
    if (data.mode === "generate") {
      const hasText = typeof data.sourceText === "string" && data.sourceText.trim().length >= 100;
      const hasVideoUrl = typeof data.youtubeUrl === "string" && data.youtubeUrl.trim().length > 0;

      if (!hasText && !hasVideoUrl) {
        return NextResponse.json(
          { error: "需要提供 sourceText（≥100 字）或 youtubeUrl 其中一項" },
          { status: 400 }
        );
      }

      let text: string;
      if (hasVideoUrl) {
        if (data.provider !== "gemini") {
          return NextResponse.json(
            {
              error:
                "直接處理 YouTube 網址目前只支援 Gemini。請在設定頁切換到 Gemini，或先點「擷取內容」把字幕抓下來再生成。",
            },
            { status: 400 }
          );
        }
        text = await callGeminiWithYoutube({
          apiKey: effectiveApiKey,
          model: data.model,
          system: buildSystemPrompt(),
          user: buildVideoUserPrompt({
            platforms: data.platforms as Platform[],
            tone: data.tone as Tone,
          }),
          youtubeUrl: data.youtubeUrl!,
        });
      } else {
        text = await callLlm({
          provider: data.provider,
          apiKey: effectiveApiKey,
          model: data.model,
          system: buildSystemPrompt(),
          user: buildUserPrompt({
            sourceTitle: data.sourceTitle,
            sourceText: data.sourceText!,
            platforms: data.platforms as Platform[],
            tone: data.tone as Tone,
          }),
        });
      }

      const obj = parseJsonResponse<Record<string, string>>(text);
      return NextResponse.json({ results: obj });
    }

    // tweak mode
    const { system, user } = buildTweakPrompt({
      platform: data.platform as Platform,
      tone: data.tone as Tone,
      currentDraft: data.currentDraft,
      direction: data.direction,
      sourceText: data.sourceText,
    });
    const text = await callLlm({
      provider: data.provider,
      apiKey: effectiveApiKey,
      model: data.model,
      system,
      user,
    });
    const obj = parseJsonResponse<Record<string, string>>(text);
    return NextResponse.json({ results: obj });
  } catch (err) {
    const message = err instanceof Error ? err.message : "生成失敗";
    const friendly = humanizeError(message, data.provider, data.model);
    const status = /api[_ ]?key|401|403|authentication|invalid[_ ]?key/i.test(message)
      ? 401
      : /429|rate[_ ]?limit|quota|RESOURCE_EXHAUSTED/i.test(message)
      ? 429
      : 500;
    return NextResponse.json({ error: friendly }, { status });
  }
}

function humanizeError(
  raw: string,
  provider: "anthropic" | "openai" | "gemini",
  model: string
): string {
  if (
    provider === "gemini" &&
    /limit:\s*0/i.test(raw) &&
    /RESOURCE_EXHAUSTED|free[_ ]?tier/i.test(raw)
  ) {
    return (
      `Gemini 對「${model}」這個模型的免費額度是 0（不是用完，是本來就不給）。` +
      `Google 從 2025/12 調整了免費方案。` +
      `解法：到設定頁切換到「Gemini 2.5 Flash Lite」（15 RPM / 1000 次/天都是免費的）。`
    );
  }

  if (provider === "gemini" && /429|RESOURCE_EXHAUSTED/i.test(raw)) {
    const m = raw.match(/retry in ([\d.]+)s/i);
    const retryHint = m ? `約 ${Math.ceil(Number(m[1]))} 秒後重試。` : "";
    return `Gemini 請求太快或額度用完。${retryHint}或切換到 Gemini 2.5 Flash Lite（額度最多）。`;
  }

  if (/429|rate[_ ]?limit|quota/i.test(raw)) {
    return `${provider === "anthropic" ? "Anthropic" : "OpenAI"} 回報額度／速率限制：${raw.slice(0, 150)}`;
  }

  if (/api[_ ]?key|401|403|authentication|invalid[_ ]?key/i.test(raw)) {
    return `API Key 無效或已撤銷。請到設定頁重貼，並確認 Key 所屬專案有啟用對應 API。`;
  }

  return raw.length > 400 ? raw.slice(0, 400) + "…" : raw;
}
