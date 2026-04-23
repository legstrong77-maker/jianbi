# 剪筆 JianBi

> 一鍵把長內容剪成台灣繁體中文的各平台貼文草稿。Threads · X · LINE · IG。

繁中創作者（YouTuber、Podcaster、電子報作者、Threads 創作者）痛點明確：
寫完長內容後，要在各平台重新包裝成短貼文太費時；現有英文工具（Repurpose.io、Opus Clip）
翻譯腔重，輸出「視頻、質量、信息」那類大陸用語，不像台灣人寫的。

剪筆的差異化就一件事：**prompt 寫死台灣繁中語感 + 平台格式規則**，
讓 AI 知道要怎麼寫才像台灣人。

## 快速開始

```bash
npm install
npm run dev
# 開 http://localhost:3000
```

首次進入會看到「尚未設定 API Key」提示。到 `/settings` 三選一：

- **Google Gemini（推薦）**：免費、到 [aistudio.google.com/apikey](https://aistudio.google.com/apikey) 2 分鐘拿 Key，不需信用卡。而且 Gemini 可以**直接看 YouTube 影片**，沒字幕也能剪。
- **Anthropic Claude**：付費，中文語感最好
- **OpenAI GPT**：付費，備援

## 技術架構

- **Next.js 16 (App Router) + TypeScript**
- **Tailwind v4**
- 三個 AI provider：**Gemini**（預設，免費）/ **Anthropic Claude** / **OpenAI**
- **BYOK**：使用者自帶 API Key，伺服器零儲存
- **無資料庫**：設定與歷史紀錄存在瀏覽器 localStorage
- **Gemini 獨家**：YouTube URL 可直接傳入（不需字幕），走 `callGeminiWithYoutube` 路徑

## 差異化核心

全部在 [lib/prompts.ts](lib/prompts.ts)：

1. **System prompt** 明言「台灣繁體中文」，並列出禁用大陸用語對照表
   （視頻 → 影片、質量 → 品質、信息 → 資訊…）
2. **平台規則**寫死每個平台的字數、結構、CTA、emoji 使用原則
3. **語氣錨點**四種：知識型 / 生活化 / B2B / 輕鬆幽默，每種有具體範例
4. **反幻覺**：要求只用原文實際出現的事實

## 目錄結構

```
app/
├── layout.tsx                # 全站 layout（繁中 metadata、Noto Sans TC）
├── page.tsx                  # 首頁 landing + 工具
├── settings/page.tsx         # API Key 設定
├── privacy/page.tsx          # 隱私政策
└── api/
    ├── extract/route.ts      # POST: { url } → { title, text }
    └── generate/route.ts     # POST: 生成 / 微調
components/                   # React 元件
lib/
├── prompts.ts                # ⭐ 差異化核心（含 video 模式 prompt）
├── providers.ts              # 三 provider 抽象 + Gemini YouTube 直讀
├── extract.ts                # YouTube / Readability（字幕抓取路徑）
├── youtube.ts                # URL 判斷 + ID 解析（client/server 共用）
├── storage.ts                # localStorage helpers
└── utils.ts                  # cn() helper
```

## 常用指令

```bash
npm run dev       # 開發（Turbopack）
npm run build     # 正式 build（含 type check）
npm run start     # 跑 production build
npm run lint      # ESLint
```

## 部署到 Vercel

1. 把 repo push 到 GitHub
2. 到 [vercel.com/new](https://vercel.com/new) 匯入 repo
3. 不用設任何環境變數（BYOK 模式）
4. 綁 domain（選配）

詳見 [LAUNCH.md](LAUNCH.md)，發佈文案草稿在 [LAUNCH-POSTS.md](LAUNCH-POSTS.md)。

## Roadmap

- **v0.1 MVP**（本版）：四平台內容再製、BYOK、無金流、無帳號
- **v0.2**：加內建 API quota（前 50 用戶限量）、加訂閱機制
- **Phase 2**：Chrome 擴充（「筆尖」），在 Gmail/Threads 寫作時 inline 呼叫
- **Phase 3**：LINE 官方帳號整合，一鍵把剪筆結果推送給訂閱者

## 授權

MIT
