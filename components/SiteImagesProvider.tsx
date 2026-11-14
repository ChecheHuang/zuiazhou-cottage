"use client";

import { createContext, useContext } from "react";
import { SLOT_MAP, type SiteImageOverrides } from "@/lib/site-images/slots";

const SiteImagesContext = createContext<SiteImageOverrides>({});

export const SiteImagesProvider = ({
  overrides,
  children,
}: {
  overrides: SiteImageOverrides;
  children: React.ReactNode;
}) => (
  <SiteImagesContext.Provider value={overrides}>
    {children}
  </SiteImagesContext.Provider>
);

// 後台有設定就用後台的圖片，沒有就用預設
const resolve = (overrides: SiteImageOverrides, key: string): string[] => {
  const custom = overrides[key];
  if (custom && custom.length > 0) return custom;
  const slot = SLOT_MAP.get(key);
  if (!slot) throw new Error(`未定義的圖片位置：${key}`);
  return slot.defaults;
};

export const useSlotImages = (key: string): string[] =>
  resolve(useContext(SiteImagesContext), key);

export const useSlotImage = (key: string): string => useSlotImages(key)[0];

// 在 .map() 裡依序取不同位置的圖片時使用（hook 不能在迴圈裡呼叫）
export const useSlotResolver = () => {
  const overrides = useContext(SiteImagesContext);
  return (key: string) => resolve(overrides, key);
};
