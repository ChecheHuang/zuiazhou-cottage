"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { MAT_SIZE, type PlayItem } from "@/lib/play/items";
import { ZhuazhouItemIcon } from "@/components/ZhuazhouItemIcon";

// 浮在畫面上的物品對話框：
// - 加物品：已在地上的顯示為已選，滿了就不能再點，可以連續加，按「完成」關閉
// - 替換：點一樣就直接換掉並關閉，已在地上的物品不能選
// 用 portal 掛到 body：外層有 framer-motion 的 transform，fixed 定位會被困在裡面。
// 點背景、按 ✕ 或 Esc 關閉；開著時鎖住背景捲動。

interface ItemPickerDialogProps {
  items: PlayItem[];
  selected: PlayItem[];
  replacing?: PlayItem;
  onPick: (item: PlayItem) => void;
  onClose: () => void;
  title: string;
  doneLabel: string;
}

export const ItemPickerDialog = ({
  items,
  selected,
  replacing,
  onPick,
  onClose,
  title,
  doneLabel,
}: ItemPickerDialogProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      root.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const picked = new Set(selected.map((m) => m.name));
  const full = selected.length >= MAT_SIZE;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-brand-ink/35 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl outline-none ring-1 ring-brand-soft/60"
      >
        <div className="flex items-start gap-3 border-b border-brand-soft/40 px-5 py-4">
          {replacing && (
            <span className="text-3xl leading-none" aria-hidden>
              <ZhuazhouItemIcon item={replacing} />
            </span>
          )}
          <h2
            id={titleId}
            className="flex-1 pt-1 text-sm font-medium leading-relaxed text-brand-ink"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="grid size-8 shrink-0 place-items-center rounded-full text-brand-ink/60 hover:bg-brand-soft/30 hover:text-brand"
          >
            ✕
          </button>
        </div>

        <ul className="grid grid-cols-4 gap-2 overflow-y-auto overscroll-contain p-4 sm:grid-cols-5">
          {items.map((item) => {
            const on = picked.has(item.name);
            const current = replacing?.name === item.name;
            const locked = on || (!replacing && full);
            return (
              <li key={item.name}>
                <button
                  type="button"
                  aria-pressed={on}
                  disabled={locked}
                  onClick={() => onPick(item)}
                  className={cn(
                    "flex w-full flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-xs transition-all",
                    current
                      ? "bg-brand-soft/50 text-brand ring-2 ring-brand"
                      : on
                        ? "bg-brand-soft/30 text-brand/70"
                        : "bg-brand-beige/60 text-brand-ink/80 hover:scale-105 hover:bg-brand-soft/30",
                    locked && !on && "opacity-40",
                  )}
                >
                  <span className="text-2xl leading-none" aria-hidden>
                    <ZhuazhouItemIcon item={item} />
                  </span>
                  <span className="w-full truncate">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* 替換是點一樣就關閉，不需要完成按鈕 */}
        {!replacing && (
          <div className="border-t border-brand-soft/40 px-5 py-3 text-center">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-brand px-8 py-2 text-sm font-medium text-white"
            >
              {doneLabel}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  );
};
