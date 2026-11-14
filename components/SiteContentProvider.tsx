"use client";

import { createContext, useContext } from "react";
import {
  mergeBlockValue,
  type ContentBlock,
  type ContentRecord,
} from "@/lib/site-content/schema";

const SiteContentContext = createContext<Record<string, unknown>>({});

export const SiteContentProvider = ({
  overrides,
  children,
}: {
  overrides: Record<string, unknown>;
  children: React.ReactNode;
}) => (
  <SiteContentContext.Provider value={overrides}>
    {children}
  </SiteContentContext.Provider>
);

// Client Component 用：const c = useContent(homeAbout)
// 後台有改過就用後台的文字，沒有就用 defineBlock 裡的預設值
export const useContent = <T extends ContentRecord>(
  block: ContentBlock<T>,
): T => mergeBlockValue(block, useContext(SiteContentContext)[block.key]);
