import { defineBlock } from "../schema";

// 頁首頁尾：每一頁都會出現的導覽列、頁尾、浮動按鈕與網站預設標題

export const layoutSeo = defineBlock({
  key: "layout.seo",
  page: "頁首頁尾",
  label: "網站預設標題與描述（SEO）",
  description:
    "顯示在瀏覽器分頁與 Google 搜尋結果。各頁若有自己的標題會優先使用各頁的設定。",
  fields: [
    { type: "text", key: "title", label: "網站標題" },
    {
      type: "text",
      key: "description",
      label: "網站描述",
      multiline: true,
      hint: "Google 搜尋結果標題下方的說明文字",
    },
    {
      type: "image",
      key: "image",
      label: "分享預覽圖",
      hint: "分享到 LINE、Facebook 時顯示的圖片，建議用 1200×630 的橫式照片",
    },
  ],
  defaults: {
    title: "Happy 抓周小屋｜桃園平鎮抓周派對推薦",
    description:
      "桃園平鎮包場抓週派對、兒童生日派對、性別揭曉派對，從場佈、流程到攝影一站式包辦，給寶貝最美的人生第一場派對。",
    image: "/og/home.jpg",
  },
});

export const layoutHeader = defineBlock({
  key: "layout.header",
  page: "頁首頁尾",
  label: "頁首導覽列",
  description:
    "每一頁最上方的 Logo 文字與選單名稱（電腦版與手機版選單共用）。選單連到的頁面固定，只能改顯示的文字。",
  fields: [
    {
      type: "text",
      key: "logoText",
      label: "Logo 旁的文字",
      hint: "顯示在左上角 Logo 圖案右邊（手機版會隱藏）",
    },
    { type: "text", key: "navHome", label: "選單：首頁" },
    { type: "text", key: "navAbout", label: "選單：關於我們" },
    { type: "text", key: "navBabyParty", label: "選單：寶寶派對" },
    {
      type: "text",
      key: "navBabyPartyZhuazhou",
      label: "寶寶派對下拉：抓周派對",
    },
    {
      type: "text",
      key: "navBabyPartySaliva",
      label: "寶寶派對下拉：收涎派對",
    },
    {
      type: "text",
      key: "navBabyPartyBirthday",
      label: "寶寶派對下拉：生日派對",
    },
    {
      type: "text",
      key: "navBabyPartyGender",
      label: "寶寶派對下拉：性別揭曉派對",
    },
    {
      type: "text",
      key: "navBabyPartyPlay",
      label: "寶寶派對下拉：線上模擬抓周",
    },
    {
      type: "text",
      key: "navBabyPartyInvite",
      label: "寶寶派對下拉：派對邀請文案",
    },
    { type: "text", key: "navPhoto", label: "選單：派對加購方案" },
    {
      type: "text",
      key: "navPhotoPhotographer",
      label: "派對加購方案下拉：攝影師加購",
    },
    {
      type: "text",
      key: "navPhotoOther",
      label: "派對加購方案下拉：其他加購",
    },
    { type: "text", key: "navFood", label: "選單：餐食加購" },
    { type: "text", key: "navProducts", label: "選單：商品專區" },
    { type: "text", key: "navFaq", label: "選單：常見問題" },
    { type: "text", key: "navContact", label: "選單：聯絡我們" },
    {
      type: "text",
      key: "themeRoseLabel",
      label: "主題切換按鈕提示（目前是粉色時）",
      hint: "滑鼠移到右上角圓形配色按鈕時出現的提示",
    },
    {
      type: "text",
      key: "themeTealLabel",
      label: "主題切換按鈕提示（目前是青綠時）",
      hint: "滑鼠移到右上角圓形配色按鈕時出現的提示",
    },
  ],
  defaults: {
    logoText: "抓周小屋",
    navHome: "首頁",
    navAbout: "關於我們",
    navBabyParty: "寶寶派對",
    navBabyPartyZhuazhou: "抓周派對",
    navBabyPartySaliva: "收涎派對",
    navBabyPartyBirthday: "生日派對",
    navBabyPartyGender: "性別揭曉派對",
    navBabyPartyPlay: "線上模擬抓周",
    navBabyPartyInvite: "派對邀請文案",
    navPhoto: "派對加購方案",
    navPhotoPhotographer: "攝影師加購",
    navPhotoOther: "其他加購",
    navFood: "餐食加購",
    navProducts: "商品專區",
    navFaq: "常見問題",
    navContact: "聯絡我們",
    themeRoseLabel: "目前粉色，點擊切換青綠",
    themeTealLabel: "目前青綠，點擊切換粉色",
  },
});

// 選單每一項的顯示開關。key 與 layoutHeader 的文字欄位相同，
// SiteHeader 用同一個 key 查文字與是否顯示。隱藏只是不出現在選單，頁面本身照常可以進入。
const navToggle = (key: string, label: string) => ({
  type: "toggle" as const,
  key,
  label,
});

export const layoutNavVisibility = defineBlock({
  key: "layout.navVisibility",
  page: "頁首頁尾",
  label: "頁首選單顯示／隱藏",
  description:
    "控制最上方選單（電腦版與手機版）要顯示哪些項目。隱藏只是從選單拿掉，頁面本身與其他地方的連結仍然有效。主選單隱藏時，它的下拉項目也會一起隱藏。",
  fields: [
    navToggle("navHome", "首頁"),
    navToggle("navAbout", "關於我們"),
    navToggle("navBabyParty", "寶寶派對"),
    navToggle("navBabyPartyZhuazhou", "寶寶派對下拉：抓周派對"),
    navToggle("navBabyPartySaliva", "寶寶派對下拉：收涎派對"),
    navToggle("navBabyPartyBirthday", "寶寶派對下拉：生日派對"),
    navToggle("navBabyPartyGender", "寶寶派對下拉：性別揭曉派對"),
    navToggle("navBabyPartyPlay", "寶寶派對下拉：線上模擬抓周"),
    navToggle("navBabyPartyInvite", "寶寶派對下拉：派對邀請文案"),
    navToggle("navPhoto", "派對加購方案"),
    navToggle("navPhotoPhotographer", "派對加購方案下拉：攝影師加購"),
    navToggle("navPhotoOther", "派對加購方案下拉：其他加購"),
    navToggle("navFood", "餐食加購"),
    navToggle("navProducts", "商品專區"),
    navToggle("navFaq", "常見問題"),
    navToggle("navContact", "聯絡我們"),
  ],
  defaults: {
    navHome: true,
    navAbout: true,
    navBabyParty: true,
    navBabyPartyZhuazhou: true,
    navBabyPartySaliva: true,
    navBabyPartyBirthday: true,
    navBabyPartyGender: true,
    navBabyPartyPlay: true,
    navBabyPartyInvite: true,
    navPhoto: true,
    navPhotoPhotographer: true,
    navPhotoOther: true,
    navFood: true,
    navProducts: true,
    navFaq: true,
    navContact: true,
  },
});

export const layoutFooter = defineBlock({
  key: "layout.footer",
  page: "頁首頁尾",
  label: "頁尾",
  description:
    "每一頁最下方的介紹文字與版權列。店名、電話、地址與社群連結請到「全站共用 › 店家資訊」修改。",
  fields: [
    {
      type: "text",
      key: "intro",
      label: "頁尾介紹文字",
      multiline: true,
      hint: "顯示在頁尾店名下方，可以換行",
    },
    {
      type: "text",
      key: "copyright",
      label: "版權文字",
      hint: "頁尾最下方的小字。{年份} 會自動換成今年，{店名} 會換成店家資訊裡的店名",
    },
  ],
  defaults: {
    intro:
      "抓週派對 / 生日派對 / 性別揭曉派對｜桃園平鎮包場\n從場佈、流程、主持到攝影，一站式為寶貝留下最美的紀念。",
    copyright: "© {年份} {店名}. Made with warmth in 桃園平鎮.",
  },
});

export const layoutFloating = defineBlock({
  key: "layout.floating",
  page: "頁首頁尾",
  label: "右下角浮動按鈕",
  description: "畫面右下角的 LINE 按鈕與「返回頂端」按鈕。",
  fields: [
    {
      type: "text",
      key: "lineBadge",
      label: "LINE 按鈕上的小標籤",
      hint: "綠色 LINE 按鈕右上角的白色小字",
    },
    {
      type: "text",
      key: "lineLabel",
      label: "LINE 按鈕的說明（給視障朗讀軟體）",
    },
    {
      type: "text",
      key: "scrollTopLabel",
      label: "返回頂端按鈕的說明（給視障朗讀軟體）",
    },
  ],
  defaults: {
    lineBadge: "LINE",
    lineLabel: "加入官方 LINE",
    scrollTopLabel: "返回頂端",
  },
});
