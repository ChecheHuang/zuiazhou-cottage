"use client";

import { useState } from "react";

// 訪客自己的 Gemini API key 存在瀏覽器：
// - 預設 sessionStorage：關掉分頁就清除
// - 勾選「記住」才放 localStorage
// 讀寫都包 try/catch：無痕模式或封鎖儲存空間時仍可使用（只是不會保留）。
const STORAGE_KEY = "zhuazhou.geminiApiKey";

const read = (storage: () => Storage) => {
  try {
    return storage().getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

const write = (storage: () => Storage, value: string | null) => {
  try {
    if (value) storage().setItem(STORAGE_KEY, value);
    else storage().removeItem(STORAGE_KEY);
  } catch {
    // 儲存空間不可用時忽略
  }
};

const local = () => window.localStorage;
const session = () => window.sessionStorage;

// 這個 hook 只在使用者切到 AI 版之後才掛載（hydration 之後），可以直接在初始化時讀儲存空間
export const useGeminiKey = () => {
  const [remember, setRememberState] = useState(
    () => typeof window !== "undefined" && read(local) !== "",
  );
  const [key, setKeyState] = useState(() =>
    typeof window === "undefined" ? "" : read(local) || read(session),
  );

  const persist = (value: string, keep: boolean) => {
    write(keep ? local : session, value.trim() || null);
    write(keep ? session : local, null);
  };

  const setKey = (value: string) => {
    setKeyState(value);
    persist(value, remember);
  };

  const setRemember = (keep: boolean) => {
    setRememberState(keep);
    persist(key, keep);
  };

  const clear = () => {
    setKeyState("");
    write(local, null);
    write(session, null);
  };

  return { key: key.trim(), rawKey: key, setKey, remember, setRemember, clear };
};
