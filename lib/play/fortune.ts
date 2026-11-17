// 抓周命盤：生肖、星座由程式計算，一般版用固定文字組合，AI 版只把
// 「生肖＋星座＋抓到的物品」交給 AI（不送寶寶小名與生日）。
// 前後台共用，不可 import server-only 模組。

import { fillPlaceholders, normalizeAiText } from "@/lib/ai/text";
import type { PlayItem } from "./items";

export interface FortuneSections {
  personality: string;
  talent: string;
  blessing: string;
}

// ─── 生肖：依農曆新年切換，不是單純看國曆年份 ─────────────────
const ZODIAC = ["鼠", "牛", "虎", "兔", "龍", "蛇", "馬", "羊", "猴", "雞", "狗", "豬"] as const;
export type Zodiac = (typeof ZODIAC)[number];

// 各年農曆新年（國曆月/日），瀏覽器不支援 Intl 農曆時的備案；表外的年份以 2/4（立春）近似
const LUNAR_NEW_YEAR: Record<number, [number, number]> = {
  2014: [1, 31],
  2015: [2, 19],
  2016: [2, 8],
  2017: [1, 28],
  2018: [2, 16],
  2019: [2, 5],
  2020: [1, 25],
  2021: [2, 12],
  2022: [2, 1],
  2023: [1, 22],
  2024: [2, 10],
  2025: [1, 29],
  2026: [2, 17],
  2027: [2, 6],
  2028: [1, 26],
  2029: [2, 13],
  2030: [2, 3],
  2031: [1, 23],
  2032: [2, 11],
};

// 瀏覽器內建的農曆換算（任何年份都準），取得該日所屬的農曆年
const chineseYearOf = (year: number, month: number, day: number) => {
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-chinese", {
      year: "numeric",
      timeZone: "UTC",
    }).formatToParts(new Date(Date.UTC(year, month - 1, day)));
    // relatedYear 是較新的標準，TypeScript 的型別還沒收錄
    const related = Number(
      parts.find((p) => (p.type as string) === "relatedYear")?.value,
    );
    // 結果應該是當年或前一年，不合理就當作不支援
    return related === year || related === year - 1 ? related : null;
  } catch {
    return null;
  }
};

export const zodiacOf = (year: number, month: number, day: number): Zodiac => {
  const fromIntl = chineseYearOf(year, month, day);
  if (fromIntl !== null) return ZODIAC[(((fromIntl - 4) % 12) + 12) % 12];
  // 不支援 Intl 農曆的環境才用下面的表
  const [m, d] = LUNAR_NEW_YEAR[year] ?? [2, 4];
  const beforeNewYear = month < m || (month === m && day < d);
  const lunarYear = beforeNewYear ? year - 1 : year;
  return ZODIAC[(((lunarYear - 4) % 12) + 12) % 12];
};

// ─── 星座 ─────────────────────────────────────────────────────
// [星座, 這個星座最後一天的月, 日]，依國曆順序
const SIGNS: [string, number, number][] = [
  ["摩羯座", 1, 19],
  ["水瓶座", 2, 18],
  ["雙魚座", 3, 20],
  ["牡羊座", 4, 19],
  ["金牛座", 5, 20],
  ["雙子座", 6, 21],
  ["巨蟹座", 7, 22],
  ["獅子座", 8, 22],
  ["處女座", 9, 22],
  ["天秤座", 10, 23],
  ["天蠍座", 11, 22],
  ["射手座", 12, 21],
  ["摩羯座", 12, 31],
];

export const signOf = (month: number, day: number): string =>
  SIGNS.find(([, m, d]) => month < m || (month === m && day <= d))?.[0] ??
  "摩羯座";

/** 「2025-03-08」→ 年月日；格式不對或日期不存在回傳 null */
export const parseBirthday = (value: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(year, month - 1, day);
  if (date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return { year, month, day };
};

// ─── 一般版：固定文字 ─────────────────────────────────────────
const ZODIAC_TEXT: Record<Zodiac, { trait: string; talent: string; blessing: string }> = {
  鼠: { trait: "機靈聰明、反應超快", talent: "觀察力敏銳，學什麼都上手", blessing: "願你一生機智靈巧，處處逢貴人" },
  牛: { trait: "踏實穩重、做事認真", talent: "有耐心又有毅力，越磨越發光", blessing: "願你腳踏實地，一步步走出自己的路" },
  虎: { trait: "勇敢自信、活力滿滿", talent: "天生有領導魅力，敢於嘗試", blessing: "願你勇往直前，健健康康虎虎生風" },
  兔: { trait: "溫柔細心、人緣超好", talent: "心思細膩，很會照顧身邊的人", blessing: "願你被溫柔包圍，平安喜樂每一天" },
  龍: { trait: "神采飛揚、充滿自信", talent: "想像力豐富，常有大膽的點子", blessing: "願你志向遠大，飛得又高又遠" },
  蛇: { trait: "聰慧沉穩、很有想法", talent: "思考深入，做決定冷靜又精準", blessing: "願你智慧滿滿，凡事順心如意" },
  馬: { trait: "熱情開朗、閒不下來", talent: "行動力一流，喜歡探索新世界", blessing: "願你馬到成功，自由快樂地奔跑" },
  羊: { trait: "溫和善良、充滿藝術感", talent: "感受力強，對美的事物特別敏銳", blessing: "願你被愛環繞，生活溫暖又美好" },
  猴: { trait: "古靈精怪、好奇心旺盛", talent: "點子多又靈活，解決問題很有一套", blessing: "願你快樂學習，每天都充滿驚喜" },
  雞: { trait: "精神抖擻、做事有條理", talent: "注重細節，表達能力很出色", blessing: "願你閃閃發亮，努力都有好收穫" },
  狗: { trait: "忠誠可靠、正義感強", talent: "重情重義，是大家信賴的好夥伴", blessing: "願你被真心相待，朋友滿天下" },
  豬: { trait: "樂天知足、福氣滿滿", talent: "心胸寬大，總能帶給大家歡笑", blessing: "願你吃飽睡好，一生福氣滿滿" },
};

const SIGN_TEXT: Record<string, string> = {
  牡羊座: "做什麼都充滿衝勁",
  金牛座: "很懂得享受生活的美好",
  雙子座: "活潑健談、好奇心滿點",
  巨蟹座: "特別戀家、很會照顧人",
  獅子座: "天生就是人群中的小太陽",
  處女座: "細心又追求完美",
  天秤座: "優雅體貼、很有美感",
  天蠍座: "專注又有洞察力",
  射手座: "樂觀自由、熱愛冒險",
  摩羯座: "穩重踏實、目標明確",
  水瓶座: "想法獨特、充滿創意",
  雙魚座: "溫柔浪漫、想像力豐富",
};

export const templateFortune = (
  zodiac: Zodiac,
  sign: string,
  item: PlayItem,
): FortuneSections => {
  const z = ZODIAC_TEXT[zodiac];
  const meaning = item.meaning ? `，象徵「${item.meaning}」` : "";
  return {
    personality: `屬${zodiac}的{name}${z.trait}；身為${sign}，${SIGN_TEXT[sign] ?? "有自己獨特的魅力"}。`,
    talent: `抓周抓到了${item.name}${item.emoji}${meaning}。再加上${z.talent}，未來一定能把熱情發揮到最大！`,
    blessing: `${z.blessing}。不管將來選擇哪條路，爸爸媽媽都會是{name}最強的後盾！`,
  };
};

// ─── AI 版：提示詞與回應格式 ─────────────────────────────────
export const fortunePrompt = (zodiac: Zodiac, sign: string, item: PlayItem) =>
  [
    "你是台灣抓周派對的主持人，要幫一位剛完成抓周的一歲寶寶寫一張「抓周命盤小卡」。",
    `寶寶資料：生肖屬${zodiac}、${sign}、抓周抓到「${item.name}」${item.meaning ? `（傳統寓意：${item.meaning}）` : ""}。`,
    "請用繁體中文、台灣用語，語氣溫暖可愛、像在對爸媽說話。",
    "一律用「{name}」代稱寶寶（前後不要加空格），不要自己取名字，也不要寫出任何日期。",
    "只能寫正面的祝福與鼓勵：不要預言疾病、災難、感情或任何負面的事，不要提到算命準不準。",
    "回傳 JSON，三個欄位各 40～70 字：",
    "personality：結合生肖與星座描述寶寶的個性；",
    "talent：結合抓到的物品描述寶寶的天賦與可能的興趣；",
    "blessing：給寶寶的一段祝福。",
  ].join("\n");

export const FORTUNE_SCHEMA = {
  type: "OBJECT",
  properties: {
    personality: { type: "STRING" },
    talent: { type: "STRING" },
    blessing: { type: "STRING" },
  },
  required: ["personality", "talent", "blessing"],
} as const;

const MAX_SECTION = 300;

/** 驗證 AI 回傳的內容；格式不對就回傳 null，畫面改用一般版 */
export const parseFortune = (value: unknown): FortuneSections | null => {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  const pick = (k: string) =>
    typeof v[k] === "string" && v[k].trim()
      ? normalizeAiText(v[k] as string).slice(0, MAX_SECTION)
      : null;
  const [personality, talent, blessing] = [pick("personality"), pick("talent"), pick("blessing")];
  return personality && talent && blessing ? { personality, talent, blessing } : null;
};

export const fillName = (sections: FortuneSections, name: string): FortuneSections => ({
  personality: fillPlaceholders(sections.personality, { name }),
  talent: fillPlaceholders(sections.talent, { name }),
  blessing: fillPlaceholders(sections.blessing, { name }),
});
