"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { businessInfo } from "@/data/home";
import { cn } from "@/lib/cn";

const LineIcon = () => (
  <svg
    viewBox="0 0 32 32"
    className="size-9"
    aria-hidden
    fill="currentColor"
  >
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <a
        href={businessInfo.socials.line}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="加入官方 LINE"
        className={cn(
          "fixed right-4 z-50 grid size-16 place-items-center rounded-full",
          "bg-[#06c755] text-white shadow-[0_8px_24px_rgba(6,199,85,0.45)]",
          "transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_32px_rgba(6,199,85,0.55)]",
          "bottom-[72px] md:bottom-20",
        )}
      >
        <LineIcon />
        <span
          aria-hidden
          className="pointer-events-none absolute -top-2 right-0 h-5 min-w-5 rounded-full bg-white px-1.5 text-[10px] font-bold leading-5 text-[#06c755] shadow-md"
        >
          LINE
        </span>
      </a>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label="返回頂端"
            initial={{ opacity: 0, y: 16, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.85 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "fixed bottom-6 right-6 z-50 grid size-11 place-items-center rounded-md",
              "bg-brand-accent text-white shadow-lg shadow-brand-accent/40",
              "transition-colors duration-300 hover:bg-brand",
            )}
          >
            <ArrowUpIcon />
            <span className="sr-only">返回頂端</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
