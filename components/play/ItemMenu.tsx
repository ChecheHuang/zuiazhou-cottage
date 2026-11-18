"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

// 點地上的物品後，浮在物品上方的小選單：拿掉／換一個。
// 點選單以外的地方或按 Esc 會關閉；點其他物品（data-item-button）交給物品自己切換。

export type MenuAlign = "start" | "center" | "end";

interface ItemMenuProps {
  canRemove: boolean;
  align: MenuAlign;
  removeLabel: string;
  replaceLabel: string;
  minHint: string;
  onRemove: () => void;
  onReplace: () => void;
  onClose: () => void;
}

export const ItemMenu = ({
  canRemove,
  align,
  removeLabel,
  replaceLabel,
  minHint,
  onRemove,
  onReplace,
  onClose,
}: ItemMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (!el || ref.current?.contains(el)) return;
      if (el.closest("[data-item-button]")) return;
      onCloseRef.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      role="menu"
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "absolute bottom-full z-30 mb-1.5 w-max",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
      )}
    >
      {/* 選單在物品上方，提示放在選單上面才不會蓋到物品 */}
      {!canRemove && (
        <p className="mb-1 rounded-full bg-white/90 px-2 py-0.5 text-center text-xs text-brand-ink/70 shadow-sm">
          {minHint}
        </p>
      )}
      <div className="flex gap-1 rounded-full bg-white p-1 shadow-lg ring-1 ring-brand-soft/70">
        <button
          type="button"
          role="menuitem"
          disabled={!canRemove}
          title={canRemove ? undefined : minHint}
          onClick={onRemove}
          className="rounded-full px-2.5 py-1 text-xs text-brand-ink transition-colors sm:px-3 sm:py-1.5 sm:text-sm hover:bg-brand-soft/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {removeLabel}
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={onReplace}
          className="rounded-full bg-brand-strong px-2.5 py-1 text-xs font-medium text-white transition-opacity sm:px-3 sm:py-1.5 sm:text-sm hover:opacity-90"
        >
          {replaceLabel}
        </button>
      </div>
    </motion.div>
  );
};
