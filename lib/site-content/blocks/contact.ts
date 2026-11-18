import { defineBlock } from "../schema";
import { siteBusiness, telHref } from "./site";

// 聯絡我們頁（/contact）

type Business = typeof siteBusiness.defaults;

// 文字裡可以用 {地址}、{電話}… 帶入「店家資訊」的內容，改店家資訊時這裡會跟著變
const BUSINESS_TOKENS: Record<string, keyof Business> = {
  店名: "brand",
  地址: "address",
  地標說明: "landmark",
  營業時間: "hours",
  電話: "phone",
  "LINE ID": "lineId",
  "LINE 連結": "lineUrl",
  "Instagram 帳號": "instagram",
  "Instagram 連結": "instagramUrl",
  "Facebook 連結": "facebookUrl",
};

const TOKEN_HINT = Object.keys(BUSINESS_TOKENS)
  .map((t) => `{${t}}`)
  .join("、");

export const fillBusinessTokens = (text: string, biz: Business) =>
  text.replace(/\{([^{}]+)\}/g, (match, name: string) => {
    const field = BUSINESS_TOKENS[name];
    return field ? biz[field] : match;
  });

// 連結：http 開頭照用；tel: 開頭會把電話整理成可撥號的格式
export const contactCardHref = (link: string, biz: Business) => {
  const filled = fillBusinessTokens(link, biz).trim();
  if (!filled) return undefined;
  if (filled.startsWith("tel:")) return telHref(filled.slice(4));
  return filled;
};

export const contactSeo = defineBlock({
  key: "contact.seo",
  page: "聯絡我們",
  label: "頁面標題與描述（SEO）",
  description: "顯示在瀏覽器分頁與 Google 搜尋結果。",
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
    title: "聯絡我們 - Happy 抓周小屋",
    description:
      "桃園平鎮 Happy 抓周小屋聯絡資訊、地圖與線上預約表單，歡迎留言或加 LINE 諮詢。",
    image: "/og/contact.jpg",
  },
});

export const contactIntro = defineBlock({
  key: "contact.intro",
  page: "聯絡我們",
  label: "頁面開頭標題",
  description: "聯絡我們頁最上方的大標題與說明。",
  fields: [
    {
      type: "text",
      key: "watermark",
      label: "背景浮水印英文字",
      hint: "標題後方淡色的大字",
    },
    { type: "text", key: "title", label: "標題" },
    {
      type: "text",
      key: "description",
      label: "標題下方說明",
    },
  ],
  defaults: {
    watermark: "Contact Us",
    title: "聯絡我們",
    description:
      "想預約抓週、收涎或生日派對？歡迎透過 LINE 或下方表單與我們聯絡。",
  },
});

export const contactCards = defineBlock({
  key: "contact.cards",
  page: "聯絡我們",
  label: "聯絡資訊卡片",
  description: `標題下方的一排聯絡方式卡片，可新增、刪除、調整順序。文字與連結裡可以寫 ${TOKEN_HINT}，會自動帶入「全站共用 › 店家資訊」的內容。`,
  fields: [
    {
      type: "list",
      key: "items",
      label: "卡片",
      itemLabel: "卡片",
      titleKey: "eyebrow",
      of: [
        {
          type: "text",
          key: "icon",
          label: "圖示",
          hint: "一個表情符號，例如 📍 📞 💬",
        },
        { type: "text", key: "eyebrow", label: "上方小字（英文）" },
        { type: "text", key: "title", label: "標題" },
        { type: "text", key: "value", label: "內容" },
        {
          type: "text",
          key: "link",
          label: "點擊連結",
          hint: "留空就不能點。電話請寫 tel:{電話}，網址請寫完整（https://…）",
        },
      ],
    },
  ],
  defaults: {
    items: [
      {
        icon: "📍",
        eyebrow: "Address",
        title: "地址",
        value: "{地址}",
        link: "",
      },
      {
        icon: "📞",
        eyebrow: "Phone",
        title: "電話",
        value: "{電話}",
        link: "tel:{電話}",
      },
      {
        icon: "📷",
        eyebrow: "Instagram",
        title: "{Instagram 帳號}",
        value: "@happyonehouse",
        link: "{Instagram 連結}",
      },
      {
        icon: "💬",
        eyebrow: "LINE",
        title: "官方 LINE",
        value: "ID：{LINE ID}（點擊加入）",
        link: "{LINE 連結}",
      },
    ],
  },
});

export const contactLocation = defineBlock({
  key: "contact.location",
  page: "聯絡我們",
  label: "位置資訊",
  description:
    "地圖左上方的標題與地址說明。地圖會依「店家資訊」的地址自動定位。",
  fields: [
    { type: "text", key: "eyebrow", label: "標題上方小字（英文）" },
    { type: "text", key: "title", label: "標題" },
    {
      type: "text",
      key: "body",
      label: "地址說明",
      multiline: true,
      hint: `可以換行。可用 ${TOKEN_HINT} 帶入店家資訊`,
    },
    {
      type: "text",
      key: "navButton",
      label: "導航按鈕文字",
      hint: "地圖下方開啟 Google Maps 導航的按鈕；留空就不顯示",
    },
  ],
  defaults: {
    eyebrow: "Find us",
    title: "位置資訊",
    body: "地址：{地址}\n{地標說明}",
    navButton: "📍 用 Google Maps 導航",
  },
});

export const contactForm = defineBlock({
  key: "contact.form",
  page: "聯絡我們",
  label: "聯絡表單",
  description: "地圖右邊的留言表單：標題、欄位名稱、提示文字與按鈕。",
  fields: [
    { type: "text", key: "eyebrow", label: "表單上方小字（英文）" },
    { type: "text", key: "title", label: "表單標題" },
    { type: "text", key: "description", label: "表單說明", multiline: true },
    { type: "text", key: "nameLabel", label: "姓名欄位名稱" },
    {
      type: "text",
      key: "namePlaceholder",
      label: "姓名欄位提示文字",
      hint: "欄位還沒填時顯示的淡色文字",
    },
    { type: "text", key: "phoneLabel", label: "電話欄位名稱" },
    { type: "text", key: "phonePlaceholder", label: "電話欄位提示文字" },
    { type: "text", key: "emailLabel", label: "Email 欄位名稱" },
    { type: "text", key: "emailPlaceholder", label: "Email 欄位提示文字" },
    { type: "text", key: "messageLabel", label: "留言欄位名稱" },
    { type: "text", key: "messagePlaceholder", label: "留言欄位提示文字" },
    {
      type: "text",
      key: "note",
      label: "送出按鈕旁的小字",
      multiline: true,
    },
    { type: "text", key: "submit", label: "送出按鈕文字" },
    {
      type: "text",
      key: "success",
      label: "開啟 LINE 後的提示訊息",
      multiline: true,
      hint: "按下按鈕、開啟 LINE 後出現在表單下方的綠色訊息。客人要在 LINE 裡按傳送才算送出，請不要寫成「已送出」",
    },
  ],
  defaults: {
    eyebrow: "Message us",
    title: "填寫表單，用 LINE 傳給我們",
    description:
      "想預約派對或了解詳細方案？填好下面的資料按「用 LINE 傳送」，會打開官方 LINE 並幫您帶入訊息。",
    nameLabel: "姓名",
    namePlaceholder: "您的稱呼",
    phoneLabel: "電話",
    phonePlaceholder: "0900-000-000",
    emailLabel: "Email",
    emailPlaceholder: "hello@example.com",
    messageLabel: "留言訊息",
    messagePlaceholder: "想了解的派對方案、預計日期、寶寶月齡、預估人數…",
    note: "訊息也會同時複製，若 LINE 沒有自動帶入，直接貼上即可。",
    submit: "用 LINE 傳送",
    success:
      "已開啟 LINE 並帶入訊息（也已複製）。請記得在 LINE 裡按「傳送」，我們才會收到喔！",
  },
});
