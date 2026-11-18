import { defineBlock } from "../schema";

// 預算試算頁（/budget）。項目與價格不在這裡改：
// 場地來自「寶寶派對 › 主題場地方案」，攝影與其他加購來自「派對加購」，餐點來自「餐食加購」。
const PAGE = "預算試算";

export const budgetSeo = defineBlock({
  key: "budget.seo",
  page: PAGE,
  label: "搜尋引擎設定（SEO）",
  description: "預算試算頁在 Google 搜尋結果與分頁上的標題與說明。",
  fields: [
    { type: "text", key: "title", label: "網頁標題" },
    { type: "text", key: "description", label: "網頁說明", multiline: true },
    {
      type: "image",
      key: "image",
      label: "分享預覽圖",
      hint: "分享到 LINE、Facebook 時顯示的圖片，建議用 1200×630 的橫式照片",
    },
  ],
  defaults: {
    title: "抓周派對預算試算 - Happy 抓周小屋",
    description:
      "選擇主題場地、攝影、加購與餐點，馬上算出抓周派對的預估總花費，一鍵用 LINE 詢問檔期。",
    image: "/og/party.jpg",
  },
});

export const budgetText = defineBlock({
  key: "budget.text",
  page: PAGE,
  label: "頁面文字",
  description:
    "預算試算頁的標題、各步驟名稱與按鈕。可選的項目和價格會自動沿用寶寶派對、派對加購、餐食加購頁的內容，不用在這裡重打。",
  fields: [
    { type: "text", key: "watermark", label: "背景英文浮水印" },
    { type: "text", key: "title", label: "標題" },
    { type: "text", key: "description", label: "標題下方說明", multiline: true },
    { type: "text", key: "roomStep", label: "步驟 1：場地" },
    { type: "text", key: "photoStep", label: "步驟 2：攝影" },
    { type: "text", key: "addonStep", label: "步驟 3：其他加購" },
    { type: "text", key: "foodStep", label: "步驟 4：餐點" },
    { type: "text", key: "noFood", label: "餐點「不需要」選項" },
    { type: "text", key: "tablesLabel", label: "桌數／份數標籤" },
    { type: "text", key: "totalLabel", label: "總計標籤" },
    { type: "text", key: "askPrice", label: "沒有標價時顯示的文字" },
    {
      type: "text",
      key: "partialNote",
      label: "選了沒標價項目時，總計後面的小字",
      hint: "例如「＋單點另計」",
    },
    {
      type: "text",
      key: "note",
      label: "總計下方的提醒",
      multiline: true,
      hint: "例如加時、雙寶、指定主持人等另計費用的說明",
    },
    { type: "text", key: "lineButton", label: "LINE 按鈕文字" },
    {
      type: "text",
      key: "plansLink",
      label: "頁面底部「回去看場地方案」連結文字",
      hint: "留空就不顯示",
    },
    { type: "text", key: "addonsLink", label: "頁面底部「回去看加購內容」連結文字" },
    {
      type: "text",
      key: "lineIntro",
      label: "帶入 LINE 的第一行文字",
      hint: "後面會自動接上客人勾選的項目與預估總計",
    },
  ],
  defaults: {
    watermark: "Budget",
    title: "派對預算試算",
    description: "勾選想要的場地與加購，馬上看到預估總花費。實際金額以 LINE 確認的報價為準。",
    roomStep: "選擇主題場地",
    photoStep: "加購攝影師",
    addonStep: "其他加購",
    foodStep: "餐點",
    noFood: "不需要，自己準備或另外安排",
    tablesLabel: "桌數",
    totalLabel: "預估總計",
    askPrice: "價格另洽",
    partialNote: "＋部分項目另計",
    note: "加時、雙寶加價、指定主持人等費用請參考寶寶派對頁的注意事項；有「起」的項目依實際選擇報價。",
    lineButton: "把清單傳給我們詢問",
    plansLink: "← 回去看場地與流程",
    addonsLink: "看攝影與其他加購細節",
    lineIntro: "您好！我用官網試算了派對預算，想詢問檔期～",
  },
});
