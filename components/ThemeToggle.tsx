"use client";

import { useEffect, useState } from "react";
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

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<Theme>("rose");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readDomTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "rose" ? "teal" : "rose";
    applyTheme(next);
    setTheme(next);
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
