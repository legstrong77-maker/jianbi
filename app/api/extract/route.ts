import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { extractFromUrl } from "@/lib/extract";

export const runtime = "nodejs";
export const maxDuration = 30;

const BodySchema = z.object({
  url: z.string().url({ message: "請輸入合法網址" }),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "請求 body 不是合法 JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "請求格式錯誤" },
      { status: 400 }
    );
  }

  try {
    const result = await extractFromUrl(parsed.data.url);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "未知錯誤";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
