import { defineBlock } from "../schema";

// 全站共用：店家資訊（地址、電話、LINE、社群連結…）
export const siteBusiness = defineBlock({
  key: "site.business",
  page: "全站共用",
  label: "店家資訊",
  description:
    "地址、電話、LINE、社群連結等，會顯示在頁尾、聯絡我們、首頁資訊區與各處的 LINE 按鈕。",
  fields: [
    { type: "text", key: "brand", label: "店名" },
    { type: "text", key: "subtitle", label: "副標" },
    { type: "text", key: "tagline", label: "服務標語" },
    {
      type: "text",
      key: "address",
      label: "地址",
      hint: "地圖會依這個地址自動定位",
    },
    { type: "text", key: "landmark", label: "地標說明" },
    { type: "text", key: "hours", label: "營業時間" },
    { type: "text", key: "phone", label: "電話" },
    { type: "text", key: "lineId", label: "LINE ID" },
    { type: "text", key: "lineUrl", label: "LINE 加好友連結" },
    { type: "text", key: "instagram", label: "Instagram 帳號" },
    { type: "text", key: "instagramUrl", label: "Instagram 連結" },
    { type: "text", key: "facebookUrl", label: "Facebook 連結" },
  ],
  defaults: {
    brand: "Happy 抓周小屋",
    subtitle: "桃園平鎮 · 抓週派對小屋",
    tagline: "抓週 × 派對 × 慶生 × 性別趴 × 婚宴 × 求婚",
    address: "桃園市平鎮區延平路二段 146 巷 4 弄 30 號",
    landmark: "平鎮秉坤婦幼醫院正對面巷子",
    hours: "24 小時營業",
    phone: "0981 987 355",
    lineId: "@262qhmgi",
    lineUrl: "https://line.me/R/ti/p/@262qhmgi",
    instagram: "@happyonehouse",
    instagramUrl: "https://www.instagram.com/happyonehouse",
    facebookUrl: "https://www.facebook.com/happyonehouse913/",
  },
});

export const mapEmbedUrlFor = (address: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(
    address.replace(/\s/g, ""),
  )}&hl=zh-TW&z=16&output=embed`;

export const telHref = (phone: string) =>
  `tel:${phone.replace(/[^0-9+]/g, "")}`;
