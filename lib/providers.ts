import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

export type Provider = "anthropic" | "openai" | "gemini";

export interface LlmCallParams {
  provider: Provider;
  apiKey: string;
  model: string;
  system: string;
  user: string;
}

/** Text-in, text-out call. Used by all providers for normal (non-video) paths. */
export async function callLlm(params: LlmCallParams): Promise<string> {
  if (params.provider === "anthropic") return callAnthropic(params);
  if (params.provider === "openai") return callOpenAI(params);
  return callGemini(params);
}

/**
 * Gemini-only: pass a YouTube URL directly to the model (video understanding).
 * No transcript needed — the model watches the video.
 */
export async function callGeminiWithYoutube(params: {
  apiKey: string;
  model: string;
  system: string;
  user: string;
  youtubeUrl: string;
}): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: params.apiKey });
  const resp = await ai.models.generateContent({
    model: params.model,
    contents: [
      {
        role: "user",
        parts: [
          { fileData: { fileUri: params.youtubeUrl, mimeType: "video/*" } },
          { text: params.user },
        ],
      },
    ],
    config: {
      systemInstruction: params.system,
      responseMimeType: "application/json",
    },
  });
  const text = resp.text;
  if (!text) throw new Error("Gemini 回應空白");
  return text;
}

async function callAnthropic(params: LlmCallParams): Promise<string> {
  const client = new Anthropic({ apiKey: params.apiKey });
  const resp = await client.messages.create({
    model: params.model,
    max_tokens: 4096,
    system: params.system,
    messages: [{ role: "user", content: params.user }],
  });
  const first = resp.content[0];
  if (first.type !== "text") {
    throw new Error("Anthropic 回應非文字格式");
  }
  return first.text;
}

async function callOpenAI(params: LlmCallParams): Promise<string> {
  const client = new OpenAI({ apiKey: params.apiKey });
  const resp = await client.chat.completions.create({
    model: params.model,
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: params.user },
    ],
    response_format: { type: "json_object" },
  });
  const text = resp.choices[0]?.message?.content;
  if (!text) throw new Error("OpenAI 回應空白");
  return text;
}

async function callGemini(params: LlmCallParams): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: params.apiKey });
  const resp = await ai.models.generateContent({
    model: params.model,
    contents: [{ role: "user", parts: [{ text: params.user }] }],
    config: {
      systemInstruction: params.system,
      responseMimeType: "application/json",
    },
  });
  const text = resp.text;
  if (!text) throw new Error("Gemini 回應空白");
  return text;
}

/**
 * Extract a JSON object from the model's text response. Tolerates:
 * - Leading/trailing whitespace
 * - Accidental markdown fences ```json ... ```
 * - Leading commentary before the first `{`
 */
export function parseJsonResponse<T>(text: string): T {
  const trimmed = text.trim();

  let cleaned = trimmed;
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/```$/, "").trim();
  }

  if (!cleaned.startsWith("{")) {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(
      `模型回傳的不是合法 JSON。原始回應前 200 字元：${trimmed.slice(0, 200)}`
    );
  }
}
