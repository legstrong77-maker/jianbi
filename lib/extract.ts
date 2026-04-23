import { YoutubeTranscript } from "youtube-transcript";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { isYoutubeUrl, extractYoutubeId } from "./youtube";

export { isYoutubeUrl, extractYoutubeId };

export interface ExtractResult {
  title: string;
  text: string;
  source: "youtube" | "article" | "unknown";
}

export async function extractFromUrl(rawUrl: string): Promise<ExtractResult> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("網址格式不正確");
  }

  if (isYoutubeUrl(rawUrl)) {
    return extractYoutube(rawUrl);
  }

  return extractArticle(url);
}

async function extractYoutube(url: string): Promise<ExtractResult> {
  const id = extractYoutubeId(url);
  if (!id) throw new Error("無法解析 YouTube 影片 ID");

  let transcript;
  try {
    // Try Traditional Chinese first, then Simplified, then English, then any
    transcript = await tryTranscript(id, ["zh-TW", "zh-Hant"])
      .catch(() => tryTranscript(id, ["zh-CN", "zh-Hans", "zh"]))
      .catch(() => tryTranscript(id, ["en"]))
      .catch(() => YoutubeTranscript.fetchTranscript(id));
  } catch {
    throw new Error(
      "抓不到這支影片的字幕。解法：(1) 到設定頁切換到 Gemini，它可以直接看影片不需字幕；(2) 或改用「直接貼文字」模式貼逐字稿。"
    );
  }

  if (!transcript || transcript.length === 0) {
    throw new Error(
      "此影片沒有可用的字幕。請切換到 Gemini provider（直接看影片），或改用「直接貼文字」模式。"
    );
  }

  const text = transcript
    .map((t) => (t as { text: string }).text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  // Title fetching requires page scrape; skip for MVP (transcript is the main value)
  return {
    title: `YouTube 影片 ${id}`,
    text,
    source: "youtube",
  };
}

async function tryTranscript(id: string, langs: string[]) {
  let lastErr: unknown;
  for (const lang of langs) {
    try {
      const result = await YoutubeTranscript.fetchTranscript(id, { lang });
      if (result && result.length > 0) return result;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("No transcript found");
}

async function extractArticle(url: URL): Promise<ExtractResult> {
  let html: string;
  try {
    const resp = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8",
      },
      redirect: "follow",
    });
    if (!resp.ok) {
      throw new Error(`抓取網頁失敗（HTTP ${resp.status}）`);
    }
    html = await resp.text();
  } catch {
    throw new Error(
      `抓不到這個網址的內容。可能是：(1) 網站阻擋機器人；(2) 網址無效；(3) 需要登入。請改用「直接貼文字」模式。`
    );
  }

  const dom = new JSDOM(html, { url: url.toString() });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article || !article.textContent) {
    throw new Error("這個網頁沒有可擷取的主文，請改用「直接貼文字」模式");
  }

  const text = article.textContent
    .replace(/\s+/g, " ")
    .trim();

  if (text.length < 100) {
    throw new Error("擷取到的內容太短（少於 100 字），請改用「直接貼文字」模式");
  }

  return {
    title: article.title || url.hostname,
    text,
    source: "article",
  };
}
