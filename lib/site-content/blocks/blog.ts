import { defineBlock } from "../schema";

// 部落格（/blog 與 /blog/[slug]）的頁面文字。文章內文在 lib/blog/articles.ts。
const PAGE = "部落格";

export const blogSeo = defineBlock({
  key: "blog.seo",
  page: PAGE,
  label: "文章列表頁的搜尋引擎設定（SEO）",
  description: "/blog 文章列表頁在 Google 搜尋結果與分頁上的標題與說明。",
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
    title: "抓周與周歲派對攻略 - Happy 抓周小屋",
    description:
      "抓周場地怎麼挑、抓周道具與吉祥話、周歲派對流程與習俗，新手爸媽籌備寶寶派對的實用攻略。",
    image: "/og/home.jpg",
  },
});

export const blogText = defineBlock({
  key: "blog.text",
  page: PAGE,
  label: "頁面文字",
  description: "文章列表頁的標題，以及每篇文章裡的按鈕文字。",
  fields: [
    { type: "text", key: "watermark", label: "背景英文浮水印" },
    { type: "text", key: "title", label: "列表頁標題" },
    { type: "text", key: "description", label: "列表頁說明" },
    { type: "text", key: "backLabel", label: "文章頁「回列表」文字" },
    { type: "text", key: "publishedLabel", label: "「發布日期」前的文字" },
    { type: "text", key: "ctaButton", label: "文末 LINE 按鈕文字" },
    { type: "text", key: "plansButton", label: "場地方案下方按鈕文字" },
    { type: "text", key: "moreTitle", label: "文末「其他文章」標題" },
    { type: "text", key: "keyPointsTitle", label: "文章開頭「重點整理」標題" },
    { type: "text", key: "tocTitle", label: "文章目錄標題" },
    {
      type: "text",
      key: "ctaMessage",
      label: "文末 LINE 按鈕帶入的文字",
      multiline: true,
      hint: "{文章} 會換成文章標題，讓你知道客人是看哪篇來的",
    },
  ],
  defaults: {
    watermark: "Blog",
    title: "抓周與周歲派對攻略",
    description: "場地、道具、流程與習俗，新手爸媽籌備寶寶派對的實用整理。",
    backLabel: "← 所有文章",
    publishedLabel: "發布於",
    ctaButton: "用 LINE 詢問檔期",
    plansButton: "看完整方案與照片",
    moreTitle: "延伸閱讀",
    keyPointsTitle: "📌 重點整理",
    tocTitle: "文章目錄",
    ctaMessage:
      "您好！我剛看完官網的「{文章}」，想詢問抓周方案與檔期～\n預計日期：\n人數約：",
  },
});
