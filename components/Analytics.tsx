"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { classifyLink, GA_ID, trackEvent } from "@/lib/analytics";

// 按鈕「在哪裡」：優先用最近的 data-track 標記，其次是所在區塊的 id，最後才是頁首／頁尾等外框
const sourceOf = (el: Element) => {
  const tagged = el.closest<HTMLElement>("[data-track]");
  if (tagged) return tagged.dataset.track;
  const section = el.closest("section[id]");
  if (section?.id) return section.id;
  const landmark = el.closest("header, footer, nav, aside");
  return landmark?.tagName.toLowerCase() ?? "page";
};

// GA4：只在有設定評估 ID 時載入。
// 全站的 LINE／電話／地圖／社群連結用一個委派的點擊監聽記錄，各元件不用個別埋點。
export const Analytics = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (!GA_ID) return;
    // 進後台時停用 GA，避免店家自己的操作混進數據
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = isAdmin;
  }, [isAdmin]);

  useEffect(() => {
    if (!GA_ID) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const name = classifyLink(href);
      if (!name) return;
      trackEvent(name, {
        source: sourceOf(a),
        page_path: window.location.pathname,
        link_text: (a.textContent ?? "").trim().slice(0, 40),
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID || isAdmin) return null;
  return <GoogleAnalytics gaId={GA_ID} />;
};
