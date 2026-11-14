// about 頁的文字區塊。每個 export 的 defineBlock(...) 會自動出現在後台。
import { GALLERY_PHOTOS, HOST_PHOTO } from "@/data/photos";
import { defineBlock } from "../schema";

const PAGE = "關於我們";

export const aboutSeo = defineBlock({
  key: "about.seo",
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
    title: "關於我們 - Happy 抓周小屋",
    description: "Happy 抓周小屋主理人團隊的故事、合作餐點夥伴與場地環境照片。",
    image: "/og/about.jpg",
  },
});

export const aboutHero = defineBlock({
  key: "about.hero",
  page: PAGE,
  label: "頁首介紹",
  description: "關於我們頁最上方的標題、品牌故事，以及右側照片上的文字。",
  fields: [
    {
      type: "text",
      key: "watermark",
      label: "標題後方的大字（英文裝飾字）",
    },
    { type: "text", key: "title", label: "主標題" },
    {
      type: "list",
      key: "story",
      label: "品牌故事段落",
      of: "text",
      multiline: true,
      itemLabel: "段落",
      hint: "每一項是一段文字",
    },
    { type: "text", key: "badge", label: "故事下方的小標籤" },
    { type: "text", key: "photoEyebrow", label: "照片上的英文小字" },
    { type: "text", key: "photoCaption", label: "照片上的說明文字" },
  ],
  defaults: {
    watermark: "About",
    title: "關於我們",
    story: [
      "我們是一群熱愛主持、注重孩子與家庭溫度的活動工作者。",
      "從婚禮、抓周到各式親子活動，我們始終相信，人生中每個重要的階段，都值得被認真對待、好好紀念。",
      "希望打造一個空間，不只是讓寶寶抓周，更是讓家人能安心相聚、留下真實互動與溫暖笑聲的地方。",
      "從流程設計、主持節奏、拍攝氛圍到活動細節，我們都親自把關，只為了讓每一個家庭都能帶著滿滿的愛與回憶離開。",
      "歡迎來到 Happy 抓周小屋，把寶寶的第一場派對放心交給我們吧。🤍",
    ],
    badge: "主理人團隊",
    photoEyebrow: "Happy One House",
    photoCaption: "桃園平鎮 · 抓週派對小屋",
  },
});

export const aboutTeams = defineBlock({
  key: "about.teams",
  page: PAGE,
  label: "團隊夥伴",
  description: "「與我們同行的夥伴」區塊，每張卡片是一個團隊，含照片與介紹。",
  fields: [
    { type: "text", key: "watermark", label: "標題後方的大字（英文裝飾字）" },
    { type: "text", key: "title", label: "區塊標題" },
    { type: "text", key: "description", label: "區塊說明" },
    {
      type: "list",
      key: "teams",
      label: "團隊卡片",
      itemLabel: "團隊",
      titleKey: "title",
      of: [
        { type: "image", key: "image", label: "團隊照片" },
        { type: "text", key: "eyebrow", label: "英文小標" },
        { type: "text", key: "title", label: "團隊名稱" },
        { type: "text", key: "desc", label: "介紹文字", multiline: true },
      ],
    },
  ],
  defaults: {
    watermark: "Team",
    title: "與我們同行的夥伴",
    description:
      "主理人團隊與長期合作的餐點夥伴，一起把每一場派對的細節照顧到位。",
    teams: [
      {
        image: HOST_PHOTO,
        eyebrow: "Host",
        title: "主理人團隊",
        desc: "親自參與每一場派對的流程設計、主持節奏與細節掌控，希望讓爸爸媽媽都能放心把寶貝的第一場派對交給我們。",
      },
      {
        image: GALLERY_PHOTOS[2] ?? HOST_PHOTO,
        eyebrow: "Catering Partner",
        title: "合作餐點團隊",
        desc: "長期合作的在地喜慶料理夥伴，從寶寶餐盒、桌菜到甜點，提供完整外燴選擇，讓賓客在儀式結束後直接入座享用。",
      },
    ],
  },
});

const stripFields = [
  {
    type: "text" as const,
    key: "watermark",
    label: "標題後方的大字（英文裝飾字）",
  },
  { type: "text" as const, key: "title", label: "區塊標題" },
  { type: "text" as const, key: "description", label: "區塊說明" },
];

export const aboutPhotos = defineBlock({
  key: "about.photos",
  page: PAGE,
  label: "攝影作品（標題文字）",
  description:
    "「攝影作品」照片牆上方的標題與說明。照片請到後台「圖片」分頁管理。",
  fields: stripFields,
  defaults: {
    watermark: "Photos",
    title: "攝影作品",
    description: "從佈置到寶寶笑容，每一刻都值得珍藏。",
  },
});

export const aboutEnvironment = defineBlock({
  key: "about.environment",
  page: PAGE,
  label: "環境照片（標題文字）",
  description:
    "「環境照片」照片牆上方的標題與說明。照片請到後台「圖片」分頁管理。",
  fields: stripFields,
  defaults: {
    watermark: "Environment",
    title: "環境照片",
    description: "桃園平鎮四大主題場地，從溫馨小聚到大家族派對都適合。",
  },
});
