# 發佈文案素材（Day 13-14）

這份是已經寫好的社群發佈貼文草稿，上線時直接複製即可。每篇都遵循剪筆本身的平台規則——算是 dogfooding。

---

## 1. Threads 個人（中文）

```
做了個工具叫「剪筆」，解決兩個我每週都痛的問題：

1. 寫完一篇長文或錄完一集 Podcast，要剪成 Threads、X、LINE、IG 四個平台的短版——
   英文工具（Repurpose.io、Opus Clip）輸出永遠是「視頻、質量、信息」這種翻譯腔。
2. 有些 YouTube 影片沒字幕，根本抓不到內容。

所以我做了剪筆：
- Prompt 寫死台灣繁中語感，禁用大陸用語
- 接 Gemini 後可以**直接看無字幕的 YouTube**

BYOK 免費用——Gemini 有免費額度不用信用卡：
jianbi.app

想試用或罵我，都請留言 👋
```

---

## 2. X（Twitter，中英混發）

```
Shipped JianBi 剪筆 — a web tool that turns long content into Traditional Chinese social posts.

English tools treat Chinese as translation. JianBi's prompts are engineered for Taiwan voice. No more "视频" or "信息".

BYOK, free: jianbi.app
```

---

## 3. 方格子 / Matters 長文版（中文）

**標題**：我做了一個把長內容剪成繁中貼文的小工具，因為受不了英文工具的翻譯腔

**內文**：

```
如果你是中文創作者，應該都遇過這個情境：

錄完一集 Podcast，寫完一篇長文，
接下來要把同一個內容剪成 Threads、X、LINE、Instagram 四個平台的短版。
每個平台風格不同、字數不同、寫法不同，重包裝的時間常常比創作還久。

我試過 Repurpose.io、Opus Clip、Beehiiv 的 repurpose 功能——英文內容處理得不錯，
但一進到繁體中文就崩盤：

> 「今天我們要分享一個視頻，這個視頻的質量非常高，裡面包含了很多有價值的信息……」

這不是台灣人寫的東西。這是中英翻譯、再被簡轉繁的結果。

所以我做了剪筆（JianBi）。

差異化只有一件事：prompt 寫死台灣繁中語感。
- System prompt 明確禁用大陸用語，列出對照表（視頻→影片、質量→品質、信息→資訊…）
- 每個平台的字數、結構、CTA、emoji 規則都寫死
- 四種語氣（知識型、生活化、B2B、輕鬆幽默），每種都有範例錨點
- 反幻覺：不自行補料、不增加原文沒有的事實

技術架構：Next.js 16 + Anthropic Claude 主力 / OpenAI 備援。
採用 BYOK（使用者自帶 API Key）模式——
我這邊零成本、你的 Key 不會儲存在我伺服器，只在請求時轉傳給 Anthropic / OpenAI。

免費試用：https://jianbi.app

這是 v0.1 MVP，還很陽春。歡迎大家去戳，
使用過程遇到任何問題、輸出品質不 OK、想要什麼功能——
留言告訴我，我會持續優化。

最想聽到的回饋類型：
- 你常用的哪個平台剪筆漏了？（目前支援 Threads / X / LINE / IG）
- 四種語氣夠不夠？還想要哪種？
- 有沒有大陸用語從 prompt 漏網？（我最在意這個）
```

---

## 4. Facebook「內容創作者交流」類社團（中文）

```
分享一個我剛做完的小工具，給繁中創作者：

剪筆 JianBi（jianbi.app）

把 YouTube 連結 / Podcast 逐字稿 / 長文貼進去，
一鍵生出 Threads、X、LINE、IG 四個平台的繁中貼文草稿。

重點是 prompt 寫死**台灣繁中語感**——
不會輸出「視頻、質量、信息」那種翻譯腔，
也有台灣人常用的語尾和連接詞。

免費（BYOK，自帶 Anthropic/OpenAI Key），
希望能幫到大家重包裝內容的時間省一半 🙌

有建議或 bug 請直接留言或私訊我～
```

---

## 5. ProductHunt 英文

**Tagline**: Turn long content into native Traditional Chinese social posts

**Description**:
```
JianBi (剪筆) is a lightweight web tool that repurposes YouTube videos, podcast
transcripts, and long articles into platform-specific social posts for Threads,
X, LINE, and Instagram — all in Traditional Chinese with authentic Taiwan voice.

The problem: existing tools (Repurpose.io, Opus Clip) treat Chinese as a
translation task. The output is full of mainland-style terms that Taiwanese
readers find jarring.

JianBi's differentiation lives entirely in its prompts. The system prompt
explicitly bans mainland terms and provides a translation table. Platform-
specific rules (length, structure, CTA, emoji) are hard-coded. Four tone
presets each anchored with examples.

v0.1 MVP is free. BYOK model — bring your own Anthropic or OpenAI key, we
never store it.

Built by a solo founder in Taiwan. Feedback-driven roadmap:
→ v0.2: Stripe subscription with built-in quota
→ Phase 2: Chrome extension (works inline in Gmail/Threads/X editor)
→ Phase 3: LINE Official Account integration
```

---

## 6. Hacker News（Show HN，英文）

**Title**: `Show HN: JianBi – repurpose content into native Traditional Chinese social posts`

**Body**:
```
I built JianBi because English repurposing tools (Repurpose.io, Opus Clip)
produce terrible Traditional Chinese. Their prompts appear to treat CJK as a
translation layer — you end up with mainland-style vocabulary ("视频, 质量,
信息") that reads unnatural to Taiwanese audiences.

JianBi's differentiation is purely prompt engineering:
- System prompt bans mainland terms with an explicit translation table
- Platform-specific rules (Threads/X/LINE/IG) hard-coded
- Four tone presets, each anchored with a concrete example
- Anti-hallucination guard: no facts beyond what's in the source

Tech: Next.js 16, Anthropic SDK (Claude primary) + OpenAI (backup).
BYOK — users bring their own key, server never stores it.

Deployed on Vercel free tier. Open to feedback, especially from:
- Bilingual CJK content creators
- Anyone who's tried to make LLMs produce idiomatic Traditional Chinese
- Prompt engineering critics

https://jianbi.app
```
