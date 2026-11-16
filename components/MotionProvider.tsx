"use client";

import { MotionConfig } from "framer-motion";

// 系統開了「減少動態」時，framer-motion 的位移／縮放／旋轉動畫一律直接跳到結果（淡入淡出保留）
export const MotionProvider = ({ children }: { children: React.ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);
