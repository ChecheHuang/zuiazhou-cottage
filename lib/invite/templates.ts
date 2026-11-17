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

// 每種語氣有好幾種寫法，「換一個寫法」會換到跟目前不同的那一份
type Template = (i: InviteInput) => string;

const details = (i: InviteInput, labels = true) =>
  labels
    ? [`🗓 日期：{date}`, `⏰ 時間：{time}`, `🏠 場地：${i.venue}`]
    : [`🗓 {date}`, `⏰ {time}`, `🏠 ${i.venue}`];

const TEMPLATES: Record<Tone, Template[]> = {
  溫馨: [
    (i) =>
      [
        `💕 ${OPENING[i.partyType]}～`,
        "",
        `謝謝一路以來陪伴與疼愛{name}的每一位家人朋友，`,
        `我們準備了一場小小的${i.partyType}，想邀請你一起來見證這個重要的時刻 🥰`,
        "",
        ...details(i),
        "",
        "有你在，這一天會更加完整，期待見到你！",
      ].join("\n"),
    (i) =>
      [
        `🌷 ${OPENING[i.partyType]}～`,
        "",
        "時間過得好快，那個小小的身影一天天長大，",
        `這次的${i.partyType}，想和最愛{name}的你們一起度過 💗`,
        "",
        ...details(i),
        "",
        "不用準備什麼，人到就是最好的祝福，等你來喔！",
      ].join("\n"),
    (i) =>
      [
        `🧸 ${OPENING[i.partyType]}～`,
        "",
        `{name}的成長路上，每一份關心我們都記在心裡。`,
        `想在${i.partyType}這天，把這份感謝和喜悅分享給你 ✨`,
        "",
        ...details(i),
        "",
        "一起為{name}留下溫暖的回憶吧，期待相見 🤍",
      ].join("\n"),
  ],
  俏皮: [
    (i) =>
      [
        `🎉 叮咚！${OPENING[i.partyType]}～`,
        "",
        `${i.partyType}現場有可愛的{name}、有拍不完的照片，還有超多驚喜等著你 🤩`,
        "錯過要再等一年喔（不是）！快把時間空下來～",
        "",
        ...details(i, false),
        "",
        "記得穿美美帥帥的來，現場見！🙌",
      ].join("\n"),
    (i) =>
      [
        `📣 緊急通知！${OPENING[i.partyType]}～`,
        "",
        `本寶寶{name}親自發出邀請（由爸媽代打 🤭）`,
        `${i.partyType}缺你一個就不完美，請準時報到！`,
        "",
        ...details(i, false),
        "",
        "笑容請自備，可愛由我負責 😎",
      ].join("\n"),
    (i) =>
      [
        `🥳 嗨嗨！${OPENING[i.partyType]}～`,
        "",
        `聽說{name}的${i.partyType}有好吃的、好玩的、還有超療癒的笑容 🫶`,
        "名額有限（其實是座位有限），先搶先贏～",
        "",
        ...details(i, false),
        "",
        "收到請回一個 🙋，我們現場見！",
      ].join("\n"),
  ],
  正式: [
    (i) =>
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
    (i) =>
      [
        `誠摯邀請 ✉️`,
        "",
        `承蒙各位親友對{name}的照顧與疼愛，`,
        `謹訂於下列時間舉辦${i.partyType}，`,
        "敬備薄宴，恭請闔府光臨，分享我們的喜悅。",
        "",
        `日期：{date}`,
        `時間：{time}`,
        `地點：${i.venue}`,
        "",
        "敬請撥冗蒞臨",
      ].join("\n"),
    (i) =>
      [
        `${i.partyType}邀請函 ✉️`,
        "",
        `${OPENING[i.partyType].replace(/[啦囉]+$/, "")}，`,
        "為感謝親友們一路的支持與祝福，特備此會，",
        "誠邀您撥冗出席，與我們一同為寶貝獻上祝福。",
        "",
        `日期：{date}`,
        `時間：{time}`,
        `地點：${i.venue}`,
        "",
        "期待您的光臨",
      ].join("\n"),
  ],
};

/** 回傳範本內容與用的是第幾份；avoid 給目前那一份，就會換一份不一樣的 */
export const templateInvite = (input: InviteInput, avoid?: number) => {
  const list = TEMPLATES[input.tone];
  const choices = list.map((_, i) => i).filter((i) => i !== avoid);
  const index = choices[Math.floor(Math.random() * choices.length)] ?? 0;
  return { text: list[index](input), index };
};

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
