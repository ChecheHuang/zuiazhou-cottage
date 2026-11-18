"use client";

import { useEffect } from "react";

// 後台「還沒儲存就離開」的提醒。
// 瀏覽器關閉／重新整理用 beforeunload；點左側選單等站內連結（Next.js 不會觸發 beforeunload）
// 則在 document 的捕獲階段攔下點擊，比 <Link> 自己的處理更早執行。

const dirtyKeys = new Set<string>();
let installed = false;

const MESSAGE = "有文字還沒儲存，離開後修改會不見。確定要離開嗎？";

const onClickCapture = (e: MouseEvent) => {
  if (dirtyKeys.size === 0 || e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // 開新分頁不影響目前頁面
  const a = (e.target as Element | null)?.closest?.("a[href]");
  if (!(a instanceof HTMLAnchorElement) || a.target === "_blank") return;
  const url = new URL(a.href, location.href);
  // 同一頁的錨點（例如上方的快速跳轉）不算離開
  if (url.origin === location.origin && url.pathname === location.pathname) return;
  if (window.confirm(MESSAGE)) {
    dirtyKeys.clear();
    return;
  }
  e.preventDefault();
  e.stopPropagation();
};

const onBeforeUnload = (e: BeforeUnloadEvent) => {
  if (dirtyKeys.size > 0) e.preventDefault();
};

const install = () => {
  if (installed) return;
  installed = true;
  document.addEventListener("click", onClickCapture, true);
  window.addEventListener("beforeunload", onBeforeUnload);
};

/** 每個可編輯區塊呼叫一次：dirty 為 true 時，離開頁面前會先問 */
export const useUnsavedGuard = (key: string, dirty: boolean) => {
  useEffect(() => {
    install();
    if (!dirty) return;
    dirtyKeys.add(key);
    return () => {
      dirtyKeys.delete(key);
    };
  }, [key, dirty]);
};
