import { THEME_ROOM_PHOTOS } from "./photos";

// 資料來源：Happy抓周小屋 FB 粉專 Reel「寶寶抓周場地怎麼選？四大主題一次看！」
export interface PartyPlan {
  key: "galaxy" | "forest" | "cream" | "fortune";
  title: string;
  price: string;
  features: string[];
  images: { src: string; alt: string }[];
}

const toImages = (srcs: string[], name: string) =>
  srcs.map((src, i) => ({ src, alt: `${name}佈置 ${i + 1}` }));

export const partyPlans: PartyPlan[] = [
  {
    key: "galaxy",
    title: "🎆 星河派對屋",
    price: "$8,880",
    features: [
      "全新開放的 3F 場地，超寬敞的派對空間，適合大家族一起熱鬧慶祝！",
      "推薦 25～100 人",
      "最多容納 150 人",
    ],
    images: toImages(THEME_ROOM_PHOTOS.galaxy, "星河派對屋"),
  },
  {
    key: "forest",
    title: "🌲 森林童話屋",
    price: "$5,980",
    features: [
      "充滿童趣的森林氛圍，陪寶寶展開人生第一場奇妙冒險！",
      "推薦 15～25 人",
    ],
    images: toImages(THEME_ROOM_PHOTOS.forest, "森林童話屋"),
  },
  {
    key: "cream",
    title: "🐻 奶油寶貝屋",
    price: "$5,980",
    features: [
      "溫柔療癒的奶油色系，簡約又溫馨，怎麼拍都可愛！",
      "推薦 15～25 人",
    ],
    images: toImages(THEME_ROOM_PHOTOS.cream, "奶油寶貝屋"),
  },
  {
    key: "fortune",
    title: "🧧 福氣滿滿屋",
    price: "$4,980",
    features: [
      "喜氣洋洋的中式抓周風格，給寶寶滿滿的祝福！",
      "推薦 10～15 人",
    ],
    images: toImages(THEME_ROOM_PHOTOS.fortune, "福氣滿滿屋"),
  },
];

export const partyPlanFooterText = {
  intro: "🎁 抓周方案通通包含：",
  bullets: [
    "1.5 小時專屬包場",
    "全套抓周道具＋專業抓周儀式主持",
    "活動側錄＋拍照紀錄",
    "USB 照片檔案現場交付",
    "寶寶抓周證書、敲金蛋儀式、寶寶腳丫拓印",
    "成長紀念相框、祈福卡、簽到證書夾、紀念手提袋",
  ],
  notes: [
    "🎉 現在預約即贈送全台首創「快樂降福儀式」！",
    "💖 從場地佈置到抓周儀式，通通幫爸爸媽媽準備好，只要帶著寶寶和親朋好友一起開心留下回憶就好啦！",
    "➕ 若有需要 攝影 📷 / 餐點 🍜 / 客製化商品 👶，可再參考加購服務。",
  ],
};
