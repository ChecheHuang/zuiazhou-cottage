import { defineBlock } from "../schema";

// 模擬抓周小遊戲（/play）
// 抓周物品沿用「寶寶派對」的職業物品＋傳統物品，這裡只放遊戲的文字。
const PAGE = "模擬抓周";

export const playSeo = defineBlock({
  key: "play.seo",
  page: PAGE,
  label: "頁面標題與描述（SEO）",
  description:
    "顯示在瀏覽器分頁與 Google 搜尋結果。分享抓周結果時，預覽圖會自動換成抓到的物品。",
  fields: [
    { type: "text", key: "title", label: "頁面標題" },
    { type: "text", key: "description", label: "頁面描述", multiline: true },
    {
      type: "image",
      key: "image",
      label: "分享預覽圖",
      hint: "分享遊戲首頁時顯示的圖片，建議用 1200×630 的橫式照片",
    },
  ],
  defaults: {
    title: "線上模擬抓周 - Happy 抓周小屋",
    description:
      "輸入寶寶的小名，看看寶寶會抓到什麼？線上模擬抓周，玩完分享給親朋好友一起猜猜寶寶的未來！",
    image: "/og/party.jpg",
  },
});

export const playGame = defineBlock({
  key: "play.game",
  page: PAGE,
  label: "遊戲文字",
  description:
    "遊戲畫面上的標題、按鈕與結果文字。有 {name} 的地方會換成寶寶的小名，{item} 會換成抓到的物品。",
  fields: [
    {
      type: "text",
      key: "watermark",
      label: "背景浮水印英文字",
      hint: "標題後方淡色的大字",
    },
    { type: "text", key: "title", label: "標題" },
    { type: "text", key: "description", label: "標題下方說明", multiline: true },
    { type: "text", key: "nameLabel", label: "小名輸入框標題" },
    { type: "text", key: "namePlaceholder", label: "小名輸入框提示文字" },
    {
      type: "text",
      key: "defaultName",
      label: "沒填小名時的稱呼",
      hint: "例如「寶寶」",
    },
    {
      type: "text",
      key: "modeRoom",
      label: "房間模式名稱",
      hint: "嬰兒在房間裡爬去抓物品（預設模式）",
    },
    {
      type: "text",
      key: "modeQuick",
      label: "快速模式名稱",
      hint: "墊子上跑馬燈直接選出結果",
    },
    { type: "text", key: "pickerButton", label: "自選物品按鈕" },
    {
      type: "text",
      key: "pickerHint",
      label: "自選物品說明",
      hint: "{min}、{max} 會換成最少、最多可選的數量",
    },
    { type: "text", key: "shuffleButton", label: "隨機換一批按鈕" },
    { type: "text", key: "pickerDone", label: "自選完成按鈕" },
    { type: "text", key: "startButton", label: "開始按鈕" },
    { type: "text", key: "grabbingText", label: "抓取中的提示文字" },
    {
      type: "text",
      key: "resultTitle",
      label: "結果標題",
      hint: "例如「{name}抓到了{item}！」",
    },
    {
      type: "text",
      key: "blessing",
      label: "結果祝福語",
      multiline: true,
      hint: "顯示在象徵意義下方",
    },
    { type: "text", key: "shareButton", label: "分享按鈕" },
    { type: "text", key: "lineShareButton", label: "分享到 LINE 按鈕" },
    { type: "text", key: "copiedText", label: "連結已複製的提示" },
    { type: "text", key: "againButton", label: "再抓一次按鈕" },
    {
      type: "text",
      key: "sharedIntro",
      label: "朋友點開分享連結時的說明",
      hint: "顯示在結果上方，例如「這是朋友家寶寶的抓周結果」",
    },
    { type: "text", key: "playYourselfButton", label: "朋友自己玩的按鈕" },
    { type: "text", key: "ctaText", label: "結果下方的邀約文字", multiline: true },
    { type: "text", key: "ctaLineButton", label: "LINE 預約按鈕" },
    { type: "text", key: "ctaMoreButton", label: "了解方案按鈕" },
    {
      type: "text",
      key: "disclaimer",
      label: "頁面最下方的小字",
      hint: "留空就不顯示",
    },
  ],
  defaults: {
    watermark: "Let's Play",
    title: "線上模擬抓周",
    description:
      "墊子上擺好了抓周物品，輸入寶寶的小名按下開始，看看寶寶會抓到什麼吧！",
    nameLabel: "寶寶的小名",
    namePlaceholder: "例如：小湯圓（可不填）",
    defaultName: "寶寶",
    modeRoom: "👶 看寶寶爬",
    modeQuick: "⚡ 快速抓",
    pickerButton: "自選物品",
    pickerHint: "挑 {min}～{max} 樣想放在地上的物品",
    shuffleButton: "隨機換一批",
    pickerDone: "完成",
    startButton: "開始抓周",
    grabbingText: "寶寶爬呀爬，正在挑選中…",
    resultTitle: "{name}抓到了{item}！",
    blessing: "不管抓到什麼，都祝福寶貝平安健康、快樂長大！",
    shareButton: "分享結果",
    lineShareButton: "分享到 LINE",
    copiedText: "已複製連結，貼給親友吧！",
    againButton: "再抓一次",
    sharedIntro: "這是親友家寶寶的線上抓周結果",
    playYourselfButton: "換我家寶寶抓抓看",
    ctaText: "線上抓好玩，現場抓更難忘！\n帶寶貝來抓周小屋，留下一輩子的回憶。",
    ctaLineButton: "LINE 預約抓周",
    ctaMoreButton: "看抓周方案",
    disclaimer: "結果為隨機產生，僅供娛樂。",
  },
});
