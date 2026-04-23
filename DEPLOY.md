# 部署指南：GitHub + Vercel（作品集展示模式）

這份是「最簡單」的發佈流程。**所有步驟加起來 10 分鐘**。你的 API Key 絕不會進 GitHub 或前端程式，只會存在 Vercel 伺服器端。

## 前置：你需要的三樣東西

1. **GitHub 帳號**（免費）：[github.com/signup](https://github.com/signup)
2. **Vercel 帳號**（免費）：[vercel.com/signup](https://vercel.com/signup)（可直接用 GitHub 登入）
3. **你的 Gemini API Key**：[aistudio.google.com/apikey](https://aistudio.google.com/apikey)

## 步驟 1：把專案推到 GitHub（3 分鐘）

### 1a. 先確認不會不小心把 key 推上去

本機請建立 `.env.local` 用於測試，**不要**把 key 寫進其他檔案：

```bash
cd c:/Users/User/Desktop/app
cp .env.example .env.local
# 編輯 .env.local，填入 GEMINI_API_KEY（這個檔案已在 .gitignore）
```

### 1b. 建 GitHub 新 repo（瀏覽器）

1. 到 [github.com/new](https://github.com/new)
2. Repository name：`jianbi`（或你想要的名字）
3. Public（作品集展示要公開）
4. **不要**勾 Initialize with README（我們本機已有）
5. 按 **Create repository**

建完 GitHub 會顯示指令，複製**第二組**「…or push an existing repository from the command line」。

### 1c. 推上去

```bash
cd c:/Users/User/Desktop/app
git add -A
git commit -m "feat: JianBi v0.1 MVP"
git branch -M main
git remote add origin https://github.com/你的帳號/jianbi.git
git push -u origin main
```

如果要求登入，用 GitHub 帳號 + [Personal Access Token](https://github.com/settings/tokens)
（不要用密碼，GitHub 已不接受）。

## 步驟 2：部署到 Vercel（3 分鐘）

### 2a. 匯入專案

1. 到 [vercel.com/new](https://vercel.com/new)
2. 「Import Git Repository」旁邊找到剛才的 `jianbi`，按 **Import**
3. Framework Preset：Next.js（自動偵測）

### 2b. 設定環境變數（**重要：key 在這裡**）

在 Configure Project 頁面，展開 **Environment Variables**，加以下四組：

| Name | Value | 說明 |
|---|---|---|
| `GEMINI_API_KEY` | `AIza...` | 你的 Gemini Key（只存 Vercel，不會進 GitHub） |
| `NEXT_PUBLIC_DEMO_MODE` | `1` | 開啟 demo 模式 |
| `DEMO_LIMIT_PER_HOUR` | `10` | 每 IP 每小時限額 |
| `DEMO_LIMIT_PER_DAY` | `30` | 每 IP 每日限額 |

Apply to: **Production, Preview, Development** 都打勾。

### 2c. 按 Deploy

約 2 分鐘後你會拿到 `https://jianbi-xxx.vercel.app` 網址。

## 步驟 3：驗證（2 分鐘）

開你的網址：

- ✅ 首頁應顯示「🎁 Demo 模式已啟用」的綠色提示
- ✅ 不用設定 Key 就能按「一鍵剪筆」
- ✅ 貼一個 YouTube 網址測試 → 應能正常產出四平台貼文
- ✅ 連按 10 次會觸發限額，錯誤訊息清楚提示

## 步驟 4：更新 GitHub README 加上你的部署網址（2 分鐘）

```bash
# 編輯 README.md，把「部署到 Vercel」那節加上你的實際網址
# 例：https://jianbi-xxx.vercel.app
git add README.md
git commit -m "docs: add live demo URL"
git push
```

Vercel 會自動重新部署（push 觸發 CI）。

## 故障排除

### Vercel 部署後網頁顯示「需要 API Key」警告
→ 環境變數沒生效。到 Vercel Dashboard → Settings → Environment Variables 檢查
`NEXT_PUBLIC_DEMO_MODE=1` 是否存在，以及 key 是否是 `GEMINI_API_KEY`（不是 `GEMINI_KEY` 之類的）。
改完要 **Redeploy** 才會套用。

### 生成按鈕按下去回 429
→ 你本人測試太多次，觸發了每小時 10 次限額。等 60 分鐘，或把 `DEMO_LIMIT_PER_HOUR`
調高再 Redeploy。

### Gemini 回 `limit: 0`
→ 你設定的是舊模型（2.0 Flash 已棄用）。本站會自動遷移，或到 settings 手動改
`gemini-2.5-flash-lite`。

## 進階：綁自己的 domain（選配）

1. Vercel Project → Settings → Domains → Add
2. 輸入 domain（例：`jianbi.app`）
3. 照 Vercel 提示設 DNS（通常是 A + CNAME record）
4. 等 DNS 生效（< 30 分鐘）
5. 到 GitHub README 更新新 URL

domain 推薦 [Porkbun](https://porkbun.com)，`.app` 約 $15/年，強制 HTTPS。
