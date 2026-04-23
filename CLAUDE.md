@AGENTS.md

# 剪筆 JianBi — 給未來 Claude 讀

## 這是什麼專案

台灣繁中內容再製 Web SaaS（v0.1 MVP）。核心用戶：台灣中文創作者。核心動作：貼長內容 → 產出 Threads/X/LINE/IG 繁中草稿。

**差異化只有一件事**：prompt 寫死台灣繁中語感。這件事的實作全在 `lib/prompts.ts`。若要調整輸出品質，**先改 prompt，不要改模型**。

## 專案規則

1. **BYOK 原則是底線**：使用者的 API Key 絕不寫入資料庫、日誌、分析事件。任何 PR 若違反，直接拒絕。
2. **禁詞檢查是核心賣點**：`BANNED_TERMS_GUIDE` 若要修改，必須保留（視頻／質量／信息／通過／默認／軟件／網絡…）。新增禁詞歡迎。
3. **無資料庫**：v0.1 刻意不加 DB。歷史紀錄、設定全在 localStorage。若未來加 DB，要在 `docs/` 先寫 ADR。
4. **平台順序**：Threads → X → LINE → IG（台灣創作者優先順序，不要亂改）。
5. **錯誤訊息全繁中**：所有給使用者看的錯誤都要用自然繁中，不要英中混雜。
6. **模型預設**：Anthropic 主推，OpenAI 備援。新增 provider 要同時更新 `providers.ts`、`ApiKeyForm.tsx`、`storage.ts`。

## 開發常用指令

```bash
npm run dev       # Turbopack 開發
npm run build     # 正式 build（含 TS 檢查，CI/部署必跑）
npm run lint      # ESLint
```

## Day 14 後續規劃

- Phase 2：Chrome 擴充「筆尖」——重用 `lib/prompts.ts`
- Phase 3：LINE 官方帳號整合
- v0.2：Stripe $9/月 + 內建 quota（仍保留 BYOK 選項）

## 發佈文件

- [LAUNCH.md](LAUNCH.md) — Vercel 部署、domain、Plausible、ProductHunt 流程
- [LAUNCH-POSTS.md](LAUNCH-POSTS.md) — 各社群的貼文草稿（dogfooded —— 用剪筆自己的 prompt 規則寫的）
