import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "剪筆 JianBi — 一鍵把長內容剪成繁中貼文";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(circle at top right, #064e3b 0%, #09090b 60%)",
          padding: "80px",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              background: "#059669",
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 50,
              fontWeight: 700,
              color: "white",
            }}
          >
            剪
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40, fontWeight: 600 }}>剪筆 JianBi</span>
            <span style={{ fontSize: 22, color: "#a1a1aa" }}>
              台灣繁中內容再製
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          <span>一鍵把長內容</span>
          <span>
            剪成<span style={{ color: "#10b981" }}>台灣人看得順</span>的貼文
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 24,
            color: "#d4d4d8",
            marginTop: 40,
            gap: 6,
          }}
        >
          <span>✓ Threads / X / LINE / IG 四平台</span>
          <span>✓ BYOK · Key 不落地</span>
          <span>✓ 禁用大陸用語 · 台灣語感</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
