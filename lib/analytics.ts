import { sendGAEvent } from "@next/third-parties/google";

// GA4 評估 ID（G- 開頭）。沒設定時整個追蹤功能關閉，網站照常運作。
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || "";

// 自訂轉換事件名稱：集中在這裡，GA4 後台「標示為重要事件」時對照用
export type TrackEventName =
  | "click_line" // 開啟店家 LINE 詢問／加好友（最重要的轉換）
  | "share_line" // 把模擬抓周結果、邀請文案分享到 LINE
  | "click_phone" // 點電話撥號
  | "click_map" // 開 Google 地圖導航／看評價
  | "click_social" // 前往 IG／FB
  | "calculate_budget" // 預算試算選了場地
  | "finish_play" // 完成一次線上模擬抓周
  | "generate_invite"; // 產生邀請文案

// 依連結網址判斷是哪一種轉換；不是要追蹤的連結回傳 null
export const classifyLink = (href: string): TrackEventName | null => {
  if (/^https:\/\/(line\.me\/R\/share|social-plugins\.line\.me)/.test(href)) return "share_line";
  if (/^https?:\/\/(line\.me|lin\.ee)\//.test(href)) return "click_line";
  if (href.startsWith("tel:")) return "click_phone";
  if (/google\.[^/]+\/maps|maps\.app\.goo\.gl|g\.page\//.test(href)) return "click_map";
  if (/instagram\.com|facebook\.com/.test(href)) return "click_social";
  return null;
};

export const trackEvent = (
  name: TrackEventName,
  params: Record<string, string | number | undefined> = {},
) => {
  if (!GA_ID || typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;
  sendGAEvent("event", name, params);
};

// 用 window.open 開外部連結的按鈕（不是 <a>，全站點擊監聽抓不到）改呼叫這個
export const openTracked = (url: string, source: string) => {
  const name = classifyLink(url);
  if (name) trackEvent(name, { source, page_path: window.location.pathname });
  window.open(url, "_blank", "noopener,noreferrer");
};
