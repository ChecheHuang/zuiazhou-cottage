"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/components/SiteContentProvider";
import { layoutFloating } from "@/lib/site-content/blocks/layout";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { cn } from "@/lib/cn";

// 手機上往下滑時收起浮動按鈕，往上滑或停下來就出現，閱讀與點選內容時不會被擋住
const SCROLL_DELTA = 8; // 小於這個距離的抖動不算
const SHOW_AFTER_IDLE = 700; // 停止捲動多久後重新出現（毫秒）
const KEEP_NEAR_TOP = 200; // 接近頁首時一律顯示

const LineIcon = () => (
  <svg viewBox="0 0 32 32" className="size-7 md:size-9" aria-hidden fill="currentColor">
    <path d="M16 3.5C7.45 3.5.5 9.06.5 15.92c0 6.15 5.5 11.32 12.93 12.32.5.11 1.18.34 1.36.78.16.4.1 1.02.05 1.43l-.22 1.32c-.07.4-.32 1.5 1.32.82 1.62-.69 8.74-5.15 11.92-8.82 2.2-2.4 3.26-5.13 3.26-8.16 0-6.86-6.95-12.42-15.5-12.42z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg
    viewBox="0 0 26 17"
    className="h-3.5 w-auto"
    aria-hidden
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 14L13 3l11 11" />
  </svg>
);

export const FloatingActions = () => {
  const pathname = usePathname();
  const biz = useContent(siteBusiness);
  const c = useContent(layoutFloating);
  const [showScrollTop, setShowScrollTop] = useState(false);
  // 只在手機尺寸（< md）生效，桌機用 CSS 忽略這個狀態
  const [tucked, setTucked] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      const y = window.scrollY;
      setShowScrollTop(y > 320);
      const delta = y - lastY;
      if (Math.abs(delta) >= SCROLL_DELTA) {
        setTucked(delta > 0 && y > KEEP_NEAR_TOP);
        lastY = y;
      }
      clearTimeout(idle);
      idle = setTimeout(() => setTucked(false), SHOW_AFTER_IDLE);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idle);
    };
  }, []);

  // 收起時往右下滑出畫面並暫停點擊；md 以上不受影響
  const tuckClass = tucked
    ? "max-md:pointer-events-none max-md:translate-x-[150%] max-md:opacity-0"
    : "";

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // 後台頁面不顯示 LINE 和回到頂端按鈕
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <a
        href={biz.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={c.lineLabel}
        className={cn(
          "fixed right-4 z-50 grid size-13 place-items-center rounded-full md:size-16",
          "bg-[#06c755] text-white shadow-[0_8px_24px_rgba(6,199,85,0.45)]",
          "transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_32px_rgba(6,199,85,0.55)]",
          "bottom-[68px] md:bottom-20",
          tuckClass,
        )}
      >
        <LineIcon />
        <span
          aria-hidden
          className="pointer-events-none absolute -top-2 -right-1 h-4 min-w-4 rounded-full bg-white px-1 text-[9px] font-bold leading-4 text-[#06c755] shadow-md md:right-0 md:h-5 md:min-w-5 md:px-1.5 md:text-[10px] md:leading-5"
        >
          {c.lineBadge}
        </span>
      </a>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label={c.scrollTopLabel}
            initial={{ opacity: 0, y: 16, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.85 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "fixed bottom-4 right-5 z-50 grid size-11 place-items-center rounded-md md:bottom-6 md:right-6",
              "bg-brand-accent text-white shadow-lg shadow-brand-accent/40",
              "transition-all duration-300 hover:bg-brand",
              tuckClass,
            )}
          >
            <ArrowUpIcon />
            <span className="sr-only">{c.scrollTopLabel}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
