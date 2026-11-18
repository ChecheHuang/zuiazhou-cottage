import { defineBlock } from "../schema";

// AI 功能共用設定（抓周命盤、派對邀請文案）。
// 本站不提供 API key：訪客要用 AI 版時，輸入自己的 Google Gemini API key，
// key 只存在訪客的瀏覽器，直接傳給 Google，不經過本站伺服器。
const PAGE = "AI 功能";

export const aiSettings = defineBlock({
  key: "ai.settings",
  page: PAGE,
  label: "AI 功能設定",
  description:
    "抓周命盤與派對邀請文案的「✨ AI 版」。關掉後只剩一般版（固定文字），訪客看不到 AI 選項。",
  fields: [
    {
      type: "toggle",
      key: "enabled",
      label: "提供 AI 版",
      hint: "關掉後訪客只能用一般版",
    },
    {
      type: "text",
      key: "model",
      label: "Gemini 模型名稱",
      hint: "Google 淘汰舊模型時改這裡即可，例如 gemini-3.5-flash-lite",
    },
    { type: "text", key: "modeNormal", label: "一般版按鈕" },
    { type: "text", key: "modeAi", label: "AI 版按鈕" },
    { type: "text", key: "keyLabel", label: "API key 輸入框標題" },
    { type: "text", key: "keyPlaceholder", label: "API key 輸入框提示文字" },
    { type: "text", key: "rememberLabel", label: "記住 key 的勾選文字" },
    { type: "text", key: "clearKey", label: "清除 key 按鈕" },
    {
      type: "text",
      key: "keyPrivacy",
      label: "key 隱私說明",
      multiline: true,
    },
    { type: "text", key: "keyHelpTitle", label: "如何取得 key 的標題" },
    {
      type: "text",
      key: "keyHelpUrl",
      label: "取得 key 的網址",
      hint: "訪客點「前往取得 key」會在新分頁開啟這個網址",
    },
    { type: "text", key: "keyHelpLinkText", label: "前往取得 key 的按鈕文字" },
    {
      type: "list",
      key: "keyHelpSteps",
      label: "如何取得 key 的步驟",
      of: "text",
      itemLabel: "步驟",
    },
    { type: "text", key: "generating", label: "AI 撰寫中的提示" },
    { type: "text", key: "errorNoKey", label: "錯誤：還沒輸入 key" },
    { type: "text", key: "errorInvalidKey", label: "錯誤：key 無效" },
    { type: "text", key: "errorQuota", label: "錯誤：額度用完" },
    { type: "text", key: "errorModel", label: "錯誤：模型名稱不存在" },
    { type: "text", key: "errorGeneric", label: "錯誤：其他" },
  ],
  defaults: {
    enabled: true,
    model: "gemini-3.5-flash-lite",
    modeNormal: "簡單版",
    modeAi: "✨ AI 寫得更豐富",
    keyLabel: "你的 Gemini API key",
    keyPlaceholder: "貼上 AIza 開頭的 key",
    rememberLabel: "在這台裝置記住",
    clearKey: "清除 key",
    keyPrivacy:
      "key 只存在你的瀏覽器，直接傳給 Google，不會經過本站伺服器。寶寶的名字與生日也不會送出，只會送出生肖、星座與抓到的物品。",
    keyHelpTitle: "怎麼免費取得 Gemini API key？",
    keyHelpUrl: "https://aistudio.google.com/apikey",
    keyHelpLinkText: "前往 Google AI Studio 取得 key",
    keyHelpSteps: [
      "點上方按鈕，用 Google 帳號登入 Google AI Studio",
      "按「Create API key」建立一組 key",
      "複製 AIza 開頭的 key，貼到上面的輸入框",
    ],
    generating: "AI 撰寫中，請稍候…",
    errorNoKey: "請先輸入你的 Gemini API key。",
    errorInvalidKey: "這組 API key 無效，請確認有沒有貼完整。",
    errorQuota: "這組 key 的免費額度暫時用完了，請稍後再試，或先用一般版。",
    errorModel: "AI 模型暫時無法使用，請先用一般版。",
    errorGeneric: "AI 暫時沒有回應，已先幫你換成一般版的內容。",
  },
});
