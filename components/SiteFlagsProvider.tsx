"use client";

import { createContext, useContext } from "react";

// 全站共用、由伺服器算好的狀態（例如有沒有上架商品），讓 Client Component 不用自己再查一次
export interface SiteFlags {
  /** 有至少一個上架商品；沒有時選單不顯示「商品專區」，避免點進去是空頁 */
  hasProducts: boolean;
}

const SiteFlagsContext = createContext<SiteFlags>({ hasProducts: true });

export const SiteFlagsProvider = ({
  flags,
  children,
}: {
  flags: SiteFlags;
  children: React.ReactNode;
}) => <SiteFlagsContext.Provider value={flags}>{children}</SiteFlagsContext.Provider>;

export const useSiteFlags = () => useContext(SiteFlagsContext);
