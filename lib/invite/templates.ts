import { fillPlaceholders, normalizeAiText } from "@/lib/ai/text";

// 派對邀請文案：一般版用固定範本，AI 版只把「派對類型＋場地＋語氣」交給 AI。
// 寶寶小名、日期、時間一律用 {name}、{date}、{time} 預留，最後在瀏覽器填入，不送給 AI。

export const PARTY_TYPES = ["抓周派對", "收涎派對", "生日派對", "性別揭曉派對"] as const;
export type PartyType = (typeof PARTY_TYPES)[number];

export const TONES = ["溫馨", "俏皮", "正式"] as const;
export type Tone = (typeof TONES)[number];

export interface InviteInput {
  partyType: PartyType;
  venue: string;
  tone: Tone;
}

const OPENING: Record<PartyType, string> = {
  抓周派對: "{name}滿一歲啦！要來抓周囉",
  收涎派對: "{name}四個月大了，要來收涎囉",
  生日派對: "{name}要過生日啦",
  性別揭曉派對: "寶寶是男生還是女生？答案就要揭曉囉",
};

const TEMPLATES: Record<Tone, (i: InviteInput) => string> = {
  溫馨: (i) =>
    [
      `💕 ${OPENING[i.partyType]}～`,
      "",
      `謝謝一路以來陪伴與疼愛{name}的每一位家人朋友，`,
      `我們準備了一場小小的${i.partyType}，想邀請你一起來見證這個重要的時刻 🥰`,
      "",
      `🗓 日期：{date}`,
      `⏰ 時間：{time}`,
      `🏠 場地：${i.venue}`,
      "",
      "有你在，這一天會更加完整，期待見到你！",
    ].join("\n"),
  俏皮: (i) =>
    [
      `🎉 叮咚！${OPENING[i.partyType]}～`,
      "",
      `${i.partyType}現場有可愛的{name}、有拍不完的照片，還有超多驚喜等著你 🤩`,
      "錯過要再等一年喔（不是）！快把時間空下來～",
      "",
      `🗓 {date}`,
      `⏰ {time}`,
      `🏠 ${i.venue}`,
      "",
      "記得穿美美帥帥的來，現場見！🙌",
    ].join("\n"),
  正式: (i) =>
    [
      `敬邀 ✉️`,
      "",
      `感謝各位親友長久以來的關心與祝福。`,
      `適逢${OPENING[i.partyType].replace(/[啦囉]+$/, "")}，謹訂於下列時間舉辦${i.partyType}，`,
      "誠摯邀請您蒞臨同歡，共同見證寶貝成長的重要時刻。",
      "",
      `日期：{date}`,
      `時間：{time}`,
      `地點：${i.venue}`,
      "",
      "恭候光臨",
    ].join("\n"),
};

export const templateInvite = (input: InviteInput) => TEMPLATES[input.tone](input);

export const invitePrompt = (input: InviteInput) =>
  [
    "你要幫台灣的爸媽寫一則傳到 LINE 群組的派對邀請訊息。",
    `派對類型：${input.partyType}；場地：${input.venue}；語氣：${input.tone}。`,
    "請用繁體中文、台灣用語，可以適度使用表情符號，長度 80～160 字。",
    "寶寶一律寫成「{name}」，日期寫成「{date}」，時間寫成「{time}」，不要自己編名字、日期或時間。",
    "訊息裡要清楚列出日期、時間、場地（可分行）。不要寫地址、電話、價格或任何網址，最後一行不用署名。",
    "{name}、{date}、{time} 前後不要加空格。",
    "回傳 JSON：message 欄位放完整訊息，段落之間直接換行。",
  ].join("\n");

export const INVITE_SCHEMA = {
  type: "OBJECT",
  properties: { message: { type: "STRING" } },
  required: ["message"],
} as const;

const MAX_MESSAGE = 800;

export const parseInvite = (value: unknown): string | null => {
  if (typeof value !== "object" || value === null) return null;
  const message = (value as Record<string, unknown>).message;
  if (typeof message !== "string") return null;
  const text = normalizeAiText(message);
  return text.includes("{date}") ? text.slice(0, MAX_MESSAGE) : null;
};

const WEEKDAYS = "日一二三四五六";

/** 「2026-12-05」→「2026/12/05（六）」；空值回傳空字串 */
export const formatDate = (value: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return "";
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return `${m[1]}/${m[2]}/${m[3]}（${WEEKDAYS[d.getDay()]}）`;
};

export const fillInvite = (
  message: string,
  values: { name: string; date: string; time: string },
) =>
  fillPlaceholders(message, values);
