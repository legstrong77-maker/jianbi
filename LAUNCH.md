# 剪筆 v0.1 發佈手冊

這份文件是 14 天 ship 計畫的 Day 12–14：部署到 Vercel、綁 domain、上 ProductHunt、社群發佈。

## 1. Push 到 GitHub（5 分鐘）

```bash
cd c:/Users/User/Desktop/app
git add .
git commit -m "feat: JianBi v0.1 MVP"
# 到 github.com 建立一個新 repo：jianbi
git remote add origin git@github.com:你的帳號/jianbi.git
git branch -M main
git push -u origin main
```

如果還沒有 GitHub 帳號：[github.com/signup](https://github.com/signup)。

## 2. 部署到 Vercel（5 分鐘）

1. 到 [vercel.com](https://vercel.com) → 用 GitHub 登入
2. Dashboard → **New Project** → 選擇剛才的 `jianbi` repo
3. **Framework Preset**：Next.js（自動偵測）
4. **Environment Variables**：**都不用填**（BYOK 模式）
5. 點 **Deploy**

約 2 分鐘後你會拿到類似 `https://jianbi-xxx.vercel.app` 的網址。

## 3. 綁 Domain（選配，~$15/年）

### 推薦 domain

- `jianbi.app`（`.app` 有強制 HTTPS、語意清楚）
- `jianbi.tw`（`.tw` 強打台灣）
- `jianbi.co`（短好記）

**買 domain**：推薦 [Porkbun](https://porkbun.com) 或 [Namecheap](https://namecheap.com)。
註冊流程約 5 分鐘。

### 綁定步驟

1. Vercel Dashboard → Project → **Settings** → **Domains** → **Add**
2. 輸入你買的 domain（例 `jianbi.app`）
3. Vercel 會提供需要設定的 DNS 記錄（通常是 A + CNAME）
4. 到你的 domain 註冊商（Porkbun/Namecheap）的 DNS 設定頁，新增這些記錄
5. 等 DNS 生效（通常 < 30 分鐘，最久 48 小時）
6. Vercel 會自動幫你簽 Let's Encrypt SSL 憑證

## 4. 加 Plausible 分析（選配，首月免費）

1. 到 [plausible.io](https://plausible.io) 註冊（有 30 天免費試用）
2. 加一個 site：`jianbi.app`
3. 複製給你的 script tag
4. 貼到 [app/layout.tsx](app/layout.tsx) 的 `<head>`（改為 Next.js 的 `<Script>` 元件會更合規）：

```tsx
import Script from "next/script";

// 在 <body> 之前加：
<Script
  defer
  data-domain="jianbi.app"
  src="https://plausible.io/js/script.js"
  strategy="afterInteractive"
/>
```

或使用環境變數切換（見 `.env.example`）。

## 5. 上架 ProductHunt（Day 13–14）

### 準備素材

- **Tagline**：「A web tool that turns long content into native Traditional Chinese social posts」（或中英雙版）
- **主要圖**：首頁截圖，尺寸 **1270×760**
- **Gallery 圖**：至少 3 張，尺寸 1270×760（流程圖、結果圖、設定圖）
- **Demo video**（選配但強烈建議）：30-60 秒

### 發文策略

1. **發佈時間**：選週二、週三、週四（流量最高），太平洋時間上午 00:01（即台灣下午 4 點）
2. **先加入 Maker 身分**：3–5 天前建好 Maker profile
3. **找 Hunter**：有影響力的 Hunter 幫你刊 hunt；或自己 hunt
4. **首日社群動員**：發佈當日早上在 Threads、Facebook 社團、LINE 群組推
5. **留言互動**：整天都要回留言

### 發佈文案範本

**英文**：

> 🎉 Meet JianBi — a web tool that turns YouTube, podcasts, and long articles into **native Traditional Chinese** social posts for Threads, X, LINE, and Instagram.
>
> English tools treat Chinese as a translation task. JianBi's prompts are engineered for Taiwan voice — no more "视频" or "信息" in your output.
>
> Free to try (BYOK — bring your own Anthropic/OpenAI key; we don't store it). Feedback welcome!

**中文**（方格子 / Threads / FB）：

> 📌 剪筆 JianBi — 一鍵把長內容剪成台灣繁中貼文的 Web 工具
>
> 我注意到一個問題：Repurpose.io、Opus Clip 這些英文工具處理中文時，吐出來全是「視頻、質量、信息」這類翻譯腔——完全不像台灣人寫的。
>
> 所以我做了剪筆。把 YouTube、Podcast、長文貼進去，它會幫你產出 Threads、X、LINE、IG 四個平台的繁中貼文草稿，prompt 寫死台灣語感，禁用大陸用語。
>
> 🔑 BYOK 模式免費用（自帶 Anthropic / OpenAI Key，我們不儲存），歡迎大家來試 → jianbi.app
>
> 有任何使用回饋歡迎留言，我會持續優化！

## 6. 社群發佈清單（Day 13–14）

| 社群 | 版本 | 何時 |
|---|---|---|
| ProductHunt | 英文 | Day 13 太平洋 00:01（台灣下午 4 點） |
| Threads（個人） | 中文短版 | Day 13 同日傍晚 |
| 方格子 / Matters | 中文長版（含故事） | Day 13 晚上 |
| Facebook「內容創作者交流社團」 | 中文短版 | Day 13 晚上 |
| LINE「行銷／自媒體」群組 | 中文短版（不要太貼廣告） | Day 14 |
| X（Taiwan dev Twitter） | 英文 + 中文雙發 | Day 14 |
| 獨立開發者 Discord（例：ihower、Mvplog） | 中文 | Day 14 |
| Hacker News（Show HN） | 英文 | Day 14（選配，風險：流量但冷） |

## 7. 追蹤指標（Day 13–14 各檢查一次）

| 指標 | 工具 | 目標（首週） |
|---|---|---|
| UV / PV | Plausible | UV > 300 / PV > 1000 |
| 「一鍵剪筆」點擊數 | Plausible custom event | > 50 |
| API 錯誤率 | Vercel Logs | < 5% |
| ProductHunt upvotes | ProductHunt page | > 50（能上當日前 20） |
| 社群轉發 | 手動統計 | > 3 人轉發 |

## 8. 如果上線後爆錯

**最可能的兩個問題**：

1. **YouTube transcript 抓不到**（YouTube 常變 API 防護）
   → fallback：引導使用者改用「直接貼文字」模式。UI 已內建。

2. **模型回傳非法 JSON**
   → providers.ts 的 `parseJsonResponse` 已有容錯（去除 markdown fence、抓最外層 `{...}`）
   → 如仍失敗：顯示明確錯誤、加「重試」按鈕

## 9. 下一步（如果有訊號）

- 首週超過 50 次生成、10 個活躍 user → **開始規劃 v0.2**：
  - Stripe 訂閱（$9/月：內建 API quota，去除 BYOK 摩擦）
  - Supabase 帳號（保存歷史紀錄）
  - 多支持一個平台：Medium / 方格子文章格式
- 首週不到 20 次生成 → **先做 customer dev**：訪談 5 個創作者，了解真正痛點
