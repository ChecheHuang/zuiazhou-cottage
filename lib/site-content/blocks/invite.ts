import { defineBlock } from "../schema";

// 派對邀請文案產生器（/invite）
const PAGE = "派對邀請文案";

export const inviteSeo = defineBlock({
  key: "invite.seo",
  page: PAGE,
  label: "頁面標題與描述（SEO）",
  description: "顯示在瀏覽器分頁與 Google 搜尋結果。",
  fields: [
    { type: "text", key: "title", label: "頁面標題" },
    { type: "text", key: "description", label: "頁面描述", multiline: true },
    {
      type: "image",
      key: "image",
      label: "分享預覽圖",
      hint: "建議用 1200×630 的橫式照片",
    },
  ],
  defaults: {
    title: "派對邀請文案產生器 - Happy 抓周小屋",
    description:
      "抓周、收涎、生日、性別揭曉派對的 LINE 邀請訊息一鍵產生，選好場地與語氣就能直接分享給親朋好友。",
    image: "/og/party.jpg",
  },
});

export const inviteForm = defineBlock({
  key: "invite.form",
  page: PAGE,
  label: "產生器文字",
  description:
    "頁面標題、表單欄位與按鈕。產生的訊息最後會自動加上店名與地址（來自「全站共用 › 店家資訊」）。",
  fields: [
    { type: "text", key: "watermark", label: "背景浮水印英文字" },
    { type: "text", key: "title", label: "標題" },
    { type: "text", key: "description", label: "標題下方說明", multiline: true },
    { type: "text", key: "partyTypeLabel", label: "派對類型標題" },
    { type: "text", key: "venueLabel", label: "場地標題" },
    { type: "text", key: "venueOther", label: "場地選項：其他／未定" },
    { type: "text", key: "toneLabel", label: "語氣標題" },
    { type: "text", key: "nameLabel", label: "寶寶小名標題" },
    { type: "text", key: "namePlaceholder", label: "寶寶小名提示文字" },
    { type: "text", key: "dateLabel", label: "日期標題" },
    { type: "text", key: "timeLabel", label: "時間標題" },
    { type: "text", key: "generateButton", label: "產生按鈕" },
    { type: "text", key: "resultTitle", label: "結果標題" },
    { type: "text", key: "copyButton", label: "複製按鈕" },
    { type: "text", key: "copied", label: "已複製的提示" },
    { type: "text", key: "lineShareButton", label: "分享到 LINE 按鈕" },
    { type: "text", key: "regenerateButton", label: "重新產生按鈕" },
    { type: "text", key: "footerPrefix", label: "訊息結尾的店名前綴", hint: "例如「📍」" },
    { type: "text", key: "unsetValue", label: "沒填日期或時間時顯示的文字" },
  ],
  defaults: {
    watermark: "Invitation",
    title: "派對邀請文案產生器",
    description: "選好派對類型、場地和語氣，一鍵產生 LINE 邀請訊息，直接傳給親朋好友！",
    partyTypeLabel: "派對類型",
    venueLabel: "場地",
    venueOther: "其他／還沒決定",
    toneLabel: "語氣",
    nameLabel: "寶寶小名",
    namePlaceholder: "例如：小湯圓",
    dateLabel: "日期",
    timeLabel: "時間",
    generateButton: "產生邀請文案",
    resultTitle: "邀請訊息",
    copyButton: "複製文字",
    copied: "已複製，貼到 LINE 群組吧！",
    lineShareButton: "分享到 LINE",
    regenerateButton: "換一個寫法",
    footerPrefix: "📍",
    unsetValue: "（待定）",
  },
});
