import { defineBlock } from "../schema";

// 排程日曆的設定（後台「全站設定 › 檔期設定」）。
// 預約資料本身在 schedule_bookings 表，由後台「排程日曆」管理。

export const scheduleSettings = defineBlock({
  key: "schedule.settings",
  page: "檔期設定",
  label: "場次與檔期顯示",
  description:
    "每天固定的場次、同一場次最多同時接幾場，以及首頁檔期日曆怎麼判斷「快滿」。主題場地的名稱來自「寶寶派對 › 主題場地方案」。",
  fields: [
    {
      type: "list",
      key: "slots",
      label: "每天的場次",
      of: "text",
      itemLabel: "場次",
      hint: "填開始時間，例如 10:00。改了之後，舊時間的預約仍會保留在後台，但不再算進前台的空檔",
    },
    {
      type: "text",
      key: "perSlotLimit",
      label: "同一場次最多同時幾場",
      hint: "依可以同時出場的主持人數填，例如有 2 位主持人就填 2。不會超過主題場地數",
    },
    {
      type: "text",
      key: "fewThreshold",
      label: "剩幾場以下顯示「快滿」",
      hint: "例如填 1：當天只剩 1 場可接時，前台顯示「快滿」",
    },
    {
      type: "text",
      key: "daysAhead",
      label: "前台顯示未來幾天",
      hint: "例如 90，代表首頁日曆只顯示今天起 90 天內的檔期",
    },
  ],
  defaults: {
    slots: ["10:00", "13:00", "16:00", "19:00"],
    perSlotLimit: "1",
    fewThreshold: "1",
    daysAhead: "90",
  },
});
