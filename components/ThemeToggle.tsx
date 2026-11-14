"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

type Theme = "rose" | "teal";

const STORAGE_KEY = "theme";

const readDomTheme = (): Theme =>
  document.documentElement.dataset.theme === "teal" ? "teal" : "rose";

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === "teal") {
    root.dataset.theme = "teal";
  } else {
    delete root.dataset.theme;
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore quota errors */
  }
};

interface ThemeToggleProps {
  className?: string;
}

// 主題存在 <html data-theme>，以 MutationObserver 訂閱其變化
const subscribeTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
};

const getServerTheme = (): Theme => "rose";

const noopSubscribe = () => () => {};

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const theme = useSyncExternalStore(subscribeTheme, readDomTheme, getServerTheme);
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const toggle = () => {
    applyTheme(theme === "rose" ? "teal" : "rose");
  };

  const label = theme === "rose" ? "目前粉色，點擊切換青綠" : "目前青綠，點擊切換粉色";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "group relative grid size-10 place-items-center rounded-full ring-1 ring-brand-soft/60 bg-white transition-all duration-300 hover:scale-105 hover:ring-brand",
        !mounted && "opacity-70",
        className,
      )}
    >
      <span
        aria-hidden
        className="block size-5 overflow-hidden rounded-full transition-transform duration-500 group-hover:rotate-180"
        style={{
          background:
            "linear-gradient(135deg, #eda09d 0% 50%, #5fb39a 50% 100%)",
        }}
      />
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-1 -right-0.5 size-2.5 rounded-full ring-2 ring-white transition-colors duration-300",
          theme === "rose" ? "bg-[#eda09d]" : "bg-[#5fb39a]",
        )}
      />
    </button>
  );
};
