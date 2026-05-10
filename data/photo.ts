import { GALLERY_PHOTOS, SERVICE_PHOTOS } from "./photos";

export const photographerPlan = {
  eyebrow: "Photograph",
  title: "攝影師加購方案",
  price: "$4,600",
  bullets: [
    "拍攝賓客入場至抓周儀式完成（約 1 小時）",
    "如超時，半小時 1000 元、一小時 2000 元",
    "照片有基本調色，人物不另行精修",
    "約 7-14 個工作天提供電子雲端檔案連結下載",
    "全檔提供，照片量約落在 150-250 張",
    "如有加購餐點服務，開始用餐後將停止拍攝",
  ],
  note: "本抓周之攝影服務由專業攝影師執行，非由現場工作人員隨拍，敬請安心。",
  hero: SERVICE_PHOTOS.babyParty,
};

export const photoPortfolio = GALLERY_PHOTOS.slice(0, 12);

export interface AddonItem {
  name: string;
  price: string;
  emoji: string;
}

export const otherAddons: AddonItem[] = [
  { name: "80 公分迎賓立牌", price: "$980", emoji: "🎀" },
  { name: "30 公分迎賓立牌 × 2", price: "$900", emoji: "🎂" },
  { name: "空飄氣球 2 串（每串 5 顆，可選色）", price: "$900", emoji: "🎈" },
  { name: "空飄氣球數字 1（52 公分）", price: "$750", emoji: "🎉" },
  { name: "客製化猜測版", price: "$1,000", emoji: "✨" },
  { name: "寶寶抓週猜測版", price: "$700", emoji: "🍼" },
  { name: "寶寶客製化小水 16 入", price: "$600", emoji: "💧" },
];
