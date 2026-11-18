// photo 頁的文字區塊。每個 export 的 defineBlock(...) 會自動出現在後台。
import { defineBlock } from "../schema";

const PAGE = "派對加購";

export const photoSeo = defineBlock({
  key: "photo.seo",
  page: PAGE,
  label: "搜尋引擎與分頁標題",
  description: "瀏覽器分頁上的標題，以及 Google 搜尋結果下方的說明文字。",
  fields: [
    { type: "text", key: "title", label: "分頁標題" },
    { type: "text", key: "description", label: "頁面說明", multiline: true },
    {
      type: "image",
      key: "image",
      label: "分享預覽圖",
      hint: "分享到 LINE、Facebook 時顯示的圖片，建議用 1200×630 的橫式照片",
    },
  ],
  defaults: {
    title: "派對加購方案 - Happy 抓周小屋",
    description:
      "攝影師加購、空飄氣球、客製立牌、寶寶猜測版等加購方案，自由搭配為派對升級。",
    image: "/og/photo.jpg",
  },
});

export const photoPlan = defineBlock({
  key: "photo.plan",
  page: PAGE,
  label: "攝影師加購方案",
  description:
    "派對加購頁最上方的攝影師方案：標題、價格、服務內容與按鈕文字。左側照片請到後台「圖片」分頁管理。",
  fields: [
    { type: "text", key: "eyebrow", label: "標題後方的大字（英文裝飾字）" },
    { type: "text", key: "title", label: "主標題" },
    { type: "text", key: "priceLabel", label: "價格前的小字" },
    { type: "text", key: "price", label: "價格" },
    {
      type: "list",
      key: "bullets",
      label: "服務內容",
      of: "text",
      itemLabel: "項目",
    },
    {
      type: "text",
      key: "note",
      label: "備註框文字",
      multiline: true,
      hint: "前面會自動加上「※」；留空則不顯示備註框",
    },
    { type: "text", key: "lineButton", label: "LINE 按鈕文字" },
    { type: "text", key: "otherButton", label: "「查看其他加購」按鈕文字" },
  ],
  defaults: {
    eyebrow: "Photograph",
    title: "攝影師加購方案",
    priceLabel: "方案費用",
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
    lineButton: "LINE 線上諮詢",
    otherButton: "查看其他加購",
  },
});

export const photoPortfolio = defineBlock({
  key: "photo.portfolio",
  page: PAGE,
  label: "攝影作品（標題文字）",
  description:
    "「攝影作品」照片牆上方的標題、說明與下方按鈕。照片請到後台「圖片」分頁管理。",
  fields: [
    { type: "text", key: "watermark", label: "標題後方的大字（英文裝飾字）" },
    { type: "text", key: "title", label: "區塊標題" },
    { type: "text", key: "description", label: "區塊說明" },
    { type: "text", key: "moreButton", label: "照片牆下方按鈕文字" },
    {
      type: "text",
      key: "igButton",
      label: "「到 IG 看更多」按鈕文字",
      hint: "連到「店家資訊」的 Instagram 連結；留空就不顯示",
    },
  ],
  defaults: {
    watermark: "Portfolio",
    title: "攝影作品",
    description: "長期合作的攝影師團隊，擅長捕捉寶寶最真實的表情與互動。",
    moreButton: "我要看更多照片",
    igButton: "到 IG 看更多作品與 Reels",
  },
});

export const photoAddons = defineBlock({
  key: "photo.addons",
  page: PAGE,
  label: "其他加購方案",
  description: "氣球、立牌等加購項目卡片，以及下方按鈕文字。",
  fields: [
    { type: "text", key: "watermark", label: "標題後方的大字（英文裝飾字）" },
    { type: "text", key: "title", label: "區塊標題" },
    { type: "text", key: "description", label: "區塊說明" },
    {
      type: "list",
      key: "items",
      label: "加購項目",
      itemLabel: "加購項目",
      titleKey: "name",
      of: [
        {
          type: "text",
          key: "emoji",
          label: "小圖示（表情符號）",
          hint: "例如 🎈，顯示在卡片左上角",
        },
        { type: "text", key: "name", label: "項目名稱" },
        { type: "text", key: "price", label: "價格" },
      ],
    },
    { type: "text", key: "lineButton", label: "LINE 按鈕文字" },
    { type: "text", key: "backButton", label: "「回派對方案」按鈕文字" },
  ],
  defaults: {
    watermark: "Add-ons",
    title: "其他加購方案",
    description: "氣球、立牌、客製化道具，依需求自由搭配，讓派對更有質感。",
    items: [
      { emoji: "🎀", name: "80 公分迎賓立牌", price: "$980" },
      { emoji: "🎂", name: "30 公分迎賓立牌 × 2", price: "$900" },
      {
        emoji: "🎈",
        name: "空飄氣球 2 串（每串 5 顆，可選色）",
        price: "$900",
      },
      { emoji: "🎉", name: "空飄氣球數字 1（52 公分）", price: "$750" },
      { emoji: "✨", name: "客製化猜測版", price: "$1,000" },
      { emoji: "🍼", name: "寶寶抓週猜測版", price: "$700" },
      { emoji: "💧", name: "寶寶客製化小水 16 入", price: "$600" },
    ],
    lineButton: "LINE 線上諮詢",
    backButton: "回派對方案",
  },
});
