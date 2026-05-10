import { PARTY_PLAN_PHOTOS } from "./photos";

export interface PartyPlan {
  key: "basic" | "floral" | "deluxe";
  title: string;
  features: string[];
  images: { src: string; alt: string }[];
}

const BASIC_FEATURES = [
  "公版主題佈置",
  "氣球佈置（不包含空飄氣球，氣球為加購服務）",
  "抓周儀式主持",
  "抓周道具：聰明門 + 抓周職業道具",
  "古典儀式：吉祥話儀式道具",
  "虎衣抓周服",
  "寶寶照片 8 張，為布置擺放（須先提供檔案）",
  "抓周證書一張 + 足印紀錄",
  "活動使用時間為 1.5 小時",
  "指定主持人，需另加 $2000",
];

const DELUXE_FEATURES = [
  "公版主題佈置（二選一可挑選色系）",
  "氣球佈置（不包含空飄氣球、氣球為加購服務）",
  "抓周儀式主持",
  "抓周道具：聰明門 + 抓周職業道具",
  "古典儀式：吉祥話儀式道具",
  "虎衣抓周服",
  "寶寶照片 8 張，為布置擺放（須先提供檔案）",
  "抓周證書一張 + 足印紀錄",
  "活動使用時間為 1.5 小時",
  "指定主持人，需另加 $2000",
];

export const partyPlans: PartyPlan[] = [
  {
    key: "basic",
    title: "純抓周 +\n慶生派對",
    features: BASIC_FEATURES,
    images: PARTY_PLAN_PHOTOS.basic.map((src, i) => ({
      src,
      alt: `純抓周 + 慶生派對佈置 ${i + 1}`,
    })),
  },
  {
    key: "floral",
    title: "純抓周 +\n慶生經典花叢佈置派對方案",
    features: BASIC_FEATURES,
    images: PARTY_PLAN_PHOTOS.floral.map((src, i) => ({
      src,
      alt: `經典花叢佈置 ${i + 1}`,
    })),
  },
  {
    key: "deluxe",
    title: "純抓周 + 慶生豪華背板佈置派對",
    features: DELUXE_FEATURES,
    images: PARTY_PLAN_PHOTOS.deluxe.map((src, i) => ({
      src,
      alt: `豪華背板佈置 ${i + 1}`,
    })),
  },
];

export const partyPlanFooterText = {
  intro: "以上為我們的純抓周方案，內容包含：",
  bullets: [
    "主持人引導",
    "場地使用",
    "現場佈置（不含空飄氣球，可加購，共 12 種色系；因安全考量無法自行攜帶）",
  ],
  notes: [
    "➕ 若有需要 攝影 📷 / 餐點 🍜（加購餐點可延長使用時間）/ 客製化商品 👶，可再參考加購服務。",
    "🎁 現在預訂，加贈【1-12 月成長相框】乙個，幫寶寶留下每個月的可愛回憶。",
    "✨ 方案圖片僅為公版佈置參考，每場活動可能會有細節差異。",
  ],
};
