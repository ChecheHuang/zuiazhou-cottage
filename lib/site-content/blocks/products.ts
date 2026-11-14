import { defineBlock } from "../schema";

const PAGE = "商品專區";

export const productsIntro = defineBlock({
  key: "products.intro",
  page: PAGE,
  label: "商品專區頁首",
  description:
    "商品列表頁最上方的標題與說明。商品本身請到後台「商品」分頁管理。",
  fields: [
    {
      type: "text",
      key: "watermark",
      label: "背景浮水印英文字",
      hint: "標題後方淡色的大字",
    },
    { type: "text", key: "title", label: "標題" },
    { type: "text", key: "description", label: "說明", multiline: true },
    {
      type: "text",
      key: "empty",
      label: "沒有商品時顯示的文字",
    },
  ],
  defaults: {
    watermark: "Shop",
    title: "商品專區",
    description:
      "抓週道具、派對佈置與紀念好物，喜歡的話歡迎用 LINE 詢問或預訂。",
    empty: "商品準備中，敬請期待！",
  },
});

export const productsDetail = defineBlock({
  key: "products.detail",
  page: PAGE,
  label: "商品頁按鈕與文字",
  description: "每個商品頁共用的按鈕與提示文字。",
  fields: [
    { type: "text", key: "inquiryButton", label: "LINE 詢問按鈕文字" },
    {
      type: "text",
      key: "inquiryMessage",
      label: "LINE 預先填好的訊息",
      hint: "客人按下按鈕後，LINE 對話框會先填好這段文字。{商品} 會自動換成商品名稱",
    },
    {
      type: "text",
      key: "inquiryNote",
      label: "按鈕下方的提示",
      multiline: true,
    },
    { type: "text", key: "backLink", label: "返回列表的文字" },
    { type: "text", key: "moreTitle", label: "「其他商品」區塊標題" },
  ],
  defaults: {
    inquiryButton: "LINE 詢問／預訂",
    inquiryMessage: "您好，我想詢問「{商品}」",
    inquiryNote: "按下按鈕會開啟官方 LINE，我們會盡快回覆您。",
    backLink: "← 回商品專區",
    moreTitle: "其他商品",
  },
});

export const productsSeo = defineBlock({
  key: "products.seo",
  page: PAGE,
  label: "頁面標題與描述（SEO）",
  description:
    "商品列表頁在 Google 搜尋結果與分享時顯示的內容。各商品頁會自動使用商品名稱與簡介。",
  fields: [
    { type: "text", key: "title", label: "頁面標題" },
    { type: "text", key: "description", label: "頁面描述", multiline: true },
    {
      type: "image",
      key: "image",
      label: "分享預覽圖",
      hint: "分享到 LINE、Facebook 時顯示的圖片，建議用 1200×630 的橫式照片",
    },
  ],
  defaults: {
    title: "商品專區 - Happy 抓周小屋",
    description:
      "Happy 抓周小屋商品專區：抓週道具、派對佈置與紀念好物，歡迎透過官方 LINE 詢問與預訂。",
    image: "/og/home.jpg",
  },
});
