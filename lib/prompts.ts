export type Platform = "threads" | "x" | "line" | "ig";
export type Tone = "knowledge" | "lifestyle" | "b2b" | "humor";

export const PLATFORM_LABELS: Record<Platform, string> = {
  threads: "Threads",
  x: "X (Twitter)",
  line: "LINE 官方帳號",
  ig: "Instagram 文案",
};

export const TONE_LABELS: Record<Tone, string> = {
  knowledge: "知識型",
  lifestyle: "生活化",
  b2b: "商業 B2B",
  humor: "輕鬆幽默",
};

const BANNED_TERMS_GUIDE = `
禁止使用的中國用語（必須改成台灣慣用語）：
- 視頻 → 改用「影片」
- 質量 → 改用「品質」
- 信息 → 改用「資訊」
- 通過 → 改用「透過」（表達手段時）
- 默認 → 改用「預設」
- 手機屏 / 屏幕 → 改用「螢幕」
- 軟件 → 改用「軟體」
- 硬盤 → 改用「硬碟」
- 打印 → 改用「列印」
- 在線 → 改用「線上」
- 網絡 → 改用「網路」
- 數據 → 依語境改用「資料」或「數據」（台灣兩者都用，但「資料」更常見）
- 賬號 → 改用「帳號」
- 項目 → 依語境改用「專案」或「項目」
- 用戶 → 改用「使用者」（一般情境）
- 高清 → 改用「高畫質」
- 郵箱 → 改用「信箱」
- 水平 → 描述能力時改用「程度」或「水準」
- 厲害的人設 → 不要用「人設」這種偏大陸網路用語，改用「形象」或「定位」
- 小哥哥 / 小姐姐 → 不要使用
- 牛 / 牛逼 / 絕了 → 不要使用這種大陸網感用語`.trim();

const TAIWAN_VOICE_GUIDE = `
語感要求（非常重要）：
1. 使用自然的台灣繁體中文，避免翻譯腔（避免直譯英文句式如「讓我們一起...」「這將會...」）
2. 可以適度使用台灣常見語尾：「啊」「欸」「呢」「耶」「吧」「喔」（視語氣斟酌）
3. 避免過度使用冒號＋破折號的西式句構
4. 表達因果時優先用「所以」「因為」而非「是故」「因此」
5. 自然的口語化連接詞 OK：「說真的」「老實說」「其實」「話說回來」
6. 不要濫用 emoji，知識型內容每則貼文最多 1-2 個，生活／幽默型最多 3-4 個
7. 直述優於形容詞堆疊；少用「非常」「極致」「震撼」等情緒灌水詞`.trim();

const ANTI_HALLUCINATION_GUIDE = `
內容事實規則：
- 只能根據「來源內容」裡實際出現的資訊撰寫。嚴禁自行添加未提及的人名、數字、日期、引述。
- 若來源資訊不足以支撐完整貼文，寧可寫短，不要補料。
- 可以重新組織、濃縮、聚焦重點；不可以虛構。`.trim();

const PLATFORM_RULES: Record<Platform, string> = {
  threads: `
【Threads】
- 字數：150–500 字（繁中計字，不含空白）
- 結構：第一行 hook（一句勾人），中段展開 2–3 個重點，結尾一句收束或提問
- 段落：段落間請用一個空行分隔
- Emoji：視情況 1-3 個，放在段首或重點前，不要句尾灌水
- 不要 hashtags
- 不要寫「點連結看全文」之類的外連 CTA（Threads 討厭導流）`.trim(),

  x: `
【X (Twitter)】
- 若一則可容納：必須控制在 280 字（英文字元計；繁中 1 字約等於 2 字元，請控制在 140 繁中字內）
- 若超過：改用 thread 形式，最多 5 則，每則開頭標「1/」「2/」等
- 結構：每則都要能獨立閱讀；第 1 則是最強鉤子
- Emoji：最多 1 個，僅用於 hook
- 可以用 1–2 個繁中關鍵字作為話題（不一定要加 #）`.trim(),

  line: `
【LINE 官方帳號廣播文】
- 字數：200–350 繁中字
- 結構：
  1. 第一行：一句話說清這則訊息的價值（訂閱者必須立刻知道為什麼要讀）
  2. 中段：2–3 段重點，段落間空一行
  3. 結尾：CTA（例如「回覆『1』了解更多」「點連結看完整版」）
- 口吻：像在跟會員聊天，親切但不油膩
- Emoji：段首可用 1 個小符號（例如 ✦ ✿ ▶）作為段落標記`.trim(),

  ig: `
【Instagram 文案】
- 字數：200–2200 字（IG 上限 2200）
- 結構：
  1. 第一行：強情緒鉤子（驚喜、衝突、承諾、好奇）
  2. 用短段落展開（每段 1–3 句），方便手機閱讀
  3. 結尾放 5–8 個繁中 hashtags（#台灣 #創作者 之類）
- Emoji：可以多一些（3–6 個），但每段最多 2 個
- 避免出現連結（IG 文案中的連結不可點）`.trim(),
};

const TONE_GUIDES: Record<Tone, string> = {
  knowledge: `
【知識型】
- 先下結論、再展開原因與佐證
- 邏輯清楚、條列或數字化重點
- 避免情緒化形容詞
- 例：「今天看了一段訪談，三個我之前想錯的地方——」`.trim(),

  lifestyle: `
【生活化】
- 像跟朋友聊天，可以帶個人觀察與感受
- 可用語尾助詞（欸、啊、耶）
- 偶爾自嘲或輕鬆反問
- 例：「今天散步的時候突然想到一件事，有點好笑又有點感傷——」`.trim(),

  b2b: `
【商業 B2B】
- 專業、簡潔、不冗贅
- 重點條列或編號，善用破折號與冒號
- 結尾給明確的下一步（行動建議、思考問題、或聯繫方式）
- 避免 emoji 與流行語
- 例：「這週整理了三個我在客戶端反覆看到的錯誤——」`.trim(),

  humor: `
【輕鬆幽默】
- 可以自嘲、誇飾、反轉
- 善用意料之外的比喻
- 節奏感重要，短句多、標點大方用
- 不要低俗、不要冒犯特定族群
- 例：「跟大家報告一個令人崩潰的小發現：我花三小時研究的功能，老闆 30 秒就否決了。」`.trim(),
};

export function buildSystemPrompt(): string {
  return `你是「剪筆」，一個專門把長內容改寫成台灣繁體中文社群貼文的助手。

${TAIWAN_VOICE_GUIDE}

${BANNED_TERMS_GUIDE}

${ANTI_HALLUCINATION_GUIDE}

輸出格式規則：
- 你必須輸出純 JSON，不要任何解釋、不要 markdown code fence、不要任何前後文字
- JSON schema: 只包含用戶請求的平台 key，每個 key 對應一則貼文字串
- 可能的 key: threads, x, line, ig
- 字串內的換行用 \\n，不要用實際換行
`;
}

export interface BuildUserPromptParams {
  sourceTitle?: string;
  sourceText: string;
  platforms: Platform[];
  tone: Tone;
  hint?: string;
}

export function buildUserPrompt(params: BuildUserPromptParams): string {
  const { sourceTitle, sourceText, platforms, tone, hint } = params;

  const platformSections = platforms
    .map((p) => PLATFORM_RULES[p])
    .join("\n\n");

  const toneSection = TONE_GUIDES[tone];

  const keyList = platforms.map((p) => `"${p}"`).join(", ");

  return `以下是來源內容。請根據以下平台規則與語氣，為每個請求的平台各產出一則貼文草稿。

${sourceTitle ? `【來源標題】\n${sourceTitle}\n\n` : ""}【來源內容】
${sourceText.trim()}

────

${toneSection}

────

${platformSections}

────

請用這個語氣，分別為以下平台產出草稿（只輸出 JSON）：
平台：${platforms.map((p) => PLATFORM_LABELS[p]).join("、")}

${hint ? `額外指示：${hint}\n\n` : ""}嚴格遵守：
- 輸出必須是合法 JSON，且**只有** JSON，沒有其他任何字
- JSON 只能包含這些 key：${keyList}
- 每個 key 的值是該平台的貼文字串
- 字串內的換行用 \\n
`;
}

// When feeding a YouTube URL directly to Gemini (video understanding mode)
export function buildVideoUserPrompt(params: {
  platforms: Platform[];
  tone: Tone;
}): string {
  const { platforms, tone } = params;

  const platformSections = platforms
    .map((p) => PLATFORM_RULES[p])
    .join("\n\n");

  const toneSection = TONE_GUIDES[tone];
  const keyList = platforms.map((p) => `"${p}"`).join(", ");

  return `你現在直接看這部 YouTube 影片。看完後，根據以下平台規則與語氣，為每個請求的平台各產出一則貼文草稿。

────

${toneSection}

────

${platformSections}

────

請用這個語氣，分別為以下平台產出草稿（只輸出 JSON）：
平台：${platforms.map((p) => PLATFORM_LABELS[p]).join("、")}

嚴格遵守：
- 輸出必須是合法 JSON，且**只有** JSON，沒有其他任何字
- JSON 只能包含這些 key：${keyList}
- 每個 key 的值是該平台的貼文字串
- 字串內的換行用 \\n
- 內容必須根據影片實際內容，不可虛構
`;
}

// For the "tweak" button (shorter/longer)
export function buildTweakPrompt(params: {
  platform: Platform;
  tone: Tone;
  currentDraft: string;
  direction: "shorter" | "longer" | "regenerate";
  sourceText: string;
}): { system: string; user: string } {
  const { platform, tone, currentDraft, direction, sourceText } = params;

  const directive =
    direction === "shorter"
      ? "請把這則貼文改短（約減少 30%），但保留最重要的鉤子與結尾"
      : direction === "longer"
      ? "請把這則貼文改長（約增加 30%），補充來源中有提到但貼文未展開的細節；不可虛構"
      : "請重新生成一個**不同切角**的版本，保持同一語氣與平台規則，但選擇不同的 hook 與重點";

  return {
    system: buildSystemPrompt(),
    user: `以下是目前的${PLATFORM_LABELS[platform]}貼文草稿：

【目前草稿】
${currentDraft}

【原始來源內容】
${sourceText.trim()}

────

${TONE_GUIDES[tone]}

────

${PLATFORM_RULES[platform]}

────

${directive}。

嚴格只輸出這個 JSON（沒有其他任何字）：
{ "${platform}": "改寫後的完整貼文" }
`,
  };
}
